import { useAction } from '../hooks/useAction'
import { roomSettings } from '../lib/helpers'
import { resetSettings, updateSetting } from '../lib/roomActions'
import shared from '../styles/shared.module.css'
import {
  ACE_DISPLAY_NAMES,
  DECK_NAMES,
  ON_OFF_NAMES,
  SETTINGS_ACE_DISPLAY_LABEL,
  SETTINGS_DECK_LABEL,
  SETTINGS_DISTRIBUTE_SIPS_LABEL,
  SETTINGS_RESET_BUTTON,
  SETTINGS_TITLE,
} from '../textValues'
import type { Room } from '../types'
import Sheet from './Sheet'
import styles from './SettingsSheet.module.css'

interface SettingsSheetProps {
  code: string
  room: Room
  onClose: () => void
}

// Host: room settings. Every change is saved right away, so there is no apply button.
export default function SettingsSheet({ code, room, onClose }: SettingsSheetProps) {
  const [run, busy, error] = useAction()
  const settings = roomSettings(room)

  return (
    <Sheet title={SETTINGS_TITLE} error={error} onClose={onClose}>
      <div className={shared.stack}>
        {/* Add further settings here */}
        <Choice
          label={SETTINGS_DECK_LABEL}
          options={DECK_NAMES}
          value={settings.deck}
          onChange={(deck) => run(() => updateSetting(code, 'deck', deck))}
        />
        <Choice
          label={SETTINGS_ACE_DISPLAY_LABEL}
          options={ACE_DISPLAY_NAMES}
          value={settings.aceDisplay}
          onChange={(aceDisplay) => run(() => updateSetting(code, 'aceDisplay', aceDisplay))}
        />
        <Choice
          label={SETTINGS_DISTRIBUTE_SIPS_LABEL}
          options={ON_OFF_NAMES}
          value={settings.distributeSips}
          onChange={(distributeSips) => run(() => updateSetting(code, 'distributeSips', distributeSips))}
        />
        {/* Nothing to reset while every setting is at its default */}
        <button className={shared.btn} disabled={busy || !room.settings} onClick={() => run(() => resetSettings(code))}>
          {SETTINGS_RESET_BUTTON}
        </button>
      </div>
    </Sheet>
  )
}

interface ChoiceProps<T extends string> {
  label: string
  options: Record<T, string> // value → display name
  value: T
  onChange: (value: T) => void
}

// Segmented control: one button per option, the selected one highlighted
function Choice<T extends string>({ label, options, value, onChange }: ChoiceProps<T>) {
  return (
    <div className={styles.setting}>
      <span className={shared.muted}>{label}</span>
      <div className={styles.choice} role="group" aria-label={label}>
        {(Object.keys(options) as T[]).map((option) => (
          <button key={option} className={styles.option} aria-pressed={option === value} onClick={() => onChange(option)}>
            {options[option]}
          </button>
        ))}
      </div>
    </div>
  )
}
