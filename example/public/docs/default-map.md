# 默认地图使用指南

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