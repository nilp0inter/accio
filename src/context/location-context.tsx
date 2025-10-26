"use client"

import { createContext, useState, useContext } from "react"

const LocationContext = createContext({
  selectedLocation: null as number | null,
  setSelectedLocation: (id: number | null) => {},
})

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null)

  return (
    <LocationContext.Provider value={{ selectedLocation, setSelectedLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  return useContext(LocationContext)
}