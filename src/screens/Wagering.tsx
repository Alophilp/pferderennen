import { useState } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'
import AceLabel from '../components/AceLabel'
import NumberInput from '../components/NumberInput'
import { useAction } from '../hooks/useAction'
import { sortedPlayers } from '../lib/helpers'
import { editWager, placeWager, startRace } from '../lib/roomActions'
import shared from '../styles/shared.module.css'
import {
  OWN_PLAYER_SUFFIX,
  ROUND_LABEL,
  SIPS_LABEL,
  SIPS_UNIT,
  WAGERING_ALL_WAGERS_HEADING,
  WAGERING_DECREASE_LABEL,
  WAGERING_EDIT_BUTTON,
  WAGERING_GUEST_WAITING_HINT,
  WAGERING_HOST_WAITING_HINT,
  WAGERING_INCREASE_LABEL,
  WAGERING_MY_WAGER_LABEL,
  WAGERING_ON,
  WAGERING_SIPS_INPUT_LABEL,
  WAGERING_START_RACE_BUTTON,
  WAGERING_STATUS_EDITING,
  WAGERING_STATUS_READY,
  WAGERING_STATUS_WAITING,
  WAGERING_SUBMIT_BUTTON,
  WAGERING_TITLE,
} from '../textValues'
import { ACES, type Ace, type RoomScreenProps, type Wager } from '../types'
import styles from './Wagering.module.css'

const MAX_SIPS = 99

// Everyone picks an ace and a number of sips and locks it in; the host starts the race once all are locked in
export default function Wagering({ code, room, playerId, isHost }: RoomScreenProps) {
  const [run, busy, error] = useAction()
  const myWager = room.wagers?.[playerId]
  const players = sortedPlayers(room)
  const allConfirmed = players.every(([id]) => room.wagers?.[id]?.confirmed)

  return (
    <main className={shared.screen}>
      <header className={shared.screenHeader}>
        <p className={shared.eyebrow}>{ROUND_LABEL(room.round, code)}</p>
        <h1>{WAGERING_TITLE}</h1>
      </header>

      {/* Locked in: read-only summary with "Ändern". Otherwise: the editor. */}
      {myWager?.confirmed ? (
        <section className={`${shared.card} ${styles.myWager}`}>
          <p className={shared.muted}>{WAGERING_MY_WAGER_LABEL}</p>
          <p className={styles.myWagerValue}>
            {SIPS_LABEL(myWager.sips)} {WAGERING_ON} <AceLabel ace={myWager.ace} />
          </p>
          <button className={shared.btn} disabled={busy} onClick={() => run(() => editWager(code))}>
            {WAGERING_EDIT_BUTTON}
          </button>
        </section>
      ) : (
        <WagerEditor initial={myWager} busy={busy} onSubmit={(ace, sips) => run(() => placeWager(code, ace, sips))} />
      )}

      {error && <p className={shared.error}>{error}</p>}

      <section className={shared.stack}>
        <h2>{WAGERING_ALL_WAGERS_HEADING}</h2>
        <ul className={shared.playerList}>
          {players.map(([id, player]) => {
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
                <span className={wager?.confirmed ? `${styles.status} ${styles.statusReady}` : styles.status}>
                  {!wager ? WAGERING_STATUS_WAITING : wager.confirmed ? WAGERING_STATUS_READY : WAGERING_STATUS_EDITING}
                </span>
              </li>
            )
          })}
        </ul>
      </section>

      <footer className={shared.screenFooter}>
        {isHost ? (
          <>
            <button
              className={`${shared.btn} ${shared.btnPrimary}`}
              disabled={!allConfirmed || busy}
              onClick={() => run(() => startRace(code))}
            >
              {WAGERING_START_RACE_BUTTON}
            </button>
            {!allConfirmed && <p className={`${shared.muted} ${shared.small}`}>{WAGERING_HOST_WAITING_HINT}</p>}
          </>
        ) : (
          <p className={shared.muted}>{WAGERING_GUEST_WAITING_HINT}</p>
        )}
      </footer>
    </main>
  )
}

interface WagerEditorProps {
  initial?: Wager // previous wager when reopened via "Ändern"
  busy: boolean
  onSubmit: (ace: Ace, sips: number) => void
}

// Ace picker and sip stepper. Keeps its own local state until the wager is submitted.
function WagerEditor({ initial, busy, onSubmit }: WagerEditorProps) {
  const [ace, setAce] = useState<Ace | null>(initial?.ace ?? null)
  const [sips, setSips] = useState(initial?.sips ?? 1)

  return (
    <section className={`${shared.card} ${shared.stack}`}>
      <div className={shared.aceGrid}>
        {ACES.map((a) => (
          <button key={a} className={shared.aceButton} aria-pressed={ace === a} onClick={() => setAce(a)}>
            <AceLabel ace={a} large />
          </button>
        ))}
      </div>

      <div className={styles.stepper}>
        <button
          className={`${shared.btn} ${styles.stepperBtn}`}
          aria-label={WAGERING_DECREASE_LABEL}
          disabled={sips <= 1}
          onClick={() => setSips((s) => Math.max(1, s - 1))}
        >
          <FiMinus aria-hidden="true" />
        </button>
        <div className={styles.stepperValue}>
          <NumberInput
            className={styles.stepperNumber}
            value={sips}
            min={1}
            max={MAX_SIPS}
            onChange={setSips}
            label={WAGERING_SIPS_INPUT_LABEL}
          />
          <span className={shared.muted}>{SIPS_UNIT(sips)}</span>
        </div>
        <button
          className={`${shared.btn} ${styles.stepperBtn}`}
          aria-label={WAGERING_INCREASE_LABEL}
          disabled={sips >= MAX_SIPS}
          onClick={() => setSips((s) => Math.min(MAX_SIPS, s + 1))}
        >
          <FiPlus aria-hidden="true" />
        </button>
      </div>

      <button
        className={`${shared.btn} ${shared.btnPrimary}`}
        disabled={!ace || busy}
        onClick={() => ace && onSubmit(ace, sips)}
      >
        {WAGERING_SUBMIT_BUTTON}
      </button>
    </section>
  )
}
