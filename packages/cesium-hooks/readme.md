# Cesium Hooks

一个用于 Cesium + React 应用的 Hooks 库。

## 安装

```bash
npm install cesium-hooks
```
或
```bash
pnpm add cesium-hooks
```
或
```bash
yarn add cesium-hooks
```



## 使用

### useCesium

基础地图初始化 Hook：


```tsx
import { useCesium } from 'cesium-hooks'
function App() {
const { cesiumContainerRef, viewer } = useCesium('YOUR_CESIUM_ION_TOKEN')
return (
<div ref={cesiumContainerRef} style={{ width: '100%', height: '100%' }} />
)
}
```


## API 文档

### useCesium

初始化 Cesium 地图的基础 Hook。

#### 参数

- `token: string` - Cesium Ion 访问令牌

#### 返回值

- `cesiumContainerRef: RefObject<HTMLDivElement>` - 地图容器的 ref
- `viewer: MutableRefObject<Viewer | undefined>` - Cesium Viewer 实例

## 示例

访问 [在线示例](https://ajn404.github.io/cesium/) 查看更多用法。

## License

MIT