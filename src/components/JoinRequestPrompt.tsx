import { useAction } from '../hooks/useAction'
import { acceptJoinRequest, denyJoinRequest } from '../lib/roomActions'
import shared from '../styles/shared.module.css'
import {
  JOIN_REQUEST_ACCEPT_BUTTON,
  JOIN_REQUEST_DENY_BUTTON,
  JOIN_REQUEST_PROMPT_MORE,
  JOIN_REQUEST_PROMPT_TITLE,
} from '../textValues'
import type { JoinRequest } from '../types'
import styles from './JoinRequestPrompt.module.css'

interface JoinRequestPromptProps {
  code: string
  requests?: Record<string, JoinRequest>
}

// Host: notification at the bottom of the screen to let a waiting player in or deny them.
// Shows the oldest open request; the next one appears once it's answered.
export default function JoinRequestPrompt({ code, requests }: JoinRequestPromptProps) {
  const [run, busy, error] = useAction()
  const open = Object.entries(requests ?? {})
    .filter(([, request]) => request.status === 'pending')
    .sort(([, a], [, b]) => a.requestedAt - b.requestedAt)

  if (open.length === 0) return null
  const [id, request] = open[0]

  return (
    <aside className={styles.prompt} role="status">
      <p className={styles.title}>{JOIN_REQUEST_PROMPT_TITLE(request.name)}</p>
      {open.length > 1 && <p className={`${shared.muted} ${shared.small}`}>{JOIN_REQUEST_PROMPT_MORE(open.length - 1)}</p>}
      {error && <p className={shared.error}>{error}</p>}
      <div className={styles.actions}>
        <button className={shared.btn} disabled={busy} onClick={() => run(() => denyJoinRequest(code, id))}>
          {JOIN_REQUEST_DENY_BUTTON}
        </button>
        <button
          className={`${shared.btn} ${shared.btnPrimary}`}
          disabled={busy}
          onClick={() => run(() => acceptJoinRequest(code, id, request.name))}
        >
          {JOIN_REQUEST_ACCEPT_BUTTON}
        </button>
      </div>
    </aside>
  )
}
