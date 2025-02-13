import { useCamera, useCesium } from 'cesium-hooks'
import { Button } from '@/components/ui/button'
import { useEffect, useRef } from 'react'
import { Viewer } from "cesium";

export function CameraMap() {
  const { cesiumContainerRef, viewer, isReady } = useCesium(import.meta.env.VITE_ION_TOKEN, {
    defaultCamera: {
      longitude: 116.3974,
      latitude: 39.9093,
      height: 10000,
      heading: 45,
      pitch: -45,
      roll: 0
    },
    enableDrag: false
  })
  // const viewerRef = useRef<Viewer | undefined>(viewer);

  // useEffect(() => {
  //   viewerRef.current = viewer;
  // }, [viewer]);

  let { flyTo, zoomIn, zoomOut, setView, getCurrentPosition } = useCamera({
    viewer 
  })

  const handleResetView = () => {
    if (!isReady.current) return 
    flyTo({
      longitude: 116.3974,
      latitude: 39.9093,
      height: 10000
    })
  }

  const handleZoomIn = () => {
    if (!isReady.current) return;
    zoomIn();
  }

  const handleZoomOut = () => {
    if (!isReady.current) return;
    zoomOut();
  }

  return (
    <div className="h-full w-full">
      <div ref={cesiumContainerRef} className="h-full w-full" />
      <div className="absolute top-5 right-5 z-10 rounded-lg bg-white/90 p-3 dark:bg-gray-800/90 dark:text-white">
        <Button
          variant="outline"
          className="hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
          onClick={handleResetView}
        >
          useCamera
        </Button>
        <Button
          variant="outline"
          className="hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
          onClick={handleZoomIn}
        >
          Zoom In
        </Button>
        <Button
          variant="outline"
          className="hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
          onClick={handleZoomOut}
        >
          Zoom Out
        </Button>
      </div>
    </div>
  )
}