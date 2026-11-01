import { ACES, DEFAULT_PERSONAL_SETTINGS, type PersonalSettings, type Wager } from '../types'

const KEYS = {
  id: 'pferderennen.playerId',
  name: 'pferderennen.name',
  room: 'pferderennen.room',
  wager: 'pferderennen.lastWager',
  personalSettings: 'pferderennen.personalSettings',
}

// Fallback for when localStorage is unavailable (private mode, blocked storage)
const memory = new Map<string, string>()

function read(key: string): string | null {
  try {
    return localStorage.getItem(key) ?? memory.get(key) ?? null
  } catch {
    return memory.get(key) ?? null
  }
}

function write(key: string, value: string | null) {
  if (value === null) memory.delete(key)
  else memory.set(key, value)
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    // storage blocked; the in-memory value is used instead
  }
}

// crypto.randomUUID only exists in secure contexts, which a LAN dev URL is not
function randomId(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => b.toString(16).padStart(2, '0')).join('')
}

export function getPlayerId(): string {
  let id = read(KEYS.id)
  if (!id) {
    id = randomId()
    write(KEYS.id, id)
  }
  return id
}

export function getStoredName(): string {
  return read(KEYS.name) ?? ''
}

export function storeName(name: string) {
  write(KEYS.name, name)
}

export function getStoredRoom(): string | null {
  return read(KEYS.room)
}

export function storeRoom(code: string | null) {
  write(KEYS.room, code)
}

export type StoredWager = Pick<Wager, 'ace' | 'sips'>

// Last wager placed on this phone, so the next round starts with it. Tied to the room so it doesn't carry over into another one.
export function getStoredWager(code: string): StoredWager | null {
  try {
    const stored = JSON.parse(read(KEYS.wager) ?? 'null')
    if (stored?.room !== code || !ACES.includes(stored.ace) || !Number.isInteger(stored.sips) || stored.sips < 1) return null
    return { ace: stored.ace, sips: stored.sips }
  } catch {
    return null
  }
}

export function storeWager(code: string, wager: StoredWager) {
  write(KEYS.wager, JSON.stringify({ room: code, ...wager }))
}

// This phone's personal settings, with the defaults filled in for anything not stored
export function getPersonalSettings(): PersonalSettings {
  try {
    return { ...DEFAULT_PERSONAL_SETTINGS, ...JSON.parse(read(KEYS.personalSettings) ?? '{}') }
  } catch {
    return DEFAULT_PERSONAL_SETTINGS
  }
}

export function storePersonalSetting<K extends keyof PersonalSettings>(key: K, value: PersonalSettings[K]) {
  write(KEYS.personalSettings, JSON.stringify({ ...getPersonalSettings(), [key]: value }))
}
