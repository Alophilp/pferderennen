import blattIcon from '../assets/aces/blatt.svg'
import eichelIcon from '../assets/aces/eichel.svg'
import herzIcon from '../assets/aces/herz.svg'
import schelleIcon from '../assets/aces/schelle.svg'
import { ACE_NAMES } from '../textValues'
import type { Ace } from '../types'
import styles from './AceLabel.module.css'

const ACE_ICON: Record<Ace, string> = {
  Herz: herzIcon,
  Blatt: blattIcon,
  Eichel: eichelIcon,
  Schelle: schelleIcon,
}

const ACE_COLOR_CLASS: Record<Ace, string> = {
  Herz: styles.herz,
  Blatt: styles.blatt,
  Eichel: styles.eichel,
  Schelle: styles.schelle,
}

// An ace's suit icon and name in its color, e.g. "♥ Herz". The icon scales with the surrounding font size.
export default function AceLabel({ ace }: { ace: Ace }) {
  return (
    <span className={`${styles.aceLabel} ${ACE_COLOR_CLASS[ace]}`}>
      {/* Decorative: the name next to it already says which ace it is */}
      <img className={styles.icon} src={ACE_ICON[ace]} alt="" aria-hidden="true" /> {ACE_NAMES[ace]}
    </span>
  )
}
