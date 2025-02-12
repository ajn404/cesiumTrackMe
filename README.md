# Cesium Track Me

> A template or useful Cesium components

[中文文档链接](./assets/zh-readme.md)

![cesium](./assets/ai_cesium.png)

A Cesium + React toolkit project based on monorepo architecture.

## Tech Stack

- Package Manager: pnpm + workspace
- Build Tool: Vite
- Framework: React 18
- Map Engine: CesiumJS
- UI Components: shadcn/ui
- Styling: TailwindCSS
- Routing: React Router v6
- Type Checking: TypeScript

## Project Structure

```bash
.
├── packages/
│   └── cesium-hooks/          # Cesium React Hooks Library
│       ├── src/
│       │   ├── hooks/         # Various Hooks Implementations
│       │   └── index.ts       # Entry File
│       ├── package.json
│       └── README.md
│
├── example/                   # Example Application
│   ├── src/
│   │   ├── components/       # Common Components
│   │   ├── pages/           # Page Components
│   │   ├── hooks/           # Custom Hooks
│   │   └── lib/             # Utility Functions
│   ├── package.json
│   └── vite.config.ts
│
├── pnpm-workspace.yaml       # Workspace Configuration
└── package.json
```

## Core Features

1. cesium-hooks Package
   - useCesium: Map Initialization
   - useCamera: Camera Control
   - useTracking: Trajectory Tracking

2. Example Application
   - Basic Map Display
   - Trajectory Tracking
   - Terrain Loading
   - Layer Control
   - Map Controls
   - Vector Drawing

## Development

```bash
# Install Dependencies
pnpm install

# Develop Example Application
pnpm dev

# Build Hooks Library
pnpm build
```

## Automated Deployment

- GitHub Actions for Automatic Deployment of Example Application to GitHub Pages
- Automatic npm Package Publishing on New Version Release

## Online Demo

Visit [Online Example](https://ajn404.github.io/cesiumTrackMe/) to view the feature demo.

## Notes

> Cursor wrote this Cesium toolkit in half a day
> Cursor does it in half day

## License

MIT