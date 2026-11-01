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
  MENU_JOIN_REQUESTS,
  MENU_LEAVE_ROOM,
  MENU_MANAGE_PLAYERS,
  MENU_PERSONAL_SETTINGS,
} from '../textValues'
import type { Room } from '../types'
import ConfirmDialog from './ConfirmDialog'
import JoinRequestList from './JoinRequestList'
import Menu, { type MenuItem } from './Menu'
import PersonalSettingsSheet from './PersonalSettingsSheet'
import PlayerManagement from './PlayerManagement'

// Overlays opened from the menu: confirmations for close/leave, the host's player and join request lists, and everyone's own settings
type PendingAction = 'close' | 'leave' | 'players' | 'requests' | 'personalSettings'

interface RoomMenuProps {
  code: string
  room: Room
  isHost: boolean
  onExit: () => void // called after closing/leaving succeeded, returns to Home
}

// Room options in the top-right menu: everyone can open their own settings; the host can manage players and join requests
// and close the room, guests can leave it
export default function RoomMenu({ code, room, isHost, onExit }: RoomMenuProps) {
  const [pending, setPending] = useState<PendingAction | null>(null)
  const [run, busy, error] = useAction()

  // Add further room options here
  const personalSettingsItem: MenuItem = { label: MENU_PERSONAL_SETTINGS, onSelect: () => setPending('personalSettings') }
  const items: MenuItem[] = isHost
    ? [
        personalSettingsItem,
        { label: MENU_MANAGE_PLAYERS, onSelect: () => setPending('players') },
        { label: MENU_JOIN_REQUESTS, onSelect: () => setPending('requests') },
        { label: MENU_CLOSE_ROOM, danger: true, onSelect: () => setPending('close') },
      ]
    : [personalSettingsItem, { label: MENU_LEAVE_ROOM, danger: true, onSelect: () => setPending('leave') }]

  const confirm = () =>
    run(async () => {
      await (pending === 'close' ? closeRoom(code) : leaveRoom(code))
      onExit()
    })

  return (
    <>
      <Menu items={items} />
      {pending === 'personalSettings' && <PersonalSettingsSheet onClose={() => setPending(null)} />}
      {pending === 'players' && <PlayerManagement code={code} room={room} onClose={() => setPending(null)} />}
      {pending === 'requests' && <JoinRequestList code={code} requests={room.requests} onClose={() => setPending(null)} />}
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
          // Only mention the host when rejoining needs their approval
          message={room.locked ? LEAVE_ROOM_DIALOG_LOCKED_MESSAGE : undefined}
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
