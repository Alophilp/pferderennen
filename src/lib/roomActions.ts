import { get, increment, ref, remove, runTransaction, set, update } from 'firebase/database'
import { getDb } from '../firebase'
import { ERROR_NO_FREE_ROOM_CODE, ERROR_ROOM_LOCKED, ERROR_ROOM_NOT_FOUND } from '../textValues'
import type { Ace, Room } from '../types'
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
    const room: Room = {
      hostId: playerId,
      phase: 'lobby',
      locked: false,
      round: 1,
      players: { [playerId]: { name, joinedAt: Date.now() } },
    }
    // The transaction only writes if the code is still free
    const { committed } = await runTransaction(roomRef(code), (current) => (current === null ? room : undefined))
    if (committed) return code
  }
  throw new Error(ERROR_NO_FREE_ROOM_CODE)
}

// Adds the current player to a room. Players already in the room may rejoin even when it's locked.
export async function joinRoom(code: string, name: string): Promise<void> {
  const playerId = getPlayerId()
  const room = (await get(roomRef(code))).val() as Room | null
  if (!room) throw new Error(ERROR_ROOM_NOT_FOUND(code))
  const existing = room.players[playerId]
  if (room.locked && !existing) throw new Error(ERROR_ROOM_LOCKED)
  await set(roomRef(code, `players/${playerId}`), { name, joinedAt: existing?.joinedAt ?? Date.now() })
}

// Host: lock the room and open wagering
export function startWagering(code: string) {
  return update(roomRef(code), { locked: true, phase: 'wagering' })
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
  return update(roomRef(code), { wagers: null, winner: null, round: increment(1), phase: 'wagering' })
}

// Guest: remove the current player and their wager from the room
export function leaveRoom(code: string) {
  const playerId = getPlayerId()
  return update(roomRef(code), { [`players/${playerId}`]: null, [`wagers/${playerId}`]: null })
}

// Host: delete the room for everyone
export function closeRoom(code: string) {
  return remove(roomRef(code))
}
