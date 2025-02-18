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

## 更多 API

```tsx
import { useCesium } from 'cesium-hooks'

function AdvancedMap() {
  const { cesiumContainerRef } = useCesium(import.meta.env.VITE_ION_TOKEN, {
    // 基础配置
    baseLayerPicker: true,
    timeline: true,
    animation: true,
    fullscreenButton: true,
    vrButton: true,
    geocoder: true,
    homeButton: true,
    infoBox: true,
    sceneModePicker: true,
    selectionIndicator: true,
    navigationHelpButton: true,
    navigationInstructionsInitiallyVisible: true,
    scene3DOnly: false,
    shouldAnimate: true,
    clockViewModel: undefined,
    selectedImageryProviderViewModel: undefined,
    selectedTerrainProviderViewModel: undefined,
    imageryProviderViewModels: [],
    terrainProviderViewModels: [],

    // 性能优化
    requestRenderMode: true,
    maximumRenderTimeChange: 1000,
    targetFrameRate: 60,
    useDefaultRenderLoop: true,

    // 视觉效果
    skyBox: true,
    skyAtmosphere: true,
    globe: undefined,
    orderIndependentTranslucency: true,
    shadows: true,
    terrainShadows: 1,
    mapProjection: undefined,

    // 自定义配置
    hideCredit: true,
    enableDrag: true,
    defaultCamera: {
      longitude: 116.397,
      latitude: 39.908,
      height: 1000000,
      heading: 0,
      pitch: -90,
      roll: 0
    },
    tianDiTu: {
      enabled: true,
      token: import.meta.env.VITE_TIANDITU_TOKEN
    },
    sceneMode: Cesium.SceneMode.SCENE3D
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
- `fullscreenButton`: 是否显示全屏按钮
- `vrButton`: 是否显示 VR 按钮
- `geocoder`: 是否显示地理编码器
- `homeButton`: 是否显示主页按钮
- `infoBox`: 是否显示信息框
- `sceneModePicker`: 是否显示场景模式选择器
- `selectionIndicator`: 是否显示选择指示器
- `navigationHelpButton`: 是否显示导航帮助按钮
- `navigationInstructionsInitiallyVisible`: 导航说明是否初始可见
- `scene3DOnly`: 是否仅使用 3D 场景模式
- `shouldAnimate`: 是否启用动画
- `clockViewModel`: 自定义时钟视图模型
- `selectedImageryProviderViewModel`: 选择的影像提供器视图模型
- `selectedTerrainProviderViewModel`: 选择的地形提供器视图模型
- `imageryProviderViewModels`: 影像提供器视图模型数组
- `terrainProviderViewModels`: 地形提供器视图模型数组

#### 性能优化
- `requestRenderMode`: 启用按需渲染模式
- `maximumRenderTimeChange`: 最大渲染时间变化
- `targetFrameRate`: 目标帧率
- `useDefaultRenderLoop`: 是否使用默认渲染循环

#### 视觉效果
- `skyBox`: 是否显示天空盒
- `skyAtmosphere`: 是否显示大气效果
- `globe`: 自定义地球对象
- `orderIndependentTranslucency`: 是否启用顺序无关的透明度
- `shadows`: 是否启用阴影
- `terrainShadows`: 地形阴影设置
- `mapProjection`: 自定义地图投影

#### 自定义配置
- `hideCredit`: 是否隐藏版权信息
- `enableDrag`: 是否启用拖拽
- `defaultCamera`: 设置默认相机位置
  - `longitude`: 经度
  - `latitude`: 纬度
  - `height`: 高度
  - `heading`: 朝向角度
  - `pitch`: 俯仰角度
  - `roll`: 翻滚角度
- `tianDiTu`: 天地图配置
  - `enabled`: 是否启用天地图
  - `token`: 天地图访问令牌
- `sceneMode`: 场景模式（2D、3D、哥伦布视图）

## 注意事项

1. 性能优化选项需要根据具体硬件配置进行调整
2. 视觉效果选项可能会影响渲染性能
3. 自定义地形和影像提供器需要确保数据源可用
4. 相机位置设置时注意单位（经度/纬度使用度，高度使用米）

## 使用案例

### 隐藏版权信息

```tsx
const { cesiumContainerRef, viewer } = useCesium(import.meta.env.VITE_ION_TOKEN, {
      hideCredit:true
})
```