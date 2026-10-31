import { onValue, ref } from 'firebase/database'
import { useEffect, useState } from 'react'
import { getDb } from '../firebase'
import { getPlayerId } from '../lib/player'
import type { Room } from '../types'

export function useRoom(code: string) {
  // Snapshot is tagged with its code so a code change reads as "loading" without resetting state in the effect
  const [snapshot, setSnapshot] = useState<{ code: string; room: Room | null } | null>(null)

  useEffect(
    () => onValue(ref(getDb(), `rooms/${code}`), (s) => setSnapshot({ code, room: s.val() as Room | null })),
    [code],
  )

  const playerId = getPlayerId()
  const loading = snapshot?.code !== code
  const room = loading ? null : snapshot.room
  return {
    room,
    loading,
    playerId,
    isHost: room?.hostId === playerId,
    me: room?.players[playerId] ?? null,
  }
}
