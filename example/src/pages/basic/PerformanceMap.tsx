import { useCesium } from 'cesium-hooks'
import { MapContext } from '@/context/MapProvider'
import { useContext, useEffect } from 'react'
export default function PerformanceMap() {
  const { mapProvider } = useContext(MapContext)
  const { cesiumContainerRef,viewer } = useCesium(import.meta.env.VITE_ION_TOKEN, {
    hideCredit: true,
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

  useEffect(() => {
    viewer.current.scene.globe.showGroundAtmosphere = true;
  }, [viewer])

  return (
    <div className="h-full w-full">
      <div ref={cesiumContainerRef} className="h-full w-full" />
    </div>
  )
} 