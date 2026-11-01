import type { OnOff } from '../types'
import { getPersonalSettings } from './player'

// One shared audio context for all sounds. Browsers (iOS Safari above all) keep it silent until the player has tapped
// the page, so it's unlocked on the first tap; after that, sounds may also play when the room data changes.
let context: AudioContext | null = null

// Decoded sounds per file URL, loaded on first use
const buffers = new Map<string, Promise<AudioBuffer>>()

function getContext(): AudioContext | null {
  if (!context && typeof AudioContext !== 'undefined') context = new AudioContext()
  return context
}

// Call once at startup. Events that count as a tap for the browser's autoplay rules.
const UNLOCK_EVENTS = ['touchend', 'click', 'keydown'] as const

export function unlockAudioOnFirstTap() {
  const unlock = () => {
    const ctx = getContext()
    if (!ctx) return
    // iOS only unlocks after something has played during the tap, so play one silent sample
    const source = ctx.createBufferSource()
    source.buffer = ctx.createBuffer(1, 1, ctx.sampleRate)
    source.connect(ctx.destination)
    source.start()
    ctx
      .resume()
      .then(() => UNLOCK_EVENTS.forEach((event) => window.removeEventListener(event, unlock, true)))
      .catch(() => {
        // still locked; the next tap tries again
      })
  }
  UNLOCK_EVENTS.forEach((event) => window.addEventListener(event, unlock, true))
}

function loadSound(ctx: AudioContext, url: string): Promise<AudioBuffer> {
  let buffer = buffers.get(url)
  if (!buffer) {
    buffer = fetch(url)
      .then((response) => response.arrayBuffer())
      .then((data) => ctx.decodeAudioData(data))
    // A failed load is retried next time
    buffer.catch(() => buffers.delete(url))
    buffers.set(url, buffer)
  }
  return buffer
}

// Plays a sound file only if both the room setting and this player's own setting allow it.
// Does nothing while audio is still locked, so the sound doesn't start late on the next tap.
export function playSound(url: string, roomSound: OnOff) {
  const ctx = getContext()
  if (!ctx || ctx.state !== 'running' || roomSound !== 'on' || getPersonalSettings().sound !== 'on') return
  loadSound(ctx, url)
    .then((buffer) => {
      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.connect(ctx.destination)
      source.start()
    })
    .catch((e) => console.warn('Playing sound failed:', e))
}
