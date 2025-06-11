import { useCesium } from 'cesium-hooks'
import { useEffect, useRef } from 'react'
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

    const sceneRef = useRef(null);
    const primitiveRef = useRef(null);

    useEffect(() => {
        if (viewer.current) {
            sceneRef.current = viewer.current.scene;
            const liquidGlassPrimitive = new Cesium.Primitive({
                geometryInstances: new Cesium.GeometryInstance({
                    geometry: new Cesium.RectangleGeometry({
                        rectangle: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90),
                        vertexFormat: Cesium.VertexFormat.POSITION_AND_ST
                    })
                }),
                appearance: new Cesium.MaterialAppearance({
                    material: new Cesium.Material({
                        fabric: {
                            type: 'LiquidGlass',
                            uniforms: {
                                u_mouse: new Cesium.Cartesian2(0, 0),
                                u_time: 0,
                                u_resolution: new Cesium.Cartesian2(window.innerWidth, window.innerHeight)
                            },
                            source: `
                            uniform float u_time;
czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material = czm_getDefaultMaterial(materialInput);
    material.diffuse = vec3(abs(sin(u_time)), 1.0, abs(cos(u_time)));
    material.alpha = 0.9;
    return material;
}
                        `
                        }
                    }),
                    translucent: true
                })
            });

            primitiveRef.current = liquidGlassPrimitive;
            sceneRef.current.primitives.add(liquidGlassPrimitive);
            const canvas = viewer.current.canvas;
            const handler = new Cesium.ScreenSpaceEventHandler(canvas);
            handler.setInputAction((movement) => {
                const cartesian = movement.endPosition;
                if (cartesian) {
                    const x = cartesian.x / canvas.clientWidth;
                    const y = 1.0 - cartesian.y / canvas.clientHeight;
                    liquidGlassPrimitive.appearance.material.uniforms.u_mouse = new Cesium.Cartesian2(x, y);
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

            // Time update loop
            const startTime = Cesium.JulianDate.now().secondsOfDay;

            sceneRef.current.postRender.addEventListener(() => {
                const currentTime = Cesium.JulianDate.now().secondsOfDay;
                liquidGlassPrimitive.appearance.material.uniforms.u_time = currentTime - startTime;
            });

            // Handle window resize
            const resizeHandler = () => {
                liquidGlassPrimitive.appearance.material.uniforms.u_resolution = new Cesium.Cartesian2(
                    window.innerWidth,
                    window.innerHeight
                );
            };

            window.addEventListener('resize', resizeHandler);

            // Cleanup
            return () => {
                window.removeEventListener('resize', resizeHandler);
            };
        }
    }, [viewer])

    return (
        <div className="h-full w-full">
            <div ref={cesiumContainerRef} className="h-full w-full" />
        </div>
    )
}