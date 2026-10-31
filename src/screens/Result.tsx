import { useEffect } from 'react'
import AceLabel from '../components/AceLabel'
import { useAction } from '../hooks/useAction'
import { sortedPlayers } from '../lib/helpers'
import { newRound } from '../lib/roomActions'
import shared from '../styles/shared.module.css'
import {
  OWN_PLAYER_SUFFIX,
  RESULT_DISTRIBUTE_LABEL,
  RESULT_NEW_ROUND_BUTTON,
  RESULT_NO_WINNERS,
  RESULT_PLAYER_DISTRIBUTES,
  RESULT_TITLE_FALLBACK,
  RESULT_WAITING_FOR_NEXT_ROUND,
  RESULT_WINNERS_HEADING,
  RESULT_WINS_SUFFIX,
  RESULT_YOU_LOST,
  RESULT_YOU_WON,
  ROUND_LABEL,
  SIPS_UNIT,
} from '../textValues'
import type { RoomScreenProps } from '../types'
import styles from './Result.module.css'

// After the race: winners see how many sips they distribute (2× their wager); the host starts the next round
export default function Result({ code, room, playerId, isHost }: RoomScreenProps) {
  const [run, busy, error] = useAction()
  const winner = room.winner
  const myWager = room.wagers?.[playerId]
  const myWinnings = winner && myWager?.ace === winner ? myWager.sips * 2 : null
  const winners = sortedPlayers(room).filter(([id]) => winner && room.wagers?.[id]?.ace === winner)

  useEffect(() => {
    // Android only; iOS Safari has no vibration API
    if (myWinnings !== null) navigator.vibrate?.([200, 100, 200])
  }, [myWinnings])

  return (
    <main className={shared.screen}>
      <header className={shared.screenHeader}>
        <p className={shared.eyebrow}>{ROUND_LABEL(room.round)}</p>
        <h1>
          {winner ? (
            <>
              <AceLabel ace={winner} /> {RESULT_WINS_SUFFIX}
            </>
          ) : (
            RESULT_TITLE_FALLBACK
          )}
        </h1>
      </header>

      {myWinnings !== null ? (
        <section className={`${shared.card} ${styles.win}`}>
          <p className={styles.winTitle}>{RESULT_YOU_WON}</p>
          <p className={shared.bigUnit}>{RESULT_DISTRIBUTE_LABEL}</p>
          <p className={shared.bigNumber}>{myWinnings}</p>
          <p className={shared.bigUnit}>{SIPS_UNIT(myWinnings)}</p>
        </section>
      ) : (
        <section className={`${shared.card} ${shared.centerText}`}>
          <p>{RESULT_YOU_LOST}</p>
        </section>
      )}

      <section className={shared.stack}>
        <h2>{RESULT_WINNERS_HEADING}</h2>
        {winners.length > 0 ? (
          <ul className={shared.playerList}>
            {winners.map(([id, player]) => (
              <li key={id} className={shared.playerRow}>
                <span className={shared.playerName}>
                  {player.name}
                  {id === playerId && OWN_PLAYER_SUFFIX}
                </span>
                <span className={shared.playerMeta}>
                  {RESULT_PLAYER_DISTRIBUTES((room.wagers?.[id]?.sips ?? 0) * 2)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          winner && <p className={shared.muted}>{RESULT_NO_WINNERS(winner)}</p>
        )}
      </section>

      {error && <p className={shared.error}>{error}</p>}

      <footer className={shared.screenFooter}>
        {isHost ? (
          <button className={`${shared.btn} ${shared.btnPrimary}`} disabled={busy} onClick={() => run(() => newRound(code))}>
            {RESULT_NEW_ROUND_BUTTON}
          </button>
        ) : (
          <p className={shared.muted}>{RESULT_WAITING_FOR_NEXT_ROUND}</p>
        )}
      </footer>
    </main>
  )
}
