import { useCesium } from 'cesium-hooks'
import { MapContext } from '@/context/MapProvider'
import { useContext, useEffect } from 'react'
import * as BABYLON from '@babylonjs/core'
import { ArcRotateCamera, Vector3 } from '@babylonjs/core'

export default function DefaultMap() {
    const { mapProvider } = useContext(MapContext)
    const { cesiumContainerRef, viewer } = useCesium(
        import.meta.env.VITE_ION_TOKEN,
        {
            tianDiTu: {
                enabled: mapProvider === 'Tianditu',
                token: import.meta.env.VITE_TIANDITU_TOKEN
            },
        }
    )

    useEffect(() => {
        if (!viewer.current) return;
        const cesiumViewer = viewer.current;
        const cesiumCanvas = cesiumViewer.canvas;

        const cesiumScene = cesiumViewer.scene;
        const cesiumCamera = cesiumViewer.camera;

        // 初始化 Babylon.js 引擎
        const babylonEngine = new BABYLON.Engine(cesiumCanvas, true);
        const babylonScene = new BABYLON.Scene(babylonEngine);
        babylonScene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

        const babylonCamera = new ArcRotateCamera(
            'BabylonCamera',
            0,
            0,
            10,
            Vector3.Zero(),
            babylonScene
        );

        babylonCamera.attachControl(cesiumCanvas, true);
        babylonScene.activeCamera = babylonCamera;

        cesiumViewer.camera.changed.addEventListener(() => {
            const position = cesiumCamera.positionWC;
            const direction = cesiumCamera.directionWC;
            const up = cesiumCamera.upWC;
            const babylonPosition = new Vector3(position.x, position.y, position.z);
            const babylonDirection = new Vector3(direction.x, direction.y, direction.z);
            const babylonUp = new Vector3(up.x, up.y, up.z);

            babylonCamera.position = babylonPosition;
            babylonCamera.setTarget(babylonPosition.add(babylonDirection));
            babylonCamera.upVector = babylonUp;
        });

        // 创建一个立方体
        const babylonBox = BABYLON.MeshBuilder.CreateBox('box', { size: 1 }, babylonScene);
        babylonBox.position = new BABYLON.Vector3(0, 0, 0);
        babylonBox.rotation = new BABYLON.Vector3(0, 0, 0);
        babylonBox.scaling = new BABYLON.Vector3(1, 1, 1);
        babylonBox.material = new BABYLON.StandardMaterial('box-material', babylonScene);

        // 创建一个光源
        const babylonLight = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), babylonScene);

        // 同步渲染循环
        babylonEngine.runRenderLoop(() => {
            babylonScene.render();
        });

        // 清理函数
        return () => {
            babylonEngine.dispose();
        };
    }, [viewer]);

    return (
        <div className="h-full w-full">
            <div ref={cesiumContainerRef} className="h-full w-full" />
        </div>
    )
}