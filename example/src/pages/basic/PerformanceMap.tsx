import { useCesium } from 'cesium-hooks'

export function PerformanceMap() {
  const { cesiumContainerRef } = useCesium(import.meta.env.VITE_ION_TOKEN, {
    requestRenderMode: true,
    maximumRenderTimeChange: 1000,
    targetFrameRate: 30,
    orderIndependentTranslucency: false,
    fullscreenButton:true,
  })

  return (
    <div className="h-full w-full">
      <div ref={cesiumContainerRef} className="h-full w-full" />
    </div>
  )
} 