import { useAction } from '../hooks/useAction'
import { sortedPlayers } from '../lib/helpers'
import { distributeSips } from '../lib/roomActions'
import shared from '../styles/shared.module.css'
import {
  DISTRIBUTE_ALL_BUTTON,
  DISTRIBUTE_CONFIRM_BUTTON,
  DISTRIBUTE_DECREASE_LABEL,
  DISTRIBUTE_INCREASE_LABEL,
  DISTRIBUTE_RANDOM_BUTTON,
  DISTRIBUTE_REMAINING,
  DISTRIBUTE_TITLE,
  OWN_PLAYER_SUFFIX,
} from '../textValues'
import type { Distribution, Room } from '../types'
import styles from './DistributeSheet.module.css'
import Sheet from './Sheet'

interface DistributeSheetProps {
  code: string
  room: Room
  playerId: string
  total: number // sips this winner hands out
  draft: Distribution // split so far; kept by the parent so closing the sheet doesn't lose it
  onDraftChange: (draft: Distribution) => void
  onClose: () => void
}

// Winner: split the winnings among all players (themselves included), then confirm to show it to everyone.
// The split stays on this phone until confirmed; confirming is final.
export default function DistributeSheet({ code, room, playerId, total, draft, onDraftChange, onClose }: DistributeSheetProps) {
  const [run, busy, error] = useAction()
  const players = sortedPlayers(room)
  const amountOf = (id: string) => draft[id] ?? 0
  // Counted over the current players only, in case someone left in the meantime
  const remaining = total - players.reduce((sum, [id]) => sum + amountOf(id), 0)
  const setAmount = (id: string, sips: number) => onDraftChange({ ...draft, [id]: sips })

  // Hands out the remaining sips one by one to random players; sips already assigned stay
  const randomize = () => {
    const next = { ...draft }
    for (let i = 0; i < remaining; i++) {
      const [id] = players[Math.floor(Math.random() * players.length)]
      next[id] = (next[id] ?? 0) + 1
    }
    onDraftChange(next)
  }

  const confirm = () =>
    run(async () => {
      const distribution = Object.fromEntries(players.flatMap(([id]) => (amountOf(id) > 0 ? [[id, amountOf(id)]] : [])))
      await distributeSips(code, distribution)
      onClose()
    })

  return (
    <Sheet
      title={DISTRIBUTE_TITLE}
      error={error}
      onClose={onClose}
      footer={
        <>
          <p className={remaining === 0 ? `${styles.remaining} ${styles.remainingDone}` : styles.remaining}>
            {DISTRIBUTE_REMAINING(remaining)}
          </p>
          <div className={styles.actions}>
            <button className={shared.btn} disabled={remaining === 0} onClick={randomize}>
              {DISTRIBUTE_RANDOM_BUTTON}
            </button>
            <button className={`${shared.btn} ${shared.btnPrimary}`} disabled={remaining !== 0 || busy} onClick={confirm}>
              {DISTRIBUTE_CONFIRM_BUTTON}
            </button>
          </div>
        </>
      }
    >
      <ul className={shared.playerList}>
        {players.map(([id, player]) => {
          const sips = amountOf(id)
          return (
            <li key={id} className={shared.playerRow}>
              <span className={shared.playerName}>
                {player.name}
                {id === playerId && OWN_PLAYER_SUFFIX}
              </span>
              <div className={styles.controls}>
                <button
                  className={styles.stepButton}
                  aria-label={DISTRIBUTE_DECREASE_LABEL(player.name)}
                  disabled={sips === 0}
                  onClick={() => setAmount(id, sips - 1)}
                >
                  −
                </button>
                <span className={styles.amount}>{sips}</span>
                <button
                  className={styles.stepButton}
                  aria-label={DISTRIBUTE_INCREASE_LABEL(player.name)}
                  disabled={remaining === 0}
                  onClick={() => setAmount(id, sips + 1)}
                >
                  +
                </button>
                <button className={shared.rowButton} disabled={remaining === 0} onClick={() => setAmount(id, sips + remaining)}>
                  {DISTRIBUTE_ALL_BUTTON}
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </Sheet>
  )
}
