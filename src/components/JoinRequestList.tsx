import { useAction } from '../hooks/useAction'
import { blockJoinRequest, unblockJoinRequest } from '../lib/roomActions'
import shared from '../styles/shared.module.css'
import {
  JOIN_REQUEST_LIST_BLOCK_BUTTON,
  JOIN_REQUEST_LIST_EMPTY,
  JOIN_REQUEST_LIST_TITLE,
  JOIN_REQUEST_LIST_UNBLOCK_BUTTON,
  JOIN_REQUEST_STATUS_NAMES,
} from '../textValues'
import type { JoinRequest } from '../types'
import Sheet from './Sheet'

interface JoinRequestListProps {
  code: string
  requests?: Record<string, JoinRequest>
  onClose: () => void
}

// Host: every guest who asked to join and isn't a player, newest first, with a button to block or unblock them
export default function JoinRequestList({ code, requests, onClose }: JoinRequestListProps) {
  const [run, busy, error] = useAction()
  const entries = Object.entries(requests ?? {}).sort(([, a], [, b]) => b.requestedAt - a.requestedAt)

  return (
    <Sheet title={JOIN_REQUEST_LIST_TITLE} error={error} onClose={onClose}>
      {entries.length === 0 ? (
        <p className={shared.muted}>{JOIN_REQUEST_LIST_EMPTY}</p>
      ) : (
        <ul className={shared.playerList}>
          {entries.map(([id, request]) => {
            const blocked = request.status === 'blocked'
            return (
              <li key={id} className={shared.playerRow}>
                <span className={shared.playerName}>{request.name}</span>
                <span className={shared.playerMeta}>{JOIN_REQUEST_STATUS_NAMES[request.status]}</span>
                <button
                  className={blocked ? shared.rowButton : `${shared.rowButton} ${shared.rowButtonDanger}`}
                  disabled={busy}
                  onClick={() => run(() => (blocked ? unblockJoinRequest(code, id) : blockJoinRequest(code, id)))}
                >
                  {blocked ? JOIN_REQUEST_LIST_UNBLOCK_BUTTON : JOIN_REQUEST_LIST_BLOCK_BUTTON}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </Sheet>
  )
}
