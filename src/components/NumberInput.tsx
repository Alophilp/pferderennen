import { useState } from 'react'
import styles from './NumberInput.module.css'

interface NumberInputProps {
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  label: string // for screen readers, since there is no visible label
  className?: string // font size, weight and width come from the caller
}

// A number that looks like plain text but can be tapped to type a new value with the number keyboard.
// While typing, anything goes (even an empty field); the value is clamped to min..max when the field loses focus.
export default function NumberInput({ value, min, max, onChange, label, className }: NumberInputProps) {
  const [text, setText] = useState<string | null>(null) // null while not editing

  const commit = () => {
    if (text === null) return
    const typed = parseInt(text, 10)
    onChange(Number.isNaN(typed) ? value : Math.min(max, Math.max(min, typed)))
    setText(null)
  }

  return (
    <input
      className={className ? `${styles.input} ${className}` : styles.input}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      aria-label={label}
      value={text ?? String(value)}
      onFocus={(e) => {
        setText(String(value))
        e.target.select() // so typing replaces the old number
      }}
      onChange={(e) => setText(e.target.value.replace(/\D/g, ''))}
      onBlur={commit}
      onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
    />
  )
}
