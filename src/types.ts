export const ACES = ['Herz', 'Blatt', 'Eichel', 'Schelle'] as const
export type Ace = (typeof ACES)[number]

export type Phase = 'lobby' | 'wagering' | 'racing' | 'result'

export interface Player {
  name: string
  joinedAt: number
}

export interface Wager {
  sips: number
  ace: Ace
  confirmed: boolean
}

export interface Room {
  hostId: string
  phase: Phase
  locked: boolean
  round: number
  players: Record<string, Player>
  wagers?: Record<string, Wager> // cleared each round
  winner?: Ace
}

export interface RoomScreenProps {
  code: string
  room: Room
  playerId: string
  isHost: boolean
}
