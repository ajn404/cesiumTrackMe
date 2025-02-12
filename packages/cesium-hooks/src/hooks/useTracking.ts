import {
  Cartesian3,
  JulianDate,
  ClockRange,
  SampledPositionProperty,
  TimeInterval,
  PointGraphics,
  PolylineGlowMaterialProperty,
  VelocityOrientationProperty,
  TimeIntervalCollection,
  Color,
  PathGraphics,
  Cartographic,
  Math as CesiumMath,
  Viewer,
  Clock
} from "cesium"
import { useCallback, useEffect, useState } from "react"

export interface TrajectoryPoint {
  lng: number
  lat: number
  time: number | string | Date
}

interface UseTrackingOptions {
  trajectoryPoints: TrajectoryPoint[]
  modelUrl: string
  modelScale?: number
  pathColor?: Color
  pointColor?: Color
  clockMultiplier?: number
}

interface Position {
  lng: number
  lat: number
}

export function useTracking(viewer: React.MutableRefObject<Viewer | undefined>, options: UseTrackingOptions) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<Position>()
  
  const {
    trajectoryPoints,
    modelUrl,
    modelScale = 2,
    pathColor = Color.YELLOW,
    pointColor = Color.RED,
    clockMultiplier = 1
  } = options

  // 创建时间驱动的动态位置属性
  const createTimeBasedPosition = useCallback(() => {
    if (!viewer.current) return

    // 1. 配置场景时钟
    const viewerClock = viewer.current.clock
    
    // 配置时钟参数
    viewerClock.startTime = JulianDate.fromDate(
      new Date(trajectoryPoints[0].time)
    )
    viewerClock.stopTime = JulianDate.fromDate(
      new Date(trajectoryPoints[trajectoryPoints.length - 1].time)
    )
    viewerClock.currentTime = JulianDate.clone(viewerClock.startTime)
    viewerClock.clockRange = ClockRange.LOOP_STOP
    viewerClock.multiplier = clockMultiplier

    // 2. 创建采样位置属性
    const positionProperty = new SampledPositionProperty()
    trajectoryPoints.forEach(point => {
      const time = JulianDate.fromDate(new Date(point.time))
      const position = Cartesian3.fromDegrees(point.lng, point.lat)
      positionProperty.addSample(time, position)
    })

    // 3. 创建动态实体
    const movingEntity = viewer.current.entities.add({
      availability: new TimeIntervalCollection([
        new TimeInterval({
          start: viewerClock.startTime,
          stop: viewerClock.stopTime,
        }),
      ]),
      model: {
        uri: modelUrl,
        scale: modelScale,
        minimumPixelSize: 64,
        maximumScale: 200,
        clampAnimations: false,
      },
      position: positionProperty,
      orientation: new VelocityOrientationProperty(positionProperty),
      point: new PointGraphics({
        color: pointColor,
        pixelSize: 12,
        outlineColor: Color.WHITE,
        outlineWidth: 2,
      }),
      path: new PathGraphics({
        resolution: 1,
        material: new PolylineGlowMaterialProperty({
          glowPower: 0.3,
          color: pathColor,
        }),
        width: 3,
      }),
    })

    // 配置跟踪参数
    viewer.current.trackedEntity = movingEntity
    viewer.current.scene.screenSpaceCameraController.enableCollisionDetection = false

    // 4. 时间变化监听
    const onClockTick = (clock: Clock) => {
      const currentTime = clock.currentTime
      const cartesian = positionProperty.getValue(currentTime)
      if (cartesian) {
        const cartographic = Cartographic.fromCartesian(cartesian)
        const newLng = CesiumMath.toDegrees(cartographic.longitude)
        const newLat = CesiumMath.toDegrees(cartographic.latitude)
        // 直接更新位置，不再检查阈值
        setCurrentPosition(_ => {
          return {
            lng: newLng,
            lat: newLat,
          }
        })
      } 
    }

    viewer.current.clock.onTick.addEventListener(onClockTick)

    return () => {
      if (viewer.current) {
        viewer.current.entities.remove(movingEntity)
        viewer.current.clock.onTick.removeEventListener(onClockTick)
      }
    }
  }, [viewer, currentPosition])

  // 初始化场景
  useEffect(() => {
    if (!viewer.current) return
    // 绘制静态轨迹
    const staticPath = viewer.current.entities.add({
      polyline: {
        positions: Cartesian3.fromDegreesArray(
          trajectoryPoints.flatMap(p => [p.lng, p.lat])
        ),
        width: 1,
        material: Color.GRAY.withAlpha(0.5),
      },
    })
    const cleanup = createTimeBasedPosition()

    return () => {
      if (viewer.current) {
        viewer.current.entities.remove(staticPath)
      }
      cleanup?.()
    }
  }, [createTimeBasedPosition])

  // 控制方法
  const controls = {
    play: () => {
      if (!viewer.current) return
      viewer.current.clock.shouldAnimate = true
      setIsPlaying(true)
    },
    pause: () => {
      if (!viewer.current) return
      viewer.current.clock.shouldAnimate = false
      setIsPlaying(false)
    },
    toggle: () => {
      if (!viewer.current) return
      if (isPlaying) {
        controls.pause()
      } else {
        if (
          JulianDate.compare(
            viewer.current.clock.currentTime,
            viewer.current.clock.stopTime
          ) === 0
        ) {
          viewer.current.clock.currentTime = viewer.current.clock.startTime
        }
        controls.play()
      }
    },
    reset: () => {
      if (!viewer.current) return
      viewer.current.clock.currentTime = viewer.current.clock.startTime
      viewer.current.clock.shouldAnimate = false
      setIsPlaying(false)
    }
  }

  return {
    isPlaying,
    currentPosition,
    controls
  }
}