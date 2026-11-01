export const ACES = ['Herz', 'Blatt', 'Eichel', 'Schelle'] as const
export type Ace = (typeof ACES)[number]

export type Phase = 'lobby' | 'wagering' | 'racing' | 'result'

// Only changes how the aces are shown; the database always stores the Bavarian names from ACES
export type Deck = 'bavarian' | 'french'

// How an ace is labeled: only its suit icon, or the icon followed by its name
export type AceDisplay = 'icon' | 'iconAndName'

export type OnOff = 'off' | 'on'

// Room-wide settings, changed by the host in the lobby
export interface Settings {
  deck: Deck
  aceDisplay: AceDisplay
  distributeSips: OnOff // winners hand out their sips in the app instead of at the table
}

export const DEFAULT_SETTINGS: Settings = {
  deck: 'bavarian',
  aceDisplay: 'icon',
  distributeSips: 'off',
}

// Sips a winner handed out: receiving playerId → sips
export type Distribution = Record<string, number>

export interface Player {
  name: string
  joinedAt: number
}

export interface Wager {
  sips: number
  ace: Ace
  confirmed: boolean
}

// Blocked guests see the normal waiting screen and are never told
export type JoinRequestStatus = 'pending' | 'denied' | 'cancelled' | 'blocked'

// A guest asking to join a locked room. Removed once the host lets them in;
// otherwise kept as history so the host can still block them later.
export interface JoinRequest {
  name: string
  requestedAt: number
  status: JoinRequestStatus
}

export interface Room {
  hostId: string
  phase: Phase
  locked: boolean
  round: number
  players: Record<string, Player>
  wagers?: Record<string, Wager> // cleared each round
  winner?: Ace
  distributions?: Record<string, Distribution> // per winner, set once they confirm; cleared each round
  streaks?: Record<string, number> // rounds lost in a row per player; updated when the winner is declared, kept across rounds
  requests?: Record<string, JoinRequest>
  settings?: Partial<Settings> // missing values fall back to DEFAULT_SETTINGS
  lastActive?: number // server time of the last room creation, game start or new round; missing in rooms from before it existed
}

export interface RoomScreenProps {
  code: string
  room: Room
  playerId: string
  isHost: boolean
}
