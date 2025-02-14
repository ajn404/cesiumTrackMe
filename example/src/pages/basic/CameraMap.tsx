import { useCamera, useCesium } from 'cesium-hooks'
import { Button } from '@/components/ui/button'

export function CameraMap() {
  const { cesiumContainerRef, viewer } = useCesium(import.meta.env.VITE_ION_TOKEN, {
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
  let { flyTo, zoomIn, zoomOut, setView, getCurrentPosition } = useCamera({
    viewer 
  })

  return (
    <div className="h-full w-full">
      <div ref={cesiumContainerRef} className="h-full w-full" />
      <div className="absolute top-5 right-5 z-10 rounded-lg bg-white/90 p-3 dark:bg-gray-800/90 dark:text-white">
        <Button
          variant="outline"
          className="hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
          onClick={() => {
            flyTo({
              longitude: 116.3974,
              latitude: 39.9093,
              height: 10000
            })
          }}
        >
          flyTo
        </Button>
        <Button
          variant="outline"
          className="hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
          onClick={() => {
            zoomIn()
          }}
        >
          Zoom In
        </Button>
        <Button
          variant="outline"
          className="hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
          onClick={() => {
            zoomOut()
          }}
        >
          Zoom Out
        </Button>
        <Button
          variant="outline"
          className="hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
          onClick={() => {
            setView({
              longitude: 116.5389,
              latitude: 39.8209,
              height:500
            })
          }}
        >
          setView
        </Button>
      </div>
    </div>
  )
}