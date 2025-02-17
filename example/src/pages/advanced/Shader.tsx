import { useCesium } from 'cesium-hooks'
import { useEffect } from 'react'
import * as Cesium from 'cesium'
import { MapContext } from '@/context/MapProvider'
import { useContext } from 'react'

export default function ShaderMap() {
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
            requestIdleCallback(async () => {
                // 创建自定义着色器
                const customShader = new Cesium.CustomShader({
                    uniforms: {
                        u_time: {
                            value: 0,
                            type: Cesium.UniformType.FLOAT,
                        },
                        u_resolution: {
                            value: new Cesium.Cartesian2(window.innerWidth, window.innerHeight),
                            type: Cesium.UniformType.VEC2,
                        },
                    },
                    varyings: {
                        v_uv: Cesium.VaryingType.VEC2,
                    },
                    mode: Cesium.CustomShaderMode.MODIFY_MATERIAL,
                    lightingModel: Cesium.LightingModel.PBR,
                    translucencyMode: Cesium.CustomShaderTranslucencyMode.TRANSLUCENT,
                    vertexShaderText: `
          void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {
            v_uv = (vsInput.attributes.positionMC.xy + 1.0) / 2.0;
          }
        `,
                    fragmentShaderText: `
          #define PI 3.14159265359

          // 网格平铺
          vec2 tile(vec2 st, float zoom) {
              st *= zoom;
              return fract(st);
          }

          // 棱形图案生成
          float diamondPattern(vec2 st) {
              st = abs(st - 0.5);
              return step(st.x + st.y, 0.5);
          }

          void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
              vec2 st = v_uv;
              st.x *= u_resolution.x / u_resolution.y;

              float zoom = 1.0;
              st = tile(st, zoom);

              float pattern = diamondPattern(st);
              float checker = mod(floor(gl_FragCoord.x / (u_resolution.x / zoom)) +
                  floor(gl_FragCoord.y / (u_resolution.y / zoom)), 2.0);
              vec3 color = mix(vec3(abs(cos(u_time))), vec3(abs(sin(u_time))), abs(1.0 - pattern));

              material.diffuse = color;
              material.alpha = 1.0;
          }
        `,
                });

                // 更新uniform值
                function updateShaderUniforms() {
                    const currentTime = performance.now() * 0.001;
                    customShader.setUniform("u_time", currentTime);
                    customShader.setUniform(
                        "u_resolution",
                        new Cesium.Cartesian2(window.innerWidth, window.innerHeight)
                    );
                }

                // 在渲染循环中更新uniform值
                viewer.current.scene.preRender.addEventListener(updateShaderUniforms);

                const translation = new Cesium.Cartesian3(
                    -1571952.1361662298,
                    4395241.97876768,
                    4331949.3142119665
                );
                const cartographic = Cesium.Cartographic.fromCartesian(translation);
                const longitude = Cesium.Math.toDegrees(cartographic.longitude);
                const latitude = Cesium.Math.toDegrees(cartographic.latitude);
                const height = cartographic.height;

                const entity = (viewer.current.trackedEntity = viewer.current.entities.add({
                    name: "animate",
                    position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
                    model: {
                        uri: `${import.meta.env.BASE_URL}/assets/Cesium_Man.glb`,
                        scale: 100,
                        customShader: customShader,
                    },
                }));
                viewer.current.trackedEntity = entity;
            });
        }
    }, [viewer])

    return (
        <div className="h-full w-full">
            <div ref={cesiumContainerRef} className="h-full w-full" />
        </div>
    )
} 