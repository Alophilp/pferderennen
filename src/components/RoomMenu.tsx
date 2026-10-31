import { useState } from 'react'
import { useAction } from '../hooks/useAction'
import { closeRoom, leaveRoom } from '../lib/roomActions'
import {
  CLOSE_ROOM_DIALOG_CONFIRM,
  CLOSE_ROOM_DIALOG_MESSAGE,
  CLOSE_ROOM_DIALOG_TITLE,
  LEAVE_ROOM_DIALOG_CONFIRM,
  LEAVE_ROOM_DIALOG_LOCKED_MESSAGE,
  LEAVE_ROOM_DIALOG_TITLE,
  MENU_CLOSE_ROOM,
  MENU_LEAVE_ROOM,
} from '../textValues'
import ConfirmDialog from './ConfirmDialog'
import Menu, { type MenuItem } from './Menu'

// Actions that need a confirmation before they run
type PendingAction = 'close' | 'leave'

interface RoomMenuProps {
  code: string
  isHost: boolean
  locked: boolean
  onExit: () => void // called after closing/leaving succeeded, returns to Home
}

// Room options in the top-right menu: the host can close the room, guests can leave it
export default function RoomMenu({ code, isHost, locked, onExit }: RoomMenuProps) {
  const [pending, setPending] = useState<PendingAction | null>(null)
  const [run, busy, error] = useAction()

  // Add further room options here
  const items: MenuItem[] = [
    isHost
      ? { label: MENU_CLOSE_ROOM, danger: true, onSelect: () => setPending('close') }
      : { label: MENU_LEAVE_ROOM, danger: true, onSelect: () => setPending('leave') },
  ]

  const confirm = () =>
    run(async () => {
      await (pending === 'close' ? closeRoom(code) : leaveRoom(code))
      onExit()
    })

  return (
    <>
      <Menu items={items} />
      {pending === 'close' && (
        <ConfirmDialog
          title={CLOSE_ROOM_DIALOG_TITLE}
          message={CLOSE_ROOM_DIALOG_MESSAGE}
          confirmLabel={CLOSE_ROOM_DIALOG_CONFIRM}
          busy={busy}
          error={error}
          onConfirm={confirm}
          onCancel={() => setPending(null)}
        />
      )}
      {pending === 'leave' && (
        <ConfirmDialog
          title={LEAVE_ROOM_DIALOG_TITLE}
          // Only warn when rejoining is impossible
          message={locked ? LEAVE_ROOM_DIALOG_LOCKED_MESSAGE : undefined}
          confirmLabel={LEAVE_ROOM_DIALOG_CONFIRM}
          busy={busy}
          error={error}
          onConfirm={confirm}
          onCancel={() => setPending(null)}
        />
      )}
    </>
  )
}
