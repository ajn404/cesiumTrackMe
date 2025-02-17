import { useEffect, useRef, type RefObject, type MutableRefObject } from "react";
import {
    Viewer,
    Ion,
    TerrainProvider,
    ImageryProvider,
    Scene,
    Globe,
    Camera,
    Cartesian3,
    Math,
    SkyBox,
    SkyAtmosphere,
    SceneMode
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { useTianDiTu } from "./useTianDiTu";

export interface CesiumViewerOptions {
    // 基础配置
    terrainProvider?: TerrainProvider;
    imageryProvider?: ImageryProvider;
    baseLayerPicker?: boolean;
    timeline?: boolean;
    animation?: boolean;
    fullscreenButton?: boolean;
    vrButton?: boolean;
    geocoder?: boolean;
    homeButton?: boolean;
    infoBox?: boolean;
    sceneModePicker?: boolean;
    selectionIndicator?: boolean;
    navigationHelpButton?: boolean;
    navigationInstructionsInitiallyVisible?: boolean;
    scene3DOnly?: boolean;
    shouldAnimate?: boolean;
    clockViewModel?: any;
    selectedImageryProviderViewModel?: any;
    selectedTerrainProviderViewModel?: any;
    imageryProviderViewModels?: any[];
    terrainProviderViewModels?: any[];

    // 性能相关
    requestRenderMode?: boolean;
    maximumRenderTimeChange?: number;
    targetFrameRate?: number;

    // 视觉效果
    skyBox?: boolean;
    skyAtmosphere?: boolean;
    globe?: Globe;
    orderIndependentTranslucency?: boolean;
    shadows?: boolean;
    terrainShadows?: number;
    mapProjection?: any;

    // 自定义配置
    hideCredit?: boolean;
    enableDrag?: boolean;
    defaultCamera?: {
        longitude: number;
        latitude: number;
        height: number;
        heading?: number;
        pitch?: number;
        roll?: number;
    };
    tianDiTu?: {
        enabled: boolean;
        token: string;
    };
    sceneMode?: SceneMode; // 新增的 sceneMode 配置选项
}

export interface UseCesiumReturn {
    cesiumContainerRef: RefObject<HTMLDivElement>;
    viewer: MutableRefObject<Viewer | undefined>;
    scene: MutableRefObject<Scene | undefined>;
    camera: MutableRefObject<Camera | undefined>;
    isReady: MutableRefObject<boolean>;
}

/**
 * 自定义 Hook，用于初始化 Cesium 和管理生命周期
 */
export function useCesium(
    token: string,
    options: CesiumViewerOptions = {}
): UseCesiumReturn {
    const cesiumContainerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<Viewer>();
    const sceneRef = useRef<Scene>();
    const cameraRef = useRef<Camera>();
    const isReadyRef = useRef(false);

    // 设置 Cesium 的默认访问令牌
    Ion.defaultAccessToken = token;

    useEffect(() => {
        if (cesiumContainerRef.current && !viewerRef.current) {
            // 默认配置
            const defaultOptions = {
                terrainProvider: undefined,
                baseLayerPicker: false,
                timeline: false,
                animation: false,
                fullscreenButton: false,
                vrButton: false,
                geocoder: false,
                homeButton: false,
                infoBox: false,
                sceneModePicker: false,
                selectionIndicator: false,
                navigationHelpButton: false,
                requestRenderMode: true,
                maximumRenderTimeChange: 1000,
                sceneMode: SceneMode.SCENE3D // 默认场景模式
            };

            // 合并配置
            const viewer = new Viewer(cesiumContainerRef.current, {
                ...defaultOptions,
                ...options,
                skyBox: options.skyBox ? new SkyBox({}) : false,
                skyAtmosphere: options.skyAtmosphere ? new SkyAtmosphere() : false,
            });

            // 隐藏版权信息
            if (options.hideCredit) {
                (viewer.cesiumWidget.creditContainer as HTMLElement).style.display = "none";
            }

            // 设置默认相机位置
            if (options.defaultCamera) {
                const { longitude, latitude, height, heading = 0, pitch = -90, roll = 0 } = options.defaultCamera;
                viewer.camera.setView({
                    destination: Cartesian3.fromDegrees(longitude, latitude, height),
                    orientation: {
                        heading: Math.toRadians(heading),
                        pitch: Math.toRadians(pitch),
                        roll: Math.toRadians(roll)
                    }
                });
            }

            // 启用/禁用拖拽
            if (options.enableDrag === false) {
                viewer.scene.screenSpaceCameraController.enableRotate = false;
                viewer.scene.screenSpaceCameraController.enableTranslate = false;
                viewer.scene.screenSpaceCameraController.enableZoom = false;
                viewer.scene.screenSpaceCameraController.enableTilt = false;
                viewer.scene.screenSpaceCameraController.enableLook = false;
            }

            // 保存 viewer 实例
            viewerRef.current = viewer;
            sceneRef.current = viewer.scene;
            cameraRef.current = viewer.camera;
            isReadyRef.current = true;

            // 清理：在组件卸载时销毁 Viewer 实例
            return () => {
                if (viewerRef.current) {
                    viewerRef.current.destroy();
                    viewerRef.current = undefined;
                    sceneRef.current = undefined;
                    cameraRef.current = undefined;
                    isReadyRef.current = false;
                }
            };
        }
    }, []); // 依赖项为空数组，确保只初始化一次

    useTianDiTu(viewerRef, {
        apiKey: (options.tianDiTu && options.tianDiTu.enabled) ? options.tianDiTu.token : 'none',
        layers: {
            image: true,
            imageAnnotation: true
        }
    });

    return {
        cesiumContainerRef,
        viewer: viewerRef,
        scene: sceneRef,
        camera: cameraRef,
        isReady: isReadyRef
    };
}
