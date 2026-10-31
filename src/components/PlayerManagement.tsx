import { useState } from 'react'
import { useAction } from '../hooks/useAction'
import { sortedPlayers } from '../lib/helpers'
import { kickAndBlockPlayer, kickPlayer } from '../lib/roomActions'
import shared from '../styles/shared.module.css'
import {
  BLOCK_PLAYER_DIALOG_CONFIRM,
  BLOCK_PLAYER_DIALOG_MESSAGE,
  BLOCK_PLAYER_DIALOG_TITLE,
  KICK_PLAYER_DIALOG_CONFIRM,
  KICK_PLAYER_DIALOG_MESSAGE,
  KICK_PLAYER_DIALOG_TITLE,
  PLAYER_MANAGEMENT_BLOCK_BUTTON,
  PLAYER_MANAGEMENT_EMPTY,
  PLAYER_MANAGEMENT_KICK_BUTTON,
  PLAYER_MANAGEMENT_TITLE,
} from '../textValues'
import type { Room } from '../types'
import ConfirmDialog from './ConfirmDialog'
import Sheet from './Sheet'

// Player picked for removal, waiting for confirmation
interface KickTarget {
  id: string
  name: string
  block: boolean
}

interface PlayerManagementProps {
  code: string
  room: Room
  onClose: () => void
}

// Host: lists the guests in the room, each can be removed or removed and blocked (after a confirmation)
export default function PlayerManagement({ code, room, onClose }: PlayerManagementProps) {
  const [target, setTarget] = useState<KickTarget | null>(null)
  const [run, busy, error] = useAction()
  const guests = sortedPlayers(room).filter(([id]) => id !== room.hostId)

  const confirm = () =>
    run(async () => {
      if (!target) return
      await (target.block ? kickAndBlockPlayer(code, target.id, target.name) : kickPlayer(code, target.id))
      setTarget(null)
    })

  return (
    <>
      <Sheet title={PLAYER_MANAGEMENT_TITLE} onClose={onClose}>
        {guests.length === 0 ? (
          <p className={shared.muted}>{PLAYER_MANAGEMENT_EMPTY}</p>
        ) : (
          <ul className={shared.playerList}>
            {guests.map(([id, player]) => (
              <li key={id} className={shared.playerRow}>
                <span className={shared.playerName}>{player.name}</span>
                <button className={shared.rowButton} onClick={() => setTarget({ id, name: player.name, block: false })}>
                  {PLAYER_MANAGEMENT_KICK_BUTTON}
                </button>
                <button
                  className={`${shared.rowButton} ${shared.rowButtonDanger}`}
                  onClick={() => setTarget({ id, name: player.name, block: true })}
                >
                  {PLAYER_MANAGEMENT_BLOCK_BUTTON}
                </button>
              </li>
            ))}
          </ul>
        )}
      </Sheet>
      {/* Rendered after the sheet so it sits on top of it */}
      {target && (
        <ConfirmDialog
          title={target.block ? BLOCK_PLAYER_DIALOG_TITLE(target.name) : KICK_PLAYER_DIALOG_TITLE(target.name)}
          message={target.block ? BLOCK_PLAYER_DIALOG_MESSAGE : KICK_PLAYER_DIALOG_MESSAGE}
          confirmLabel={target.block ? BLOCK_PLAYER_DIALOG_CONFIRM : KICK_PLAYER_DIALOG_CONFIRM}
          busy={busy}
          error={error}
          onConfirm={confirm}
          onCancel={() => setTarget(null)}
        />
      )}
    </>
  )
}
