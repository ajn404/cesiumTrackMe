import { useCesium } from 'cesium-hooks'

export function CameraMap() {
  const { cesiumContainerRef } = useCesium(import.meta.env.VITE_ION_TOKEN, {
    defaultCamera: {
      longitude: 116.3974,
      latitude: 39.9093,
      height: 10000,
      heading: 45,
      pitch: -45,
      roll: 0
    },
    enableDrag: false
  })

  return (
    <div className="h-full w-full">
      <div ref={cesiumContainerRef} className="h-full w-full" />
    </div>
  )
} 