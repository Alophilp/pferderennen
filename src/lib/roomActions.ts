import {
  endAt,
  get,
  increment,
  orderByChild,
  query,
  ref,
  remove,
  runTransaction,
  serverTimestamp,
  set,
  update,
} from 'firebase/database'
import { getDb } from '../firebase'
import { isStale, ROOM_MAX_IDLE_MS } from './helpers'
import { ERROR_NO_FREE_ROOM_CODE, ERROR_ROOM_NOT_FOUND } from '../textValues'
import type { Ace, Room, Settings } from '../types'
import { getPlayerId } from './player'

// All writes to the database. Every phone re-renders from the room data, so these only change data.

// No I/O to avoid confusion with 1/0 when reading codes aloud
const CODE_LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'

function roomRef(code: string, path?: string) {
  return ref(getDb(), path ? `rooms/${code}/${path}` : `rooms/${code}`)
}

function randomCode(): string {
  return Array.from(crypto.getRandomValues(new Uint32Array(4)), (n) => CODE_LETTERS[n % CODE_LETTERS.length]).join('')
}

// Creates a room with the current player as host and returns its code
export async function createRoom(name: string): Promise<string> {
  const playerId = getPlayerId()
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomCode()
    const room = {
      hostId: playerId,
      phase: 'lobby',
      locked: false,
      round: 1,
      players: { [playerId]: { name, joinedAt: Date.now() } },
      lastActive: serverTimestamp(),
    }
    // The transaction only writes if the code is free (a stale room counts as free)
    const { committed } = await runTransaction(roomRef(code), (current: Room | null) =>
      current === null || isStale(current) ? room : undefined,
    )
    if (committed) {
      // Housekeeping runs in the background; a failure (e.g. database rules not updated) must not block the new room
      deleteStaleRooms().catch((e) => console.warn('Deleting stale rooms failed:', e))
      return code
    }
  }
  throw new Error(ERROR_NO_FREE_ROOM_CODE)
}

// Deletes every room that has been unused for longer than ROOM_MAX_IDLE_MS.
// Rooms without a timestamp sort first in the query, so they're included.
async function deleteStaleRooms() {
  const cutoff = Date.now() - ROOM_MAX_IDLE_MS
  const stale = await get(query(ref(getDb(), 'rooms'), orderByChild('lastActive'), endAt(cutoff)))
  const removals: Record<string, null> = {}
  stale.forEach((room) => {
    removals[room.key] = null
  })
  if (Object.keys(removals).length > 0) await update(ref(getDb(), 'rooms'), removals)
}

// Adds the current player to a room. Players already in the room may rejoin even when it's locked.
// Newcomers to a locked room send a join request instead (in any phase; the host answers it while wagering).
export async function joinRoom(code: string, name: string): Promise<void> {
  const playerId = getPlayerId()
  const room = (await get(roomRef(code))).val() as Room | null
  if (!room || isStale(room)) throw new Error(ERROR_ROOM_NOT_FOUND(code))
  const request = room.requests?.[playerId]
  if (request?.status === 'blocked') return // left waiting forever
  const existing = room.players[playerId]
  if (existing || !room.locked) {
    await set(roomRef(code, `players/${playerId}`), { name, joinedAt: existing?.joinedAt ?? Date.now() })
    return
  }
  if (request?.status === 'pending') return // already waiting
  await set(roomRef(code, `requests/${playerId}`), { name, requestedAt: Date.now(), status: 'pending' })
}

// Host: move a join request into the players
export function acceptJoinRequest(code: string, playerId: string, name: string) {
  return update(roomRef(code), {
    [`players/${playerId}`]: { name, joinedAt: Date.now() },
    [`requests/${playerId}`]: null,
  })
}

// Host: deny a join request; the guest is told and may ask again
export function denyJoinRequest(code: string, playerId: string) {
  return set(roomRef(code, `requests/${playerId}/status`), 'denied')
}

// Host: block a guest; their requests never reach the host again
export function blockJoinRequest(code: string, playerId: string) {
  return set(roomRef(code, `requests/${playerId}/status`), 'blocked')
}

// Host: unblock a guest. Treated like a denial, so a guest still waiting is told and may ask again.
export function unblockJoinRequest(code: string, playerId: string) {
  return set(roomRef(code, `requests/${playerId}/status`), 'denied')
}

// Guest: withdraw the current player's waiting request.
// The transaction only changes a pending request, so it can't undo a block that happened at the same moment.
export function cancelJoinRequest(code: string) {
  return runTransaction(roomRef(code, `requests/${getPlayerId()}/status`), (status) =>
    status === 'pending' ? 'cancelled' : undefined,
  )
}

// Host: lock the room and open wagering
export function startWagering(code: string) {
  return update(roomRef(code), { locked: true, phase: 'wagering', lastActive: serverTimestamp() })
}

// Saves the current player's wager as locked in
export function placeWager(code: string, ace: Ace, sips: number) {
  return set(roomRef(code, `wagers/${getPlayerId()}`), { ace, sips, confirmed: true })
}

// Reopens the current player's wager for editing; they count as "not ready" until they lock in again
export function editWager(code: string) {
  return set(roomRef(code, `wagers/${getPlayerId()}/confirmed`), false)
}

// Host: start the race
export function startRace(code: string) {
  return update(roomRef(code), { phase: 'racing' })
}

// Host: set the winning ace and show the result
export function declareWinner(code: string, winner: Ace) {
  return update(roomRef(code), { winner, phase: 'result' })
}

// Host: clear wagers and winner, then go back to wagering
export function newRound(code: string) {
  return update(roomRef(code), {
    wagers: null,
    winner: null,
    round: increment(1),
    phase: 'wagering',
    lastActive: serverTimestamp(),
  })
}

// Guest: remove the current player and their wager from the room
export function leaveRoom(code: string) {
  const playerId = getPlayerId()
  return update(roomRef(code), { [`players/${playerId}`]: null, [`wagers/${playerId}`]: null })
}

// Host: remove a player and their wager. They may ask to join again.
export function kickPlayer(code: string, playerId: string) {
  return update(roomRef(code), { [`players/${playerId}`]: null, [`wagers/${playerId}`]: null })
}

// Host: remove a player and their wager, and block them. Listed as blocked under join requests, where they can be unblocked.
export function kickAndBlockPlayer(code: string, playerId: string, name: string) {
  return update(roomRef(code), {
    [`players/${playerId}`]: null,
    [`wagers/${playerId}`]: null,
    [`requests/${playerId}`]: { name, requestedAt: Date.now(), status: 'blocked' },
  })
}

// Host: change one setting; every phone picks it up right away
export function updateSetting<K extends keyof Settings>(code: string, key: K, value: Settings[K]) {
  return set(roomRef(code, `settings/${key}`), value)
}

// Host: back to DEFAULT_SETTINGS
export function resetSettings(code: string) {
  return remove(roomRef(code, 'settings'))
}

// Host: delete the room for everyone
export function closeRoom(code: string) {
  return remove(roomRef(code))
}
