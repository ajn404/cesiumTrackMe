import { useCesium } from 'cesium-hooks'
import { useTracking } from 'cesium-hooks'
import { useMemo, memo } from 'react'

import { Color } from 'cesium'
import { MODELS } from '@/constants/models';

export const generateTrajectory = (centerLng = -117.16, centerLat = 32.71) => {
  const points = [];
  const baseTime = new Date("2024-01-01T00:00:00Z").getTime();
  for (let t = 0; t < 200; t++) {
    const angle = t * 0.1;
    const radius = 0.0005 * angle;

    // 生成坐标
    const lng =
      centerLng +
      radius * (1 + 0.3 * Math.sin(5 * angle)) * Math.cos(angle) +
      (Math.random() - 0.5) * 0.0001;

    const lat =
      centerLat +
      radius * (1 + 0.3 * Math.sin(5 * angle)) * Math.sin(angle) +
      (Math.random() - 0.5) * 0.0001;

    // 生成时间戳（每5秒一个点）
    const timestamp = baseTime + t * 5000; // 5000毫秒 = 5秒

    points.push({
      time: timestamp, // 毫秒级时间戳
      lng: Number(lng.toFixed(6)),
      lat: Number(lat.toFixed(6)),
    });
  }
  return points;
};

export const Tracking = memo(function Tracking() {
  const { cesiumContainerRef, viewer } = useCesium(import.meta.env.VITE_ION_TOKEN)
  
  // 使用 useMemo 来缓存轨迹点数据
  const trajectoryPoints = useMemo(() => generateTrajectory(116.5389, 39.8209), [])

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
})