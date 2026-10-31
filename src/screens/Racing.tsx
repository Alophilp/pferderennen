import { useState } from 'react'
import AceLabel from '../components/AceLabel'
import ConfirmDialog from '../components/ConfirmDialog'
import { useAction } from '../hooks/useAction'
import { sortedPlayers } from '../lib/helpers'
import { declareWinner } from '../lib/roomActions'
import shared from '../styles/shared.module.css'
import {
  OWN_PLAYER_SUFFIX,
  RACING_ALL_WAGERS_SUMMARY,
  RACING_CONFIRM_WINNER_BUTTON,
  RACING_CONFIRM_WINNER_SUFFIX,
  RACING_IN_PROGRESS,
  RACING_NO_WAGER,
  RACING_PICK_WINNER_HEADING,
  SIPS_UNIT,
} from '../textValues'
import { ACES, type Ace, type RoomScreenProps } from '../types'
import styles from './Racing.module.css'

// Race in progress: everyone shows their own wager big; the host picks and confirms the winning ace
export default function Racing({ code, room, playerId, isHost }: RoomScreenProps) {
  const [run, busy, error] = useAction()
  const [pendingWinner, setPendingWinner] = useState<Ace | null>(null)
  const myWager = room.wagers?.[playerId]

  return (
    <main className={shared.screen}>
      <section className={styles.showcase}>
        <p className={shared.eyebrow}>{room.players[playerId]?.name}</p>
        {myWager ? (
          <>
            <p className={shared.bigNumber}>{myWager.sips}</p>
            <p className={shared.bigUnit}>{SIPS_UNIT(myWager.sips)}</p>
            <p className={styles.showcaseAce}>
              <AceLabel ace={myWager.ace} />
            </p>
          </>
        ) : (
          <p className={shared.muted}>{RACING_NO_WAGER}</p>
        )}
      </section>

      {/* Native <details> handles open/close; closed by default */}
      <details className={`${shared.card} ${styles.allWagers}`}>
        <summary>{RACING_ALL_WAGERS_SUMMARY}</summary>
        <ul className={shared.playerList}>
          {sortedPlayers(room).map(([id, player]) => {
            const wager = room.wagers?.[id]
            return (
              <li key={id} className={shared.playerRow}>
                <span className={shared.playerName}>
                  {player.name}
                  {id === playerId && OWN_PLAYER_SUFFIX}
                </span>
                {wager && (
                  <span className={shared.playerMeta}>
                    {wager.sips} · <AceLabel ace={wager.ace} />
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      </details>

      {isHost ? (
        <section className={shared.stack}>
          <h2>{RACING_PICK_WINNER_HEADING}</h2>
          <div className={shared.aceGrid}>
            {ACES.map((a) => (
              <button key={a} className={shared.aceButton} onClick={() => setPendingWinner(a)}>
                <AceLabel ace={a} large />
              </button>
            ))}
          </div>
        </section>
      ) : (
        <p className={`${shared.muted} ${shared.centerText}`}>{RACING_IN_PROGRESS}</p>
      )}

      {pendingWinner && (
        <ConfirmDialog
          title={
            <>
              <AceLabel ace={pendingWinner} /> {RACING_CONFIRM_WINNER_SUFFIX}
            </>
          }
          confirmLabel={RACING_CONFIRM_WINNER_BUTTON}
          busy={busy}
          error={error}
          onConfirm={() => run(() => declareWinner(code, pendingWinner))}
          onCancel={() => setPendingWinner(null)}
        />
      )}
    </main>
  )
}
