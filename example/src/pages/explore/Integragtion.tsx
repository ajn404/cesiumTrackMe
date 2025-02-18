import { useCesium } from 'cesium-hooks'
import { MapContext } from '@/context/MapProvider'
import { useContext, useEffect, useRef } from 'react'
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, Color4, FreeCamera } from "@babylonjs/core"
import { Viewer } from 'cesium'
import * as BABYLON from '@babylonjs/core'
import * as Cesium from 'cesium'

const LNG = 121.472644, LAT = 31.231706;

function cart2vec(cart) {
    return new BABYLON.Vector3(cart.x, cart.z, cart.y);
}

const base_point = cart2vec(Cesium.Cartesian3.fromDegrees(LNG, LAT, 50));
const base_point_up = cart2vec(Cesium.Cartesian3.fromDegrees(LNG, LAT, 300));


const changeBabylonCamera = (viewer: Viewer, camera: FreeCamera) => {
    let fov = Cesium.Math.toDegrees((viewer.camera.frustum as Cesium.PerspectiveFrustum).fovy);
    camera.fov = fov / 180 * Math.PI;

    let civm = viewer.camera.inverseViewMatrix;
    let camera_matrix = BABYLON.Matrix.FromValues(
        civm[0], civm[1], civm[2], civm[3],
        civm[4], civm[5], civm[6], civm[7],
        civm[8], civm[9], civm[10], civm[11],
        civm[12], civm[13], civm[14], civm[15]
    );

    let scaling = BABYLON.Vector3.Zero(), rotation = new BABYLON.Quaternion(), transform = BABYLON.Vector3.Zero();
    camera_matrix.decompose(scaling, rotation, transform);
    let camera_pos = cart2vec(transform),
        camera_direction = cart2vec(viewer.camera.direction),
        camera_up = cart2vec(viewer.camera.up);

    let rotation_y = Math.atan(camera_direction.z / camera_direction.x);
    if (camera_direction.x < 0) rotation_y += Math.PI;
    rotation_y = Math.PI / 2 - rotation_y;
    let rotation_x = Math.asin(-camera_direction.y);
    let camera_up_before_rotatez = new BABYLON.Vector3(-Math.cos(rotation_y), 0, Math.sin(rotation_y));
    let rotation_z = Math.acos(camera_up.x * camera_up_before_rotatez.x + camera_up.y * camera_up_before_rotatez.y + camera_up.z * camera_up_before_rotatez.z);
    rotation_z = Math.PI / 2 - rotation_z;
    if (camera_up.y < 0) rotation_z = Math.PI - rotation_z;

    camera.position.x = camera_pos.x - base_point.x;
    camera.position.y = camera_pos.y - base_point.y;
    camera.position.z = camera_pos.z - base_point.z;
    camera.rotation.x = rotation_x;
    camera.rotation.y = rotation_y;
    camera.rotation.z = rotation_z;
}

export default function DefaultMap() {
    const { mapProvider } = useContext(MapContext)
    const { cesiumContainerRef, viewer } = useCesium(
        import.meta.env.VITE_ION_TOKEN,
        {
            timeline: true,
            homeButton: true,
            navigationHelpButton: true,
            tianDiTu: {
                enabled: mapProvider === 'Tianditu',
                token: import.meta.env.VITE_TIANDITU_TOKEN
            },
            useDefaultRenderLoop: false
        }
    )

    const babylonCanvasRef = useRef<HTMLCanvasElement>(null)
    const babylonEngineRef = useRef<Engine | null>(null)
    const isMountedRef = useRef(false)

    useEffect(() => {
        if (!viewer.current || !babylonCanvasRef.current) return;
        const cesiumViewer = viewer.current;
        const cesiumCamera = cesiumViewer.camera;

        cesiumCamera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(LNG, LAT, 300),
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-90.0),
            }
        });
        
        const babylonEngine = new Engine(babylonCanvasRef.current);
        babylonEngineRef.current = babylonEngine;
        const babylonScene = new Scene(babylonEngine);
        babylonScene.clearColor = new Color4(0, 0, 0, 0);
        const babylonCamera = new FreeCamera("camera", new BABYLON.Vector3(0, 0, -10), babylonScene);
        
        // babylonCamera.attachControl(babylonCanvasRef.current,true)


        // 添加光源
        const light = new HemisphericLight("light", new Vector3(0, 1, 0), babylonScene);
        light.intensity = 0.7;

        const root_node = new BABYLON.TransformNode("BaseNode", babylonScene);
        root_node.lookAt(base_point_up.subtract(base_point));
        root_node.addRotation(Math.PI / 2, 0, 0);

        const box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, babylonScene);
        const material = new BABYLON.StandardMaterial("Material", babylonScene);
        material.emissiveColor = new BABYLON.Color3(1, 0, 0);
        material.alpha = 0.5;
        box.material = material;
        box.parent = root_node;

        const ground = BABYLON.MeshBuilder.CreateGround("ground", {
            width: 200,
            height: 200
        }, babylonScene);
        ground.material = material;
        ground.parent = root_node;

        // Create a sphere.
        const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {
            diameter: 200,
        }, babylonScene);
        sphere.position.y = 1; // Lift the sphere slightly above the ground.
        const sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", babylonScene);
        sphereMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red color for the sphere.
        sphere.material = sphereMaterial;

        isMountedRef.current = true;

        const renderLoop = () => {
            if (!isMountedRef.current || cesiumViewer.isDestroyed()) {
                console.log('not ready')
                return;
            }
            try {
                cesiumViewer.render();
                changeBabylonCamera(cesiumViewer, babylonCamera);
                babylonScene.render();
            } catch (error) {
                console.error('Render loop error:', error);
            }
        };

        babylonEngine.runRenderLoop(renderLoop);

        return () => {
            isMountedRef.current = false;

            if (babylonEngineRef.current) {
                babylonEngineRef.current.stopRenderLoop();
                babylonEngineRef.current.dispose();
                babylonEngineRef.current = null;
            }
        };

    }, [viewer, babylonCanvasRef]);

    return (
        <div className="h-full w-full">
            <div ref={cesiumContainerRef} className="h-full w-full" />
            <canvas ref={babylonCanvasRef} className="h-full w-full absolute top-0 left-0 pointer-events-none" />
        </div>
    )
}