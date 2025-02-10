import { MutableRefObject } from 'react'
import { Viewer, Entity, Color, Cartesian3 } from 'cesium'

interface TrackingPoint {
  position: Cartesian3
  point?: {
    pixelSize?: number
    color?: Color
  }
}

interface TrackingOptions {
  pathColor?: Color
  pathWidth?: number
  followDistance?: number
}

export function useTracking(viewerRef: MutableRefObject<Viewer | undefined>) {
  const points: Cartesian3[] = []
  let pathEntity: Entity | undefined

  const addTrackingPoint = (point: TrackingPoint) => {
    if (!viewerRef.current) return

    points.push(point.position)

    viewerRef.current.entities.add({
      position: point.position,
      point: {
        pixelSize: point.point?.pixelSize ?? 8,
        color: point.point?.color ?? Color.RED
      }
    })
  }

  const startTracking = (options: TrackingOptions = {}) => {
    if (!viewerRef.current || points.length < 2) return

    pathEntity = viewerRef.current.entities.add({
      polyline: {
        positions: points,
        width: options.pathWidth ?? 2,
        material: options.pathColor ?? Color.YELLOW
      }
    })

    if (options.followDistance) {
      viewerRef.current.camera.lookAt(
        points[points.length - 1],
        new Cartesian3(0, -options.followDistance, options.followDistance)
      )
    }
  }

  const stopTracking = () => {
    if (!viewerRef.current || !pathEntity) return
    viewerRef.current.entities.remove(pathEntity)
    points.length = 0
  }

  return {
    addTrackingPoint,
    startTracking,
    stopTracking
  }
}