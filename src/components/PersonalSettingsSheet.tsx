import { useState } from 'react'
import { useSettings } from '../hooks/useSettings'
import { getPersonalSettings, storePersonalSetting } from '../lib/player'
import shared from '../styles/shared.module.css'
import {
  ON_OFF_NAMES,
  PERSONAL_SETTINGS_SOUND_LABEL,
  PERSONAL_SETTINGS_SOUND_OFF_BY_HOST,
  PERSONAL_SETTINGS_TITLE,
  PERSONAL_SETTINGS_VIBRATION_LABEL,
  PERSONAL_SETTINGS_VIBRATION_OFF_BY_HOST,
} from '../textValues'
import type { PersonalSettings } from '../types'
import { Choice } from './SettingsSheet'
import Sheet from './Sheet'

// Every player: their own settings, stored on this phone only. Every change is saved right away.
export default function PersonalSettingsSheet({ onClose }: { onClose: () => void }) {
  const [settings, setSettings] = useState(getPersonalSettings)
  const roomSettings = useSettings()

  const change = <K extends keyof PersonalSettings>(key: K, value: PersonalSettings[K]) => {
    storePersonalSetting(key, value)
    setSettings((s) => ({ ...s, [key]: value }))
  }

  // When the host has turned something off for everyone, the own setting has no effect
  const vibrationOffByHost = roomSettings.vibration === 'off'
  const soundOffByHost = roomSettings.sound === 'off'

  return (
    <Sheet title={PERSONAL_SETTINGS_TITLE} onClose={onClose}>
      <div className={shared.stack}>
        {/* Add further personal settings here */}
        <Choice
          label={PERSONAL_SETTINGS_VIBRATION_LABEL}
          options={ON_OFF_NAMES}
          value={settings.vibration}
          onChange={(vibration) => change('vibration', vibration)}
          disabled={vibrationOffByHost}
          hint={vibrationOffByHost ? PERSONAL_SETTINGS_VIBRATION_OFF_BY_HOST : undefined}
        />
        <Choice
          label={PERSONAL_SETTINGS_SOUND_LABEL}
          options={ON_OFF_NAMES}
          value={settings.sound}
          onChange={(sound) => change('sound', sound)}
          disabled={soundOffByHost}
          hint={soundOffByHost ? PERSONAL_SETTINGS_SOUND_OFF_BY_HOST : undefined}
        />
      </div>
    </Sheet>
  )
}
