import { useEffect, useState } from 'react'
import { useCesium } from 'cesium-hooks'
import { createWorldTerrainAsync } from 'cesium'

export default function TerrainMap() {
  const [terrainProvider, setTerrainProvider] = useState(null)

  useEffect(() => {
    const fetchTerrainProvider = async () => {
      const terrain = await createWorldTerrainAsync({
        requestWaterMask: true,
        requestVertexNormals: true,
      })
      setTerrainProvider(terrain)
    }

    fetchTerrainProvider()
  }, [])

  const { cesiumContainerRef } = useCesium(import.meta.env.VITE_ION_TOKEN, {
    defaultCamera: {
      longitude: 116.3974,
      latitude: 40.9093,
      height: 3000,
      heading: 45,
      pitch: -45,
      roll: 0
    },
    terrainProvider,
  })

  return (
    <div className="h-full w-full">
      <div ref={cesiumContainerRef} className="h-full w-full" />
    </div>
  )
}