export const MODELS = {
  CESIUM_MAN: {
    url: 'https://ajn404.github.io/assets/models/gltf/Cesium_Man.glb',
    name: 'Cesium Man',
    type: 'glb'
  }
} as const

// 可以继续添加其他3D模型资源
export type ModelKey = keyof typeof MODELS 