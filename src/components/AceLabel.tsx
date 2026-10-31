import type { IconType } from 'react-icons'
import { BsSuitClubFill, BsSuitDiamondFill, BsSuitHeartFill, BsSuitSpadeFill } from 'react-icons/bs'
import blattIcon from '../assets/aces/blatt.svg'
import eichelIcon from '../assets/aces/eichel.svg'
import herzIcon from '../assets/aces/herz.svg'
import schelleIcon from '../assets/aces/schelle.svg'
import { useSettings } from '../hooks/useSettings'
import { ACE_NAMES } from '../textValues'
import type { Ace, Deck } from '../types'
import styles from './AceLabel.module.css'

// Bavarian suits are full-color images
const BAVARIAN_ICON: Record<Ace, string> = {
  Herz: herzIcon,
  Blatt: blattIcon,
  Eichel: eichelIcon,
  Schelle: schelleIcon,
}

// French suits are single-color icons that take the text color
const FRENCH_ICON: Record<Ace, IconType> = {
  Herz: BsSuitHeartFill,
  Blatt: BsSuitSpadeFill,
  Eichel: BsSuitClubFill,
  Schelle: BsSuitDiamondFill,
}

const COLOR_CLASS: Record<Deck, Record<Ace, string>> = {
  bavarian: { Herz: styles.herz, Blatt: styles.blatt, Eichel: styles.eichel, Schelle: styles.schelle },
  french: { Herz: styles.frenchRed, Blatt: styles.frenchBlack, Eichel: styles.frenchBlack, Schelle: styles.frenchRed },
}

interface AceLabelProps {
  ace: Ace
  large?: boolean // for the tappable ace buttons: much bigger icon when it's shown without the name
}

// Suit icon of an ace in the room's deck, followed by its name if the room shows names; colored per suit
export default function AceLabel({ ace, large = false }: AceLabelProps) {
  const { deck, aceDisplay } = useSettings()
  const name = ACE_NAMES[deck][ace]
  const showName = aceDisplay === 'iconAndName'
  const FrenchIcon = FRENCH_ICON[ace]
  const sizeClass = large && !showName ? styles.large : ''

  return (
    <span className={`${styles.aceLabel} ${COLOR_CLASS[deck][ace]} ${sizeClass}`}>
      {/* Without the visible name, the icon carries it for screen readers */}
      {deck === 'french' ? (
        <FrenchIcon
          className={styles.frenchIcon}
          role="img"
          aria-label={showName ? undefined : name}
          aria-hidden={showName}
        />
      ) : (
        <img className={styles.icon} src={BAVARIAN_ICON[ace]} alt={showName ? '' : name} />
      )}
      {showName && ` ${name}`}
    </span>
  )
}
