import type { ReactNode } from 'react'
import shared from '../styles/shared.module.css'
import { CANCEL_BUTTON } from '../textValues'
import styles from './ConfirmDialog.module.css'

interface ConfirmDialogProps {
  title: ReactNode
  message?: ReactNode
  confirmLabel: string
  busy?: boolean // disables both buttons while the action runs
  error?: string | null
  onConfirm: () => void
  onCancel: () => void
}

// Asks the user to confirm an action before it runs
export default function ConfirmDialog({ title, message, confirmLabel, busy, error, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.dialog}>
        <p className={styles.title}>{title}</p>
        {message && <p className={shared.muted}>{message}</p>}
        {error && <p className={shared.error}>{error}</p>}
        <div className={styles.actions}>
          <button className={shared.btn} disabled={busy} onClick={onCancel}>
            {CANCEL_BUTTON}
          </button>
          <button className={`${shared.btn} ${shared.btnPrimary}`} disabled={busy} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
