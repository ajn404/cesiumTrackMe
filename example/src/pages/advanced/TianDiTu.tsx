import { useCesium, useTianDiTu } from 'cesium-hooks'
import { useEffect, useState } from 'react'
import * as Cesium from 'cesium'

export function TianDiTuMap() {
  const [terrainProvider, setTerrainProvider] = useState(null)

  useEffect(() => {
    const fetchTerrainProvider = async () => {
      const terrain = await Cesium.createWorldTerrainAsync({})
      setTerrainProvider(terrain)
    }
    fetchTerrainProvider()
  }, [])

  const { cesiumContainerRef, viewer } = useCesium(import.meta.env.VITE_ION_TOKEN, {
    defaultCamera: {
      longitude: 116.3974,
      latitude: 40.9093,
      height: 3000,
      heading: 45,
      pitch: -45,
      roll: 0
    },
    terrainProvider,
    shouldAnimate: true,
    hideCredit: true
  })

  // 使用自定义Hook
  useTianDiTu(viewer, {
    apiKey: import.meta.env.VITE_TIANDITU_TOKEN,
    initialPosition: {
      longitude: 116.4074,
      latitude: 39.9042,
      height: 1000000
    },
    initialOrientation: {
      heading: 0,
      pitch: -90,
      roll: 0
    },
    minLevel: 0,
    maxLevel: 18
  });

  return (
    <div className="h-full w-full">
      <div ref={cesiumContainerRef} className="h-full w-full" />
    </div>
  )
} 