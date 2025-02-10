import { useCesium } from 'cesium-hooks'

export function SkyboxMap() {
  const { cesiumContainerRef } = useCesium(import.meta.env.VITE_ION_TOKEN, {
    skyBox: true,
    defaultCamera: {
      longitude: 116.3974,
      latitude: 39.9093,
      height: 5000000,
      pitch: -45
    }
  })

  return (
    <div className="h-full w-full">
      <div ref={cesiumContainerRef} className="h-full w-full" />
    </div>
  )
} 