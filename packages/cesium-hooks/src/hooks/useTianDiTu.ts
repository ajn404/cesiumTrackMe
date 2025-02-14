import { Viewer, WebMapTileServiceImageryProvider, Math, Cartesian3 } from 'cesium';
import { MutableRefObject, useEffect } from "react";

interface TianDiTuOptions {
    apiKey: string;
    initialPosition?: {
        longitude: number;
        latitude: number;
        height: number;
    };
    initialOrientation?: {
        heading: number;
        pitch: number;
        roll: number;
    };
    minLevel?: number;
    maxLevel?: number;
}

export function useTianDiTu(viewer: MutableRefObject<Viewer | undefined>, options: TianDiTuOptions) {
    useEffect(() => {
        if (!viewer.current || !options?.apiKey) {
            console.warn('Viewer or API key is not provided');
            return;
        }

        try {
            // 创建矢量图层
            const tiandituVecProvider = new WebMapTileServiceImageryProvider({
                url: `http://{s}.tianditu.gov.cn/vec_w/wmts?tk=${options.apiKey}`,
                layer: "vec",
                style: "default",
                format: "tiles",
                tileMatrixSetID: 'w',
                subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
                minimumLevel: options.minLevel || 0,
                maximumLevel: options.maxLevel || 18,
                credit: 'Tianditu'
            });

            // 创建注记图层
            const tiandituCvaProvider = new WebMapTileServiceImageryProvider({
                url: `http://{s}.tianditu.gov.cn/cva_w/wmts?tk=${options.apiKey}`,
                layer: "cva",
                style: "default",
                format: "tiles",
                tileMatrixSetID: 'w',
                subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
                minimumLevel: options.minLevel || 0,
                maximumLevel: options.maxLevel || 18,
                credit: 'Tianditu'
            });

            // 添加图层
            viewer.current.imageryLayers.addImageryProvider(tiandituVecProvider);
            viewer.current.imageryLayers.addImageryProvider(tiandituCvaProvider);

            // 设置初始相机位置
            viewer.current.camera.setView({
                destination: Cartesian3.fromDegrees(
                    options.initialPosition?.longitude || 116.4074,
                    options.initialPosition?.latitude || 39.9042,
                    options.initialPosition?.height || 1000000
                ),
                orientation: {
                    heading: Math.toRadians(options.initialOrientation?.heading || 0),
                    pitch: Math.toRadians(options.initialOrientation?.pitch || -90),
                    roll: options.initialOrientation?.roll || 0.0
                }
            });

        } catch (error) {
            console.error('Failed to initialize TianDiTu:', error);
        }

    }, [viewer, options?.apiKey]);
}