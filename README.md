# Cesium Track Me

> a template or an  useful cesium components

![cesium](./assets/ai_cesium.png)

基于 Cesium + React 的cesium toolkit项目，采用 monorepo 架构。

## 技术栈

- 包管理：pnpm + workspace
- 构建工具：Vite
- 框架：React 18
- 地图引擎：CesiumJS
- UI 组件：shadcn/ui
- 样式：TailwindCSS
- 路由：React Router v6
- 类型检查：TypeScript

## 项目结构

```bash
.
├── packages/
│   └── cesium-hooks/          # Cesium React Hooks 库
│       ├── src/
│       │   ├── hooks/         # 各种 Hooks 实现
│       │   └── index.ts       # 入口文件
│       ├── package.json
│       └── README.md
│
├── example/                   # 示例应用
│   ├── src/
│   │   ├── components/       # 通用组件
│   │   ├── pages/           # 页面组件
│   │   ├── hooks/           # 自定义 Hooks
│   │   └── lib/             # 工具函数
│   ├── package.json
│   └── vite.config.ts
│
├── pnpm-workspace.yaml       # 工作空间配置
└── package.json
```

## 核心功能

1. cesium-hooks 包
   - useCesium: 地图初始化
   - useCamera: 相机控制
   - useTracking: 轨迹追踪

2. 示例应用
   - 基础地图展示
   - 轨迹追踪
   - 地形加载
   - 图层控制
   - 地图控件
   - 矢量标绘

## 开发

```bash
# 安装依赖
pnpm install

# 开发示例应用
pnpm dev

# 构建 hooks 库
pnpm build
```

## 自动化部署

- GitHub Actions 自动部署示例应用到 GitHub Pages
- 发布新版本时自动发布 npm 包

## 在线演示

访问 [在线示例](https://ajn404.github.io/cesium/) 查看功能演示。

## 备注

> cursor用了半天写的cesium toolkit
> cursor does it in half day

## License

MIT