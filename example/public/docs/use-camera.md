# useCamera 使用指南

## 目录

## 功能概述

`useCamera` 是一个用于控制 Cesium 相机操作的 React Hook，提供了以下功能：

- 飞向指定位置
- 缩放控制
- 设置相机视角
- 获取当前相机位置

## 使用说明

### 基本用法

```tsx
import { useCamera, useCesium } from 'cesium-hooks'

function CameraControl() {
  const { cesiumContainerRef, viewer, isReady } = useCesium(import.meta.env.VITE_ION_TOKEN)
  const { flyTo, zoomIn, zoomOut, getCurrentPosition } = useCamera({ viewer: isReady ? viewer : undefined })

  const handleFlyToBeijing = () => {
    flyTo({
      longitude: 116.3974,
      latitude: 39.9093,
      height: 10000
    })
  }

  return (
    <div className="h-full w-full">
      <div ref={cesiumContainerRef} className="h-full w-full" />
      <button onClick={handleFlyToBeijing}>飞往北京</button>
    </div>
  )
}
```

## API 详解

### useCamera 参数

```typescript
interface UseCameraProps {
    viewer?: Viewer;
    duration?: number; // 动画持续时间，默认 2 秒
}
```

### 返回对象

```typescript
{
  flyTo: (position: { longitude: number, latitude: number, height: number }) => void;
  zoomIn: (amount?: number) => void;
  zoomOut: (amount?: number) => void;
  setView: (position: { longitude: number, latitude: number, height: number }, heading?: number, pitch?: number, roll?: number) => void;
  getCurrentPosition: () => { longitude: number, latitude: number, height: number } | null;
}
```

## 使用案例

### 飞往指定位置

```tsx
const { flyTo } = useCamera({ viewer })

flyTo({
  longitude: 116.3974, // 经度
  latitude: 39.9093,   // 纬度
  height: 10000        // 高度（米）
})
```

### 缩放控制

```tsx
const { zoomIn, zoomOut } = useCamera({ viewer })

// 放大 2000 米
zoomIn(2000)

// 缩小 1000 米
zoomOut(1000)
```

### 设置相机视角

```tsx
const { setView } = useCamera({ viewer })

setView(
  { longitude: 116.3974, latitude: 39.9093, height: 10000 }, // 位置
  45,  // 朝向角度（度）
  -45, // 俯仰角度（度）
  0    // 翻滚角度（度）
)
```

### 获取当前相机位置

```tsx
const { getCurrentPosition } = useCamera({ viewer })

const currentPosition = getCurrentPosition()
if (currentPosition) {
  console.log('当前相机位置：', currentPosition)
}
```

## 注意事项

1. 确保 `viewer` 已初始化后再调用 `useCamera` 的方法
2. `duration` 参数控制动画持续时间，单位为秒
3. `zoomIn` 和 `zoomOut` 的 `amount` 参数控制缩放距离，单位为米
4. `setView` 中的角度参数单位为度，会自动转换为弧度
5. `getCurrentPosition` 返回的位置信息中，经度和纬度为度，高度为米

## 性能优化建议

1. 在不需要动画时，可以将 `duration` 设置为 0
2. 频繁调用相机操作时，建议适当增加 `duration` 以避免卡顿
3. 在移动设备上使用时，建议减少动画持续时间 