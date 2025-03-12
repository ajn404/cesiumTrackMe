import { useCesium, useTianDiTu } from 'cesium-hooks'
import { useEffect } from 'react';

export default function TianDiTuMap() {

  const { cesiumContainerRef, viewer } = useCesium(import.meta.env.VITE_ION_TOKEN, {
    shouldAnimate: true,
    hideCredit: true,
    // terrainProvider: terrainProvider,
  })

  // 使用自定义Hook
  useTianDiTu(viewer, {
    apiKey: import.meta.env.VITE_TIANDITU_TOKEN,
    initialPosition: {
      longitude: 116.5389,
      latitude: 39.8209,
      height: 500,
    },
    initialOrientation: {
      heading: 0,
      pitch: -90,
      roll: 0
    },
    minLevel: 0,
    maxLevel: 18,
    layers: {
      image: true,
      imageAnnotation: true
    }
  });

  useEffect(() => {
    console.log(viewer.current.imageryLayers)
  },[viewer])

  return (
    <div className="h-full w-full">
      <div ref={cesiumContainerRef} className="h-full w-full" />
    </div>
  )
} 