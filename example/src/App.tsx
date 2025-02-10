import { useCesium } from 'cesium-hooks'
import { useEffect } from 'react'

export default function App() {
  const { cesiumContainerRef, viewer } = useCesium(import.meta.env.VITE_ION_TOKEN)

  useEffect(() => {
    if (viewer.current) {
      console.log('Cesium viewer initialized:', viewer.current)
    }
  }, [viewer.current])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div
        ref={cesiumContainerRef}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
} 