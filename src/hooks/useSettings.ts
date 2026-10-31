import { createContext, useContext } from 'react'
import { DEFAULT_SETTINGS, type Settings } from '../types'

// Settings of the current room, provided by RoomView so components like AceLabel don't need them passed down through every screen
export const SettingsContext = createContext<Settings>(DEFAULT_SETTINGS)

export function useSettings() {
  return useContext(SettingsContext)
}
