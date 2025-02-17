import { useCesium } from 'cesium-hooks'
import { MapContext } from '@/context/MapProvider'
import { useContext } from 'react'
export default function PerformanceMap() {
  const { mapProvider } = useContext(MapContext)
  const { cesiumContainerRef } = useCesium(import.meta.env.VITE_ION_TOKEN, {
    requestRenderMode: true,
    maximumRenderTimeChange: 1000,
    targetFrameRate: 30,
    orderIndependentTranslucency: false,
    fullscreenButton: true,
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