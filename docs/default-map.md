# 默认地图使用指南

## 目录

## 功能概述

默认地图展示了基本的 Cesium 地图功能，包括：

- 全球地形
- 基础影像图层
- 基本地图控件

## 使用说明


```tsx
import { useCesium } from 'cesium-hooks'
function DefaultMap() {
  const { cesiumContainerRef } = useCesium(import.meta.env.VITE_ION_TOKEN)
  return (
    <div className="h-full w-full">
      <div ref={cesiumContainerRef} className="h-full w-full" />
    </div>
  )
}
```


## 注意事项

- 需要有效的 Cesium Ion Token
- 首次加载可能需要等待资源下载


## 更多api

```tsx
import { useCesium } from 'cesium-hooks'

function AdvancedMap() {
  const { cesiumContainerRef } = useCesium(import.meta.env.VITE_ION_TOKEN, {
    // 基础配置
    baseLayerPicker: true,
    timeline: true,
    animation: true,
    
    // 性能优化
    requestRenderMode: true,
    maximumRenderTimeChange: 1000,
    targetFrameRate: 60,
    
    // 视觉效果
    skyBox: true,
    skyAtmosphere: true,
    shadows: true,
    
    // 相机设置
    defaultCamera: {
      longitude: 116.397,
      latitude: 39.908,
      height: 1000000,
      heading: 0,
      pitch: -90,
      roll: 0
    }
  })

  return (
    <div className="h-full w-full">
      <div ref={cesiumContainerRef} className="h-full w-full" />
    </div>
  )
}
```

### 配置选项详解

#### 基础配置
- `terrainProvider`: 自定义地形提供器
- `imageryProvider`: 自定义影像提供器
- `baseLayerPicker`: 是否显示基础图层选择器
- `timeline`: 是否显示时间轴
- `animation`: 是否显示动画控件

#### 性能优化
- `requestRenderMode`: 启用按需渲染模式
- `maximumRenderTimeChange`: 最大渲染时间变化
- `targetFrameRate`: 目标帧率

#### 视觉效果
- `skyBox`: 是否显示天空盒
- `skyAtmosphere`: 是否显示大气效果
- `shadows`: 是否启用阴影
- `terrainShadows`: 地形阴影设置

#### 相机控制
- `defaultCamera`: 设置默认相机位置
  - `longitude`: 经度
  - `latitude`: 纬度
  - `height`: 高度
  - `heading`: 朝向角度
  - `pitch`: 俯仰角度
  - `roll`: 翻滚角度

### 注意事项

1. 性能优化选项需要根据具体硬件配置进行调整
2. 视觉效果选项可能会影响渲染性能
3. 自定义地形和影像提供器需要确保数据源可用
4. 相机位置设置时注意单位（经度/纬度使用度，高度使用米）