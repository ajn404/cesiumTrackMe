import { useCesium, useTracking } from 'cesium-hooks'
import { useEffect } from 'react'
import { Cartesian3, Color } from 'cesium'

export function Tracking() {
  const { cesiumContainerRef, viewer } = useCesium(import.meta.env.VITE_ION_TOKEN)
  const { addTrackingPoint, startTracking, stopTracking } = useTracking(viewer)

  useEffect(() => {
    if (!viewer.current) return

    // 模拟轨迹点数据
    const points = [
      { longitude: 116.3974, latitude: 39.9093, height: 0 },
      { longitude: 116.3975, latitude: 39.9095, height: 0 },
      { longitude: 116.3977, latitude: 39.9098, height: 0 },
      { longitude: 116.3980, latitude: 39.9100, height: 0 },
    ]

    // 添加轨迹点和路径
    points.forEach(point => {
      addTrackingPoint({
        position: Cartesian3.fromDegrees(point.longitude, point.latitude, point.height),
        point: {
          pixelSize: 10,
          color: Color.RED,
        }
      })
    })

    // 开始追踪
    startTracking({
      pathColor: Color.YELLOW,
      pathWidth: 3,
      followDistance: 1000
    })

    return () => {
      stopTracking()
    }
  }, [viewer.current])

  return (
    <div className="h-full w-full">
      <div ref={cesiumContainerRef} className="h-full w-full" />
    </div>
  )
} 