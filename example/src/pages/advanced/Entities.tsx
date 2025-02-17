import { useCesium } from 'cesium-hooks'
import { useEffect } from 'react'
import * as Cesium from 'cesium'
import { MapContext } from '@/context/MapProvider'
import { useContext } from 'react'

export default function Water() {
    const { mapProvider } = useContext(MapContext)
    const { cesiumContainerRef, viewer } = useCesium(import.meta.env.VITE_ION_TOKEN, {
        hideCredit: true,
        tianDiTu: {
            enabled: mapProvider === 'Tianditu',
            token: import.meta.env.VITE_TIANDITU_TOKEN
        },
    })

    useEffect(() => {
        if (viewer.current) {
            const entity = viewer.current.entities.add({
                name: 'Wall',
                wall: {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                        -107.0, 43.0, 100000.0, -97.0, 43.0, 100000.0, -97.0, 40.0, 100000.0,
                        -107.0, 40.0, 100000.0, -107.0, 43.0, 100000.0,
                    ]),
                    material: Cesium.Color.GREEN,
                    outline: true,
                }
            });
            viewer.current.zoomTo(viewer.current.entities);
        }
    }, [viewer])

    return (
        <div className="h-full w-full">
            <div ref={cesiumContainerRef} className="h-full w-full" />
        </div>
    )
}