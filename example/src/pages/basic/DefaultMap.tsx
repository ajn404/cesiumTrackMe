import { useCesium } from 'cesium-hooks'

export default function DefaultMap() {
  const { cesiumContainerRef } = useCesium(import.meta.env.VITE_ION_TOKEN)

  return (
    <div className="h-full w-full">
      <div ref={cesiumContainerRef} className="h-full w-full" />
    </div>
  )
} 