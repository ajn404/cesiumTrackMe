import { Viewer, WebMapTileServiceImageryProvider, Math, Cartesian3, ImageryLayer } from 'cesium';
import { MutableRefObject, useEffect, useRef } from "react";

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
    layers?: {
        vector?: boolean;
        vectorAnnotation?: boolean;
        image?: boolean;
        imageAnnotation?: boolean;
        terrain?: boolean;
    };
}

export function useTianDiTu(viewer: MutableRefObject<Viewer | undefined>, options: TianDiTuOptions) {
    const layersRef = useRef<ImageryLayer[]>([]);

    useEffect(() => {

        if (!viewer.current || !options?.apiKey) {
            console.warn('Viewer or API key is not provided');
            return;
        }

        if (options?.apiKey === 'none') {
            return;
        }

        const createLayer = (type: string) => {
            return new WebMapTileServiceImageryProvider({
                url: `https://{s}.tianditu.gov.cn/${type}_w/wmts?tk=${options.apiKey}`,
                layer: type,
                style: "default",
                format: "tiles",
                tileMatrixSetID: 'w',
                subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
                minimumLevel: options.minLevel || 0,
                maximumLevel: options.maxLevel || 18,
                credit: 'Tianditu'
            });
        };

        try {
            layersRef.current.forEach(layer => {
                viewer.current?.imageryLayers.remove(layer, true);
            });
            layersRef.current = [];

            const { layers = {} } = options;
            if (layers.vector) {
                const vecLayer = viewer.current.imageryLayers.addImageryProvider(createLayer('vec'));
                layersRef.current.push(vecLayer);
            }
            if (layers.vectorAnnotation) {
                const cvaLayer = viewer.current.imageryLayers.addImageryProvider(createLayer('cva'));
                layersRef.current.push(cvaLayer);
            }
            if (layers.image) {
                const imgLayer = viewer.current.imageryLayers.addImageryProvider(createLayer('img'));
                layersRef.current.push(imgLayer);
            }
            if (layers.imageAnnotation) {
                const ciaLayer = viewer.current.imageryLayers.addImageryProvider(createLayer('cia'));
                layersRef.current.push(ciaLayer);
            }
            if (layers.terrain) {
                const terLayer = viewer.current.imageryLayers.addImageryProvider(createLayer('ter'));
                layersRef.current.push(terLayer);
            }

            if (options.initialPosition) {
                viewer.current.camera.setView({
                    destination: Cartesian3.fromDegrees(
                        options.initialPosition.longitude,
                        options.initialPosition.latitude,
                        options.initialPosition.height
                    ),
                    orientation: {
                        heading: Math.toRadians(options.initialOrientation?.heading || 0),
                        pitch: Math.toRadians(options.initialOrientation?.pitch || -90),
                        roll: options.initialOrientation?.roll || 0.0
                    }
                });
            }

        } catch (error) {
            console.error('Failed to initialize TianDiTu:', error);
        }

        return () => {
            layersRef.current.forEach(layer => {
                viewer.current?.imageryLayers.remove(layer, true);
            });
        };
    }, [viewer, options?.apiKey, JSON.stringify(options?.layers)]);
}