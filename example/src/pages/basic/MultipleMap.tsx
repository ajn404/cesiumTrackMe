import { useCesium } from 'cesium-hooks'
import { MapContext } from '@/context/MapProvider'
import { useContext,useEffect } from 'react'
import { Cartesian2, Cartesian3, ClockViewModel, defined, SceneMode } from 'cesium';

export default function MultipleMap() {
    const { mapProvider } = useContext(MapContext)
    const clockViewModel = new ClockViewModel();

    const map2D = useCesium(
        import.meta.env.VITE_ION_TOKEN,
        {
            hideCredit:true,
            clockViewModel: clockViewModel,
            sceneMode: SceneMode.SCENE2D,
            tianDiTu: {
                enabled: mapProvider === 'Tianditu',
                token: import.meta.env.VITE_TIANDITU_TOKEN
            },
        }
    )

    const map3D = useCesium(
        import.meta.env.VITE_ION_TOKEN,
        {
            hideCredit: true,
            fullscreenButton: false,
            sceneModePicker: false,
            clockViewModel: clockViewModel,
            tianDiTu: {
                enabled: mapProvider === 'Tianditu',
                token: import.meta.env.VITE_TIANDITU_TOKEN
            },
        }
    )

    useEffect(() => {
        if(map2D.viewer.current && map3D.viewer.current) {
            const view2D = map2D.viewer.current;
            const view3D = map3D.viewer.current;

            let worldPosition;
            let distance;

            function sync2DView() {
                const viewCenter = new Cartesian2(
                    Math.floor(view3D.canvas.clientWidth / 2),
                    Math.floor(view3D.canvas.clientHeight / 2),
                );
                const newWorldPosition = view3D.scene.camera.pickEllipsoid(viewCenter);
                if (defined(newWorldPosition)) {
                    worldPosition = newWorldPosition;
                }
                distance = Cartesian3.distance(
                    worldPosition,
                    view3D.scene.camera.positionWC,
                );
                view2D.scene.camera.lookAt(
                    worldPosition,
                    new Cartesian3(0.0, 0.0, distance),
                );
            }
            view3D.camera.changed.addEventListener(sync2DView);
            view3D.camera.percentageChanged = 0.01;
        }
    },[map2D.viewer, map3D.viewer])

    return (
        <div className="h-full w-full flex">
            <div ref={map3D.cesiumContainerRef} className="h-full w-1/2" />
            <div ref={map2D.cesiumContainerRef} className="h-full w-1/2" />
        </div>
    )
} 