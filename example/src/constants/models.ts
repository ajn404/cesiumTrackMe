export const MODELS = {
  CESIUM_MAN: {
    url: `${import.meta.env.BASE_URL}/assets/Cesium_Man.glb`,
    name: 'Cesium Man',
    type: 'glb'
  }
} as const

// 可以继续添加其他3D模型资源
export type ModelKey = keyof typeof MODELS 