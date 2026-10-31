import type { Player, Room } from '../types'

// Players in join order, as [playerId, player] pairs
export function sortedPlayers(room: Room): [string, Player][] {
  return Object.entries(room.players).sort(([, a], [, b]) => a.joinedAt - b.joinedAt)
}

// Shareable link that opens the app with the room code prefilled
export function roomLink(code: string): string {
  return `${location.origin}${import.meta.env.BASE_URL}?room=${code}`
}
