export const Beijing = {
    longitude: 116.405285,
    latitude: 39.904989,
    height: 1000
} as const;

export const Shanghai = {
    longitude: 121.472644,
    latitude: 31.231706,
    height: 1000
} as const;

export type PositionKey = keyof typeof Beijing;