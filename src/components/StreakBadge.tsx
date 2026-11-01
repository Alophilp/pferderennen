import { STREAK_BADGE, STREAK_BADGE_LABEL } from '../textValues'
import styles from './StreakBadge.module.css'

// Rounds a player has lost in a row, shown next to their name. Nothing without a current losing streak.
export default function StreakBadge({ streak }: { streak: number }) {
  if (streak === 0) return null

  return (
    <span className={styles.streakBadge} role="img" aria-label={STREAK_BADGE_LABEL(streak)} title={STREAK_BADGE_LABEL(streak)}>
      {STREAK_BADGE(streak)}
    </span>
  )
}
