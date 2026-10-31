import { useState } from 'react'
import { MENU_LABEL } from '../textValues'
import styles from './Menu.module.css'

export interface MenuItem {
  label: string
  onSelect: () => void
  danger?: boolean // shows the item in the danger color
}

// Generic dropdown behind a "⋯" button. Selecting an item closes the menu, then runs its action.
export default function Menu({ items, label = MENU_LABEL }: { items: MenuItem[]; label?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={styles.menu}>
      <button
        className={styles.trigger}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        ⋯
      </button>
      {open && (
        <>
          {/* Tapping anywhere outside the list closes it */}
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
          <ul className={styles.list} role="menu">
            {items.map((item) => (
              <li key={item.label}>
                <button
                  role="menuitem"
                  className={item.danger ? `${styles.item} ${styles.itemDanger}` : styles.item}
                  onClick={() => {
                    setOpen(false)
                    item.onSelect()
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
