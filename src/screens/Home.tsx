import { useState } from 'react'
import { useAction } from '../hooks/useAction'
import { getStoredName, storeName } from '../lib/player'
import { createRoom, joinRoom } from '../lib/roomActions'
import shared from '../styles/shared.module.css'
import {
  APP_TITLE,
  HOME_CREATE_ROOM_BUTTON,
  HOME_DIVIDER,
  HOME_JOIN_ROOM_BUTTON,
  HOME_NAME_LABEL,
  HOME_NAME_PLACEHOLDER,
  HOME_ROOM_CODE_LABEL,
  HOME_ROOM_CODE_PLACEHOLDER,
  HOME_SUBTITLE,
} from '../textValues'
import styles from './Home.module.css'

interface HomeProps {
  initialCode: string // prefilled from a shared link (?room=ABCD)
  onJoined: (code: string) => void
}

// Start screen: enter a name, then create a room or join one by code
export default function Home({ initialCode, onJoined }: HomeProps) {
  const [name, setName] = useState(getStoredName)
  const [code, setCode] = useState(initialCode)
  const [run, busy, error] = useAction()
  const trimmedName = name.trim()

  const create = () =>
    run(async () => {
      storeName(trimmedName)
      onJoined(await createRoom(trimmedName))
    })

  const join = () =>
    run(async () => {
      storeName(trimmedName)
      await joinRoom(code, trimmedName)
      onJoined(code)
    })

  return (
    <main className={shared.screen}>
      <header className={shared.screenHeader}>
        <h1>{APP_TITLE}</h1>
        <p className={shared.muted}>{HOME_SUBTITLE}</p>
      </header>

      <label className={shared.field}>
        <span>{HOME_NAME_LABEL}</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          autoComplete="nickname"
          placeholder={HOME_NAME_PLACEHOLDER}
        />
      </label>

      <button className={`${shared.btn} ${shared.btnPrimary}`} disabled={!trimmedName || busy} onClick={create}>
        {HOME_CREATE_ROOM_BUTTON}
      </button>

      <div className={styles.divider}>{HOME_DIVIDER}</div>

      <label className={shared.field}>
        <span>{HOME_ROOM_CODE_LABEL}</span>
        <input
          className={styles.codeInput}
          value={code}
          // Codes are 4 capital letters; strip anything else as the user types
          onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4))}
          autoCapitalize="characters"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder={HOME_ROOM_CODE_PLACEHOLDER}
        />
      </label>

      <button className={shared.btn} disabled={!trimmedName || code.length !== 4 || busy} onClick={join}>
        {HOME_JOIN_ROOM_BUTTON}
      </button>

      {error && <p className={shared.error}>{error}</p>}
    </main>
  )
}
