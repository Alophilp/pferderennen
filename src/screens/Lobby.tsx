import { useState } from 'react'
import { useAction } from '../hooks/useAction'
import { roomLink, sortedPlayers } from '../lib/helpers'
import { startWagering } from '../lib/roomActions'
import shared from '../styles/shared.module.css'
import {
  APP_TITLE,
  LOBBY_HOST_TAG,
  LOBBY_LINK_COPIED,
  LOBBY_PLAYERS_HEADING,
  LOBBY_ROOM_CODE_LABEL,
  LOBBY_SHARE_BUTTON,
  LOBBY_SHARE_TEXT,
  LOBBY_START_WAGERING_BUTTON,
  LOBBY_WAITING_FOR_HOST,
  OWN_PLAYER_SUFFIX,
} from '../textValues'
import type { RoomScreenProps } from '../types'
import styles from './Lobby.module.css'

// Waiting room: shows the code and who has joined; the host locks the room and starts wagering
export default function Lobby({ code, room, playerId, isHost }: RoomScreenProps) {
  const [run, busy, error] = useAction()
  const [copied, setCopied] = useState(false)
  const link = roomLink(code)

  const share = async () => {
    // Share sheet and clipboard both need a secure context (https), so the link is also shown as text
    if (navigator.share) {
      try {
        await navigator.share({ title: APP_TITLE, text: LOBBY_SHARE_TEXT(code), url: link })
      } catch {
        // share sheet dismissed
      }
      return
    }
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
    } catch {
      // clipboard unavailable; the link is visible below
    }
  }

  return (
    <main className={shared.screen}>
      <header className={shared.screenHeader}>
        <p className={shared.eyebrow}>{LOBBY_ROOM_CODE_LABEL}</p>
        <p className={styles.roomCode}>{code}</p>
      </header>

      <section className={shared.stack}>
        <button className={shared.btn} onClick={share}>
          {copied ? LOBBY_LINK_COPIED : LOBBY_SHARE_BUTTON}
        </button>
        <p className={`${shared.muted} ${shared.small} ${shared.centerText} ${styles.linkText}`}>{link}</p>
      </section>

      <section className={shared.stack}>
        <h2>{LOBBY_PLAYERS_HEADING(Object.keys(room.players).length)}</h2>
        <ul className={shared.playerList}>
          {sortedPlayers(room).map(([id, player]) => (
            <li key={id} className={shared.playerRow}>
              <span className={shared.playerName}>
                {player.name}
                {id === playerId && OWN_PLAYER_SUFFIX}
              </span>
              {id === room.hostId && <span className={styles.tag}>{LOBBY_HOST_TAG}</span>}
            </li>
          ))}
        </ul>
      </section>

      {error && <p className={shared.error}>{error}</p>}

      <footer className={shared.screenFooter}>
        {isHost ? (
          <button className={`${shared.btn} ${shared.btnPrimary}`} disabled={busy} onClick={() => run(() => startWagering(code))}>
            {LOBBY_START_WAGERING_BUTTON}
          </button>
        ) : (
          <p className={shared.muted}>{LOBBY_WAITING_FOR_HOST}</p>
        )}
      </footer>
    </main>
  )
}
