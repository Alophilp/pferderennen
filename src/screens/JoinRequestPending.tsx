import { useAction } from '../hooks/useAction'
import { cancelJoinRequest } from '../lib/roomActions'
import shared from '../styles/shared.module.css'
import {
  CANCEL_BUTTON,
  JOIN_REQUEST_DENIED,
  JOIN_REQUEST_ROOM_LABEL,
  JOIN_REQUEST_WAITING,
  ROOM_BACK_TO_HOME_BUTTON,
} from '../textValues'

interface JoinRequestPendingProps {
  code: string
  denied: boolean
  onLeave: () => void // returns to Home
}

// Guest: shown while the join request waits for the host, or after the host denied it.
// Leaving marks a waiting request as cancelled; a denied or blocked one stays as it is.
export default function JoinRequestPending({ code, denied, onLeave }: JoinRequestPendingProps) {
  const [run, busy, error] = useAction()

  const leave = () =>
    run(async () => {
      await cancelJoinRequest(code)
      onLeave()
    })

  return (
    <main className={`${shared.screen} ${shared.center}`}>
      <p className={shared.eyebrow}>{JOIN_REQUEST_ROOM_LABEL(code)}</p>
      <p>{denied ? JOIN_REQUEST_DENIED : JOIN_REQUEST_WAITING}</p>
      {error && <p className={shared.error}>{error}</p>}
      <button className={shared.btn} disabled={busy} onClick={leave}>
        {denied ? ROOM_BACK_TO_HOME_BUTTON : CANCEL_BUTTON}
      </button>
    </main>
  )
}
