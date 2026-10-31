import { useEffect, useState } from 'react'
import JoinRequestPrompt from './components/JoinRequestPrompt'
import RoomMenu from './components/RoomMenu'
import { isFirebaseConfigured } from './firebase'
import { SettingsContext } from './hooks/useSettings'
import { useRoom } from './hooks/useRoom'
import { roomSettings } from './lib/helpers'
import { getStoredRoom, storeRoom } from './lib/player'
import Home from './screens/Home'
import JoinRequestPending from './screens/JoinRequestPending'
import Lobby from './screens/Lobby'
import Racing from './screens/Racing'
import Result from './screens/Result'
import Wagering from './screens/Wagering'
import shared from './styles/shared.module.css'
import { ROOM_BACK_TO_HOME_BUTTON, ROOM_CLOSED_MESSAGE, ROOM_CONNECTING, ROOM_NOT_A_MEMBER } from './textValues'
import type { RoomScreenProps } from './types'

// Room code from the URL (?room=ABCD), used for shared links and to survive reloads
function urlRoomCode(): string | null {
  return new URLSearchParams(location.search).get('room')?.toUpperCase() ?? null
}

function setUrlRoomCode(code: string | null) {
  const url = new URL(location.href)
  if (code) url.searchParams.set('room', code)
  else url.searchParams.delete('room')
  history.replaceState(null, '', url)
}

// Top level: shows Home until the player is in a room, then the room
export default function App() {
  // A stored room is only resumed if the URL doesn't point to a different one (e.g. a shared link)
  const [activeCode, setActiveCode] = useState<string | null>(() => {
    const stored = getStoredRoom()
    const fromUrl = urlRoomCode()
    return stored && (!fromUrl || fromUrl === stored) ? stored : null
  })

  useEffect(() => {
    if (activeCode) setUrlRoomCode(activeCode)
  }, [activeCode])

  const enterRoom = (code: string) => {
    storeRoom(code)
    setActiveCode(code)
  }

  const exitRoom = () => {
    storeRoom(null)
    setUrlRoomCode(null)
    setActiveCode(null)
  }

  if (!isFirebaseConfigured) return <SetupNotice />
  if (activeCode) return <RoomView code={activeCode} onLeave={exitRoom} />
  return <Home initialCode={urlRoomCode() ?? ''} onJoined={enterRoom} />
}

// Subscribes to the room and handles loading/missing states before showing the current phase
function RoomView({ code, onLeave }: { code: string; onLeave: () => void }) {
  const { room, loading, playerId, isHost, me } = useRoom(code)

  if (loading) {
    return (
      <main className={`${shared.screen} ${shared.center}`}>
        <p className={shared.muted}>{ROOM_CONNECTING}</p>
      </main>
    )
  }

  // Waiting for the host to answer this player's join request (blocked guests see the same waiting screen)
  const request = room && !me ? room.requests?.[playerId] : undefined
  if (request && request.status !== 'cancelled') {
    return <JoinRequestPending code={code} denied={request.status === 'denied'} onLeave={onLeave} />
  }

  // Room deleted by the host, or this player was removed from it
  if (!room || !me) {
    return (
      <main className={`${shared.screen} ${shared.center}`}>
        <p>{room ? ROOM_NOT_A_MEMBER : ROOM_CLOSED_MESSAGE(code)}</p>
        <button className={shared.btn} onClick={onLeave}>
          {ROOM_BACK_TO_HOME_BUTTON}
        </button>
      </main>
    )
  }

  return (
    <SettingsContext value={roomSettings(room)}>
      <RoomMenu code={code} room={room} isHost={isHost} onExit={onLeave} />
      <PhaseScreen code={code} room={room} playerId={playerId} isHost={isHost} />
      {/* Requests can come in during any phase, but the host only gets to answer them while wagering */}
      {isHost && room.phase === 'wagering' && <JoinRequestPrompt code={code} requests={room.requests} />}
    </SettingsContext>
  )
}

// Every phone renders the screen for the room's current phase
function PhaseScreen(props: RoomScreenProps) {
  switch (props.room.phase) {
    case 'lobby':
      return <Lobby {...props} />
    case 'wagering':
      return <Wagering {...props} />
    case 'racing':
      return <Racing {...props} />
    case 'result':
      return <Result {...props} />
  }
}

// Developer-facing hint shown until the Firebase config is filled in
function SetupNotice() {
  return (
    <main className={`${shared.screen} ${shared.center}`}>
      <h1>Firebase is not configured</h1>
      <p className={shared.muted}>
        Add the Firebase web config to <code>src/firebase.ts</code>.
      </p>
    </main>
  )
}
