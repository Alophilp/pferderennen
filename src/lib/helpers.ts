import { DEFAULT_SETTINGS, type Player, type Room, type Settings } from '../types'

// Players in join order, as [playerId, player] pairs
export function sortedPlayers(room: Room): [string, Player][] {
  return Object.entries(room.players).sort(([, a], [, b]) => a.joinedAt - b.joinedAt)
}

// Rounds the player has lost in a row; 0 if they haven't lost the last round
export function streakOf(room: Room, playerId: string): number {
  return room.streaks?.[playerId] ?? 0
}

// Rooms without a new round for this long count as closed and are deleted the next time someone creates a room
export const ROOM_MAX_IDLE_MS = 12 * 60 * 60 * 1000

// Whether a room has been unused for too long; rooms without a timestamp count as unused.
// Compares with the phone's clock, which is network-synced; 12 hours is far more than any realistic difference.
export function isStale(room: Room): boolean {
  return (room.lastActive ?? 0) < Date.now() - ROOM_MAX_IDLE_MS
}

// Room settings with the defaults filled in for anything not set
export function roomSettings(room: Room): Settings {
  return { ...DEFAULT_SETTINGS, ...room.settings }
}

// Shareable link that opens the app with the room code prefilled
export function roomLink(code: string): string {
  return `${location.origin}${import.meta.env.BASE_URL}?room=${code}`
}
