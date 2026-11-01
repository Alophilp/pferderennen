import { useEffect, useRef, useState } from 'react'
import AceLabel from '../components/AceLabel'
import ConfirmDialog from '../components/ConfirmDialog'
import DistributeSheet from '../components/DistributeSheet'
import { useAction } from '../hooks/useAction'
import { roomSettings, sortedPlayers, streakOf } from '../lib/helpers'
import { newRound } from '../lib/roomActions'
import shared from '../styles/shared.module.css'
import {
  ACE_NAMES,
  OWN_PLAYER_SUFFIX,
  RESULT_DISTRIBUTE_LABEL,
  RESULT_DISTRIBUTED,
  RESULT_NEW_ROUND_BUTTON,
  RESULT_NEW_ROUND_DIALOG_CONFIRM,
  RESULT_NEW_ROUND_DIALOG_MESSAGE,
  RESULT_NEW_ROUND_DIALOG_TITLE,
  RESULT_NO_WINNERS,
  RESULT_PLAYER_DISTRIBUTES,
  RESULT_PLAYER_HAS_DISTRIBUTED,
  RESULT_PLAYER_MUST_DISTRIBUTE,
  RESULT_RECEIVED_FROM,
  RESULT_RECEIVED_FROM_UNKNOWN,
  RESULT_RECEIVED_FROM_YOURSELF,
  RESULT_RECEIVED_HEADING,
  RESULT_RECEIVED_TOTAL,
  RESULT_TAP_TO_DISTRIBUTE,
  RESULT_TITLE_FALLBACK,
  RESULT_WAITING_FOR_NEXT_ROUND,
  RESULT_WINNERS_HEADING,
  RESULT_WINS_SUFFIX,
  RESULT_YOU_LOST,
  RESULT_YOU_WON,
  ROUND_LABEL,
  SIPS_UNIT,
  STREAK_GLOBAL_MESSAGES,
  STREAK_PRIVATE_MESSAGES,
} from '../textValues'
import type { Distribution, Room, RoomScreenProps } from '../types'
import styles from './Result.module.css'

// After the race: winners see how many sips they distribute (2× their wager); the host starts the next round.
// With the setting "Schlücke in der App verteilen", winners hand out their sips here and everyone sees what they got.
export default function Result({ code, room, playerId, isHost }: RoomScreenProps) {
  const [run, busy, error] = useAction()
  const [distributeOpen, setDistributeOpen] = useState(false)
  const [draft, setDraft] = useState<Distribution>({})
  const [confirmNewRound, setConfirmNewRound] = useState(false)
  const distributing = roomSettings(room).distributeSips === 'on'
  const winner = room.winner
  const myWager = room.wagers?.[playerId]
  const myWinnings = winner && myWager?.ace === winner ? myWager.sips * 2 : null
  const winners = sortedPlayers(room).filter(([id]) => winner && room.wagers?.[id]?.ace === winner)
  const canDistribute = distributing && myWinnings !== null && !room.distributions?.[playerId]
  // Winners who haven't handed out their sips yet; the host is asked before starting a new round without them
  const pendingWinners = distributing ? winners.filter(([id]) => !room.distributions?.[id]) : []

  // Losing streak messages for streaks that just reached one of the configured lengths
  const myStreakMessage = STREAK_PRIVATE_MESSAGES[streakOf(room, playerId)]
  const streakAnnouncements = sortedPlayers(room).flatMap(([id, player]) => {
    const message = STREAK_GLOBAL_MESSAGES[streakOf(room, id)]
    return message ? [{ id, text: message(player.name) }] : []
  })

  const received = distributing ? receivedSips(room, playerId) : []
  const receivedTotal = received.reduce((sum, { sips }) => sum + sips, 0)
  const lastReceivedTotal = useRef(receivedTotal)

  // Vibration is Android only; iOS Safari has no vibration API
  useEffect(() => {
    if (myWinnings !== null) navigator.vibrate?.([200, 100, 200])
  }, [myWinnings])

  // Buzz whenever a winner hands this player more sips (not on load, so a reload doesn't buzz again)
  useEffect(() => {
    if (receivedTotal > lastReceivedTotal.current) navigator.vibrate?.(400)
    lastReceivedTotal.current = receivedTotal
  }, [receivedTotal])

  const startNewRound = () => run(() => newRound(code))

  return (
    <main className={shared.screen}>
      <header className={shared.screenHeader}>
        <p className={shared.eyebrow}>{ROUND_LABEL(room.round, code)}</p>
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
        // Tappable while the winner still has to hand out their sips
        <section
          className={canDistribute ? `${shared.card} ${styles.win} ${styles.winTappable}` : `${shared.card} ${styles.win}`}
          role={canDistribute ? 'button' : undefined}
          onClick={canDistribute ? () => setDistributeOpen(true) : undefined}
        >
          <p className={styles.winTitle}>{RESULT_YOU_WON}</p>
          <p className={shared.bigUnit}>{RESULT_DISTRIBUTE_LABEL}</p>
          <p className={shared.bigNumber}>{myWinnings}</p>
          <p className={shared.bigUnit}>{SIPS_UNIT(myWinnings)}</p>
          {distributing && <p className={styles.winHint}>{canDistribute ? RESULT_TAP_TO_DISTRIBUTE : RESULT_DISTRIBUTED}</p>}
          <ReceivedSips received={received} total={receivedTotal} room={room} playerId={playerId} />
        </section>
      ) : (
        <section className={`${shared.card} ${shared.centerText}`}>
          <p>{RESULT_YOU_LOST}</p>
          {myStreakMessage && <p className={styles.streakMessage}>{myStreakMessage}</p>}
          <ReceivedSips received={received} total={receivedTotal} room={room} playerId={playerId} />
        </section>
      )}

      {streakAnnouncements.length > 0 && (
        <ul className={styles.streakAnnouncements}>
          {streakAnnouncements.map(({ id, text }) => (
            <li key={id} className={`${shared.card} ${styles.streakAnnouncement}`}>
              {text}
            </li>
          ))}
        </ul>
      )}

      <section className={shared.stack}>
        <h2>{RESULT_WINNERS_HEADING}</h2>
        {winners.length > 0 ? (
          <ul className={shared.playerList}>
            {winners.map(([id, player]) => {
              const sips = (room.wagers?.[id]?.sips ?? 0) * 2
              return (
                <li key={id} className={shared.playerRow}>
                  <span className={shared.playerName}>
                    {player.name}
                    {id === playerId && OWN_PLAYER_SUFFIX}
                  </span>
                  <span className={shared.playerMeta}>
                    {!distributing
                      ? RESULT_PLAYER_DISTRIBUTES(sips)
                      : room.distributions?.[id]
                        ? RESULT_PLAYER_HAS_DISTRIBUTED(sips)
                        : RESULT_PLAYER_MUST_DISTRIBUTE(sips)}
                  </span>
                </li>
              )
            })}
          </ul>
        ) : (
          winner && <p className={shared.muted}>{RESULT_NO_WINNERS(ACE_NAMES[roomSettings(room).deck][winner])}</p>
        )}
      </section>

      {error && <p className={shared.error}>{error}</p>}

      <footer className={shared.screenFooter}>
        {isHost ? (
          <button
            className={`${shared.btn} ${shared.btnPrimary}`}
            disabled={busy}
            onClick={pendingWinners.length > 0 ? () => setConfirmNewRound(true) : startNewRound}
          >
            {RESULT_NEW_ROUND_BUTTON}
          </button>
        ) : (
          <p className={shared.muted}>{RESULT_WAITING_FOR_NEXT_ROUND}</p>
        )}
      </footer>

      {distributeOpen && canDistribute && (
        <DistributeSheet
          code={code}
          room={room}
          playerId={playerId}
          total={myWinnings}
          draft={draft}
          onDraftChange={setDraft}
          onClose={() => setDistributeOpen(false)}
        />
      )}
      {confirmNewRound && (
        <ConfirmDialog
          title={RESULT_NEW_ROUND_DIALOG_TITLE}
          message={RESULT_NEW_ROUND_DIALOG_MESSAGE(pendingWinners.map(([, player]) => player.name).join(', '))}
          confirmLabel={RESULT_NEW_ROUND_DIALOG_CONFIRM}
          busy={busy}
          error={error}
          onConfirm={startNewRound}
          onCancel={() => setConfirmNewRound(false)}
        />
      )}
    </main>
  )
}

interface ReceivedSip {
  giverId: string
  sips: number
}

// Sips a player got from the winners who have confirmed so far
function receivedSips(room: Room, playerId: string): ReceivedSip[] {
  return Object.entries(room.distributions ?? {}).flatMap(([giverId, distribution]) =>
    distribution[playerId] ? [{ giverId, sips: distribution[playerId] }] : [],
  )
}

interface ReceivedSipsProps {
  received: ReceivedSip[]
  total: number
  room: Room
  playerId: string
}

// One line per winner plus the total. Nothing until the first winner hands this player sips.
function ReceivedSips({ received, total, room, playerId }: ReceivedSipsProps) {
  if (received.length === 0) return null

  return (
    <div className={styles.received}>
      <p className={shared.muted}>{RESULT_RECEIVED_HEADING}</p>
      <ul className={styles.receivedList}>
        {received.map(({ giverId, sips }) => (
          <li key={giverId}>
            {RESULT_RECEIVED_FROM(
              sips,
              giverId === playerId
                ? RESULT_RECEIVED_FROM_YOURSELF
                : (room.players[giverId]?.name ?? RESULT_RECEIVED_FROM_UNKNOWN),
            )}
          </li>
        ))}
      </ul>
      <p className={styles.receivedTotal}>{RESULT_RECEIVED_TOTAL(total)}</p>
    </div>
  )
}
