# `useTianDiTu` 使用文档

## 概述

`useTianDiTu` 是一个 React 自定义 Hook，用于在 Cesium 地图中加载天地图（Tianditu）的瓦片服务。它支持多种图层类型（矢量、影像、注记等），并允许用户自定义初始位置、方向以及图层的显示范围。



## 使用方法

###  调用 `useTianDiTu`

将 `viewerRef` 和配置选项传递给 `useTianDiTu`。

```javascript
const options = {
    apiKey: 'your-tianditu-api-key',
    initialPosition: {
        longitude: 116.397428,
        latitude: 39.90923,
        height: 1000000
    },
    initialOrientation: {
        heading: 0,
        pitch: -90,
        roll: 0
    },
    minLevel: 0,
    maxLevel: 18,
    layers: {
        vector: true,
        vectorAnnotation: true,
        image: false,
        imageAnnotation: false,
        terrain: false
    }
};

useTianDiTu(viewerRef, options);
```

---

## 配置选项

`useTianDiTu` 接受两个参数：

1. **`viewer`** (`MutableRefObject<Viewer | undefined>`):  
   对 Cesium `Viewer` 的引用。

2. **`options`** (`TianDiTuOptions`):  
   天地图的配置选项。

### `TianDiTuOptions` 类型定义

```typescript
interface TianDiTuOptions {
    apiKey: string; // 必填，天地图 API 密钥
    initialPosition?: {
        longitude: number; // 初始经度，默认值：116.397428
        latitude: number;  // 初始纬度，默认值：39.90923
        height: number;    // 初始高度，默认值：1000000
    };
    initialOrientation?: {
        heading: number; // 初始航向角，默认值：0
        pitch: number;   // 初始俯仰角，默认值：-90
        roll: number;    // 初始翻滚角，默认值：0
    };
    minLevel?: number; // 最小缩放级别，默认值：0
    maxLevel?: number; // 最大缩放级别，默认值：18
    layers?: {
        vector?: boolean;         // 是否加载矢量图层，默认值：false
        vectorAnnotation?: boolean; // 是否加载矢量注记图层，默认值：false
        image?: boolean;          // 是否加载影像图层，默认值：false
        imageAnnotation?: boolean; // 是否加载影像注记图层，默认值：false
        terrain?: boolean;        // 是否加载地形图层，默认值：false
    };
}
```

---

## 支持的图层类型

| 图层名称                      | 描述                 | 对应的天地图服务类型 |
| ----------------------------- | -------------------- | -------------------- |
| 矢量图层 (`vector`)           | 基础矢量地图         | `vec`                |
| 矢量注记 (`vectorAnnotation`) | 矢量地图上的注记信息 | `cva`                |
| 影像图层 (`image`)            | 卫星影像             | `img`                |
| 影像注记 (`imageAnnotation`)  | 影像地图上的注记信息 | `cia`                |
| 地形图层 (`terrain`)          | 地形数据             | `ter`                |

---

## 示例代码

以下是一个完整的示例，展示如何在 React 中使用 `useTianDiTu` 加载天地图服务：

```tsx
import { useCesium, useTianDiTu } from 'cesium-hooks'
import { useEffect, useState } from 'react'
import * as Cesium from 'cesium'

export function TianDiTuMap() {
  const [terrainProvider, setTerrainProvider] = useState(null)

  useEffect(() => {
    const fetchTerrainProvider = async () => {
      const terrain = await Cesium.createWorldTerrainAsync({})
      setTerrainProvider(terrain)
    }
    fetchTerrainProvider()
  }, [])

  const { cesiumContainerRef, viewer } = useCesium(import.meta.env.VITE_ION_TOKEN, {
    defaultCamera: {
      longitude: 116.3974,
      latitude: 40.9093,
      height: 3000,
      heading: 45,
      pitch: -45,
      roll: 0
    },
    terrainProvider,
    shouldAnimate: true,
    hideCredit: true,
  })

  // 使用自定义Hook
  useTianDiTu(viewer, {
    apiKey: import.meta.env.VITE_TIANDITU_TOKEN,
    initialPosition: {
      longitude: 116.4074,
      latitude: 39.9042,
      height: 1000000
    },
    initialOrientation: {
      heading: 0,
      pitch: -90,
      roll: 0
    },
    minLevel: 0,
    maxLevel: 18,
    layers: {
      image: true,
      imageAnnotation: true
    }
  });

  return (
    <div className="h-full w-full">
      <div ref={cesiumContainerRef} className="h-full w-full" />
    </div>
  )
} 
```

---

## 注意事项

1. **API 密钥**:  
   天地图服务需要有效的 API 密钥，请确保在 `apiKey` 字段中提供正确的密钥。

2. **CORS 问题**:  
   如果遇到跨域问题，请检查你的服务器是否正确配置了 CORS。

3. **性能优化**:  
   根据实际需求选择加载的图层类型，避免同时加载过多图层导致性能下降。

4. **清理资源**:  
   `useTianDiTu` 在组件卸载时会自动清理所有加载的图层，请确保不要手动重复清理。

---

## 错误处理

如果初始化失败，`useTianDiTu` 会在控制台输出错误日志：

```javascript
console.error('Failed to initialize TianDiTu:', error);
```

请根据错误信息排查问题，常见的错误包括：
- API 密钥无效。
- 网络请求失败。
- 参数配置错误。

---

## 参考资料

- [天地图官方文档](http://lbs.tianditu.gov.cn/)
- [Cesium 官方文档](https://cesium.com/docs/)