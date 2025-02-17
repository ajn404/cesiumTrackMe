import { useCesium } from 'cesium-hooks'
import { MapContext } from '@/context/MapProvider'
import { useContext } from 'react'
export default function AtmosphereMap() {
  const { mapProvider } = useContext(MapContext)

  const { cesiumContainerRef } = useCesium(import.meta.env.VITE_ION_TOKEN, {
    skyAtmosphere: true,
    defaultCamera: {
      longitude: 116.3974,
      latitude: 39.9093,
      height: 1000000,
      pitch: -45
    },
    tianDiTu: {
      enabled: mapProvider === 'Tianditu',
      token: import.meta.env.VITE_TIANDITU_TOKEN
    },
  })

  return (
    <div className="h-full w-full">
      <div ref={cesiumContainerRef} className="h-full w-full" />
    </div>
  )
} 