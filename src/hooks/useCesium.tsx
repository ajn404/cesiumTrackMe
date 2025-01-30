import { useEffect, useRef } from "react";
import { Viewer, Ion } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

interface UseCesiumReturn {
    cesiumContainerRef: React.RefObject<HTMLDivElement>;
    viewer: React.MutableRefObject<Viewer | undefined>;
}

// 自定义 Hook，用于初始化 Cesium 和管理生命周期
export const useCesium = (): UseCesiumReturn => {
    const cesiumContainerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<Viewer>();


    // 设置 Cesium 的默认访问令牌
    Ion.defaultAccessToken = import.meta.env.VITE_ION_TOKEN;

    useEffect(() => {
        if (cesiumContainerRef.current && !viewerRef.current) {

            // 初始化 Cesium Viewer
            const cesiumViewer = new Viewer(cesiumContainerRef.current, {
                terrainProvider: undefined, // 不使用地形提供者
                baseLayerPicker: false, // 禁用基础图层选择器
                geocoder: false, // 禁用地理编码器
                homeButton: false, // 禁用主页按钮
                sceneModePicker: false, // 禁用场景模式选择器
                navigationHelpButton: false, // 禁用导航帮助按钮
                animation: false, // 禁用动画控件
                timeline: false, // 禁用时间轴
                fullscreenButton: false, // 禁用全屏按钮
            });

            // 移除 Cesium 的版权信息
            //@ts-ignore
            cesiumViewer._cesiumWidget._creditContainer.style.display = "none";

            // 使 canvas 元素在点击时获得焦点
            cesiumViewer.canvas.onclick = () => cesiumViewer.canvas.focus();

            // 停止滚轮事件的传播
            const handleWheel = (event: WheelEvent) => event.stopPropagation();
            cesiumContainerRef.current.addEventListener("wheel", handleWheel);

            // 保存 viewer 实例
            viewerRef.current = cesiumViewer;

            // 清理：在组件卸载时销毁 Viewer 实例
            return () => {
            };
        }
    }, []); // 依赖项为空数组，确保只初始化一次

    return { cesiumContainerRef, viewer: viewerRef };
};
