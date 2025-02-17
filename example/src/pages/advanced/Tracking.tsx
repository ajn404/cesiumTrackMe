import { useCesium } from 'cesium-hooks'
import { useTracking } from 'cesium-hooks'
import { useMemo } from 'react'
import { Color } from 'cesium'
import { MODELS } from '@/constants/models';
import { generateTrajectory } from '@/constants/utils';
import { MapContext } from '@/context/MapProvider'
import { useContext } from 'react'

export default function Tracking() {
  const { mapProvider } = useContext(MapContext)
  const { cesiumContainerRef, viewer } = useCesium(import.meta.env.VITE_ION_TOKEN, {
    targetFrameRate: 30,
    tianDiTu: {
      enabled: mapProvider === 'Tianditu',
      token: import.meta.env.VITE_TIANDITU_TOKEN
    },
  })

  // 使用 useMemo 来缓存轨迹点数据
  const trajectoryPoints = useMemo(() => {
    return generateTrajectory(116.5389, 39.8209)
  }, [])


  const { isPlaying, currentPosition, controls } = useTracking(viewer, {
    trajectoryPoints, // 直接传入缓存的数据，而不是函数调用
    pathColor: Color.YELLOW,
    clockMultiplier: 1,
    modelUrl: MODELS.CESIUM_MAN.url
  })

  const positionDisplay = useMemo(() => {
    if (!currentPosition) return null;
    return (
      <div className="mt-2">
        经度: {currentPosition.lng.toFixed(6)}
        纬度: {currentPosition.lat.toFixed(6)}
      </div>
    );
  }, [currentPosition?.lng.toFixed(6), currentPosition?.lat.toFixed(6)]);

  return (
    <div className="h-full w-full relative">
      <div ref={cesiumContainerRef} className="w-full h-full" />
      <div className="absolute top-5 left-5 z-10 bg-black/70 text-white p-3 rounded-lg">
        <button onClick={controls.toggle}>
          {isPlaying ? "⏸️ 暂停" : "▶️ 播放"}
        </button>
        <button onClick={controls.reset}>⏹️ 重置</button>
        {positionDisplay}
      </div>
    </div>
  )
}