# Cesium Hooks

一个用于 Cesium + React 应用的 Hooks 库，简化 Cesium 在 React 中的集成。

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

## 快速开始

```tsx
import { useCesium } from 'cesium-hooks';

function App() {
  const { cesiumContainerRef, viewer } = useCesium('YOUR_CESIUM_ION_TOKEN');
  
  return (
    <div 
      ref={cesiumContainerRef} 
      style={{ width: '100vw', height: '100vh' }} 
    />
  );
}
```

## API 文档

### useCesium

初始化 Cesium 地图的基础 Hook。

#### 参数

- `token: string` - Cesium Ion 访问令牌（必填）
- `options?: Viewer.ConstructorOptions` - 可选配置项

#### 返回值

- `cesiumContainerRef: RefObject<HTMLDivElement>` - 地图容器的 ref
- `viewer: MutableRefObject<Viewer | undefined>` - Cesium Viewer 实例

## 特性

- 简单易用的 API 设计
- 支持 TypeScript 类型提示
- 自动处理资源清理
- 支持自定义 Viewer 配置

## 示例

访问 [在线示例](https://ajn404.github.io/cesium/) 查看更多用法。

## 贡献

欢迎提交 Issue 和 PR！

## License

MIT