# 进阶功能使用指南

## 目录

## 轨迹追踪

### 功能概述
****
轨迹追踪展示了如何在 Cesium 中实现物体的轨迹追踪功能，包括：

- 轨迹点生成
- 轨迹播放控制
- 轨迹点位置显示

### 使用说明

```tsx
import { useCesium } from 'cesium-hooks'
import { useTracking } from 'cesium-hooks'
import { useMemo } from 'react'
import { Color } from 'cesium'
import { MODELS } from '@/constants/models';
import { generateTrajectory } from '@/constants/utils';

export const Tracking = function Tracking() {
  const { cesiumContainerRef, viewer } = useCesium(import.meta.env.VITE_ION_TOKEN, {
    targetFrameRate: 30,
  })

  const trajectoryPoints = useMemo(() => {
    return generateTrajectory(116.5389, 39.8209)
  }, [])

  const { isPlaying, currentPosition, controls } = useTracking(viewer, {
    trajectoryPoints,
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
```

### 注意事项

- 需要有效的 Cesium Ion Token
- 轨迹点生成函数 generateTrajectory 需要根据实际需求进行调整

## 地形渲染

### 功能概述

地形渲染展示了如何在 Cesium 中加载和显示全球地形数据，包括：

- 全球地形加载
- 地形夸张设置

### 使用说明

```tsx
import { useEffect, useState } from 'react'
import { useCesium } from 'cesium-hooks'
import { createWorldTerrainAsync } from 'cesium'

export function TerrainMap() {
  const [terrainProvider, setTerrainProvider] = useState(null)

  useEffect(() => {
    const fetchTerrainProvider = async () => {
      const terrain = await createWorldTerrainAsync({
        requestWaterMask: true,
        requestVertexNormals: true,
      })
      setTerrainProvider(terrain)
    }

    fetchTerrainProvider()
  }, [])

  const { cesiumContainerRef } = useCesium(import.meta.env.VITE_ION_TOKEN, {
    defaultCamera: {
      longitude: 116.3974,
      latitude: 40.9093,
      height: 3000,
      heading: 45,
      pitch: -45,
      roll: 0
    },
    terrainProvider,
  })

  return (
    <div className="h-full w-full">
      <div ref={cesiumContainerRef} className="h-full w-full" />
    </div>
  )
}
```

## 自定义着色器

### 功能概述

自定义着色器展示了如何在 Cesium 中应用自定义着色器，包括：

- 自定义着色器的创建
- 着色器参数的更新

### 使用说明

```tsx
import { useCesium } from 'cesium-hooks'
import { useEffect } from 'react'
import * as Cesium from 'cesium'

export function ShaderMap() {
    const { cesiumContainerRef, viewer } = useCesium(import.meta.env.VITE_ION_TOKEN, {
        hideCredit: true
    })

    useEffect(() => {
        if (viewer.current) {
            requestIdleCallback(async () => {
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

          vec2 tile(vec2 st, float zoom) {
              st *= zoom;
              return fract(st);
          }

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

                function updateShaderUniforms() {
                    const currentTime = performance.now() * 0.001;
                    customShader.setUniform("u_time", currentTime);
                    customShader.setUniform(
                        "u_resolution",
                        new Cesium.Cartesian2(window.innerWidth, window.innerHeight)
                    );
                }

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
```