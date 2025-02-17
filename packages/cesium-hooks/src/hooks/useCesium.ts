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
    SkyAtmosphere
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { useTianDiTu } from "./useTianDiTu";

export interface CesiumViewerOptions {
    // 基础配置
    /**
     * 地形提供器
     */
    terrainProvider?: TerrainProvider
    /**
     * 影像提供器
     */
    imageryProvider?: ImageryProvider
    /**
     * 是否显示基础图层选择器
     */
    baseLayerPicker?: boolean
    /**
     * 是否显示时间轴
     */
    timeline?: boolean
    /**
     * 是否显示动画控件
     */
    animation?: boolean
    /**
     * 是否显示全屏按钮
     */
    fullscreenButton?: boolean
    /**
     * 是否显示VR按钮
     */
    vrButton?: boolean
    /**
     * 是否显示地理编码器
     */
    geocoder?: boolean
    /**
     * 是否显示返回初始位置按钮
     */
    homeButton?: boolean
    /**
     * 是否显示信息框
     */
    infoBox?: boolean
    /**
     * 是否显示场景模式选择器
     */
    sceneModePicker?: boolean
    /**
     * 是否显示选择指示器
     */
    selectionIndicator?: boolean
    /**
     * 是否显示导航帮助按钮
     */
    navigationHelpButton?: boolean
    /**
     * 导航说明是否默认可见
     */
    navigationInstructionsInitiallyVisible?: boolean
    /**
     * 是否仅使用3D场景
     */
    scene3DOnly?: boolean
    /**
     * 是否自动播放动画
     */
    shouldAnimate?: boolean
    /**
     * 时钟视图模型
     */
    clockViewModel?: any
    /**
     * 当前选择的影像提供器视图模型
     */
    selectedImageryProviderViewModel?: any
    /**
     * 当前选择的地形提供器视图模型
     */
    selectedTerrainProviderViewModel?: any
    /**
     * 所有可用的影像提供器视图模型
     */
    imageryProviderViewModels?: any[]
    /**
     * 所有可用的地形提供器视图模型
     */
    terrainProviderViewModels?: any[]

    // 性能相关
    /**
     * 是否启用按需渲染模式
     */
    requestRenderMode?: boolean
    /**
     * 最大渲染时间变化
     */
    maximumRenderTimeChange?: number
    /**
     * 目标帧率
     */
    targetFrameRate?: number

    // 视觉效果
    /**
     * 是否显示天空盒
     */
    skyBox?: boolean
    /**
     * 是否显示大气效果
     */
    skyAtmosphere?: boolean
    /**
     * 地球实例
     */
    globe?: Globe
    /**
     * 是否启用顺序无关透明
     */
    orderIndependentTranslucency?: boolean
    /**
     * 是否启用阴影
     */
    shadows?: boolean
    /**
     * 地形阴影设置
     */
    terrainShadows?: number
    /**
     * 地图投影方式
     */
    mapProjection?: any

    // 自定义配置
    /**
     * 是否隐藏版权信息
     */
    hideCredit?: boolean
    /**
     * 是否启用拖拽
     */
    enableDrag?: boolean
    /**
     * 默认相机位置
     */
    defaultCamera?: {
        /**
         * 经度
         */
        longitude: number
        /**
         * 纬度
         */
        latitude: number
        /**
         * 高度
         */
        height: number
        /**
         * 朝向角度
         */
        heading?: number
        /**
         * 俯仰角度
         */
        pitch?: number
        /**
         * 翻滚角度
         */
        roll?: number
    }
    /**
     * 是否启用天地图
     */
    tianDiTu?: {
        enabled: boolean,
        token: string,
    }
}

export interface UseCesiumReturn {
    cesiumContainerRef: RefObject<HTMLDivElement>
    viewer: MutableRefObject<Viewer | undefined>
    scene: MutableRefObject<Scene | undefined>
    camera: MutableRefObject<Camera | undefined>
    isReady: MutableRefObject<boolean>
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
                maximumRenderTimeChange: 1000
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
        apiKey: (options.tianDiTu && options.tianDiTu.enabled)?options.tianDiTu.token:'none',
        layers: {
            image: true,
            imageAnnotation:true
        }
    })

    return {
        cesiumContainerRef,
        viewer: viewerRef,
        scene: sceneRef,
        camera: cameraRef,
        isReady: isReadyRef
    };
}
