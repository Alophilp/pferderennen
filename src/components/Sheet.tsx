import type { ReactNode } from 'react'
import shared from '../styles/shared.module.css'
import { CLOSE_BUTTON } from '../textValues'
import styles from './Sheet.module.css'

interface SheetProps {
  title: string
  error?: string | null
  onClose: () => void
  footer?: ReactNode // shown below the scrollable content, so it stays visible with long lists
  children: ReactNode
}

// Bottom sheet with a title, scrollable content and a close button, used for lists opened from the room menu.
// Tapping the dimmed area outside the sheet also closes it.
export default function Sheet({ title, error, onClose, footer, children }: SheetProps) {
  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      // Only taps on the backdrop itself, not ones that bubble up from inside the sheet
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.sheet}>
        <p className={styles.title}>{title}</p>
        <div className={styles.content}>{children}</div>
        {footer}
        {error && <p className={shared.error}>{error}</p>}
        <button className={shared.btn} onClick={onClose}>
          {CLOSE_BUTTON}
        </button>
      </div>
    </div>
  )
}
