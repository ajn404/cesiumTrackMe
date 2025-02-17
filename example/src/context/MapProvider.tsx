import React, { createContext, useState } from 'react'

export type MapProviderType = 'Ion' | 'Tianditu'

interface MapContextType {
  mapProvider: MapProviderType
  setMapProvider: (provider: MapProviderType) => void
}

export const MapContext = createContext<MapContextType>({
  mapProvider: 'Ion',
  setMapProvider: () => {}
})

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [mapProvider, setMapProvider] = useState<MapProviderType>('Ion')

  return (
    <MapContext.Provider value={{ mapProvider, setMapProvider }}>
      {children}
    </MapContext.Provider>
  )
} 