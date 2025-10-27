"use client"

import { createContext, useState, useContext } from "react"

const LocationContext = createContext({
  selectedLocation: null as number | null,
  selectedLocationPath: null as string | null,
  selectedLocationType: null as string | null,
  setSelectedLocation: (id: number | null, type?: string | null) => {},
  setSelectedLocationPath: (path: string | null) => {},
})

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [selectedLocation, setSelectedLocationState] = useState<number | null>(null)
  const [selectedLocationPath, setSelectedLocationPath] = useState<string | null>(null)
  const [selectedLocationType, setSelectedLocationType] = useState<string | null>(null)

  const setSelectedLocation = (id: number | null, type?: string | null) => {
    setSelectedLocationState(id)
    setSelectedLocationType(type || null)
  }

  return (
    <LocationContext.Provider value={{ selectedLocation, selectedLocationPath, selectedLocationType, setSelectedLocation, setSelectedLocationPath }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  return useContext(LocationContext)
}