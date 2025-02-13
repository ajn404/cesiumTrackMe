import { Viewer, Cartesian3, Matrix4, Transforms, Math as CesiumMath } from 'cesium';
import { Scene, Vector3, Matrix, ArcRotateCamera } from '@babylonjs/core';

export class BabylonCesiumBridge {
  private cesiumViewer: Viewer;
  private babylonScene: Scene;

  constructor(cesiumViewer: Viewer, babylonScene: Scene) {
    this.cesiumViewer = cesiumViewer;
    this.babylonScene = babylonScene;
    this.syncCamera();
  }

  syncCamera(): void {
    const cesiumCamera = this.cesiumViewer.camera;
    const babylonCamera = new ArcRotateCamera(
      'BabylonCamera',
      0,
      0,
      0,
      Vector3.Zero(),
      this.babylonScene
    );

    this.babylonScene.activeCamera = babylonCamera;

    this.cesiumViewer.camera.changed.addEventListener(() => {
      const position = cesiumCamera.positionWC;
      const direction = cesiumCamera.directionWC;
      const up = cesiumCamera.upWC;

      const transform = Matrix4.fromRotationTranslation(
        Matrix4.getRotation(cesiumCamera.viewMatrix, new Matrix4()),
        position
      );

      const babylonPosition = new Vector3(position.x, position.y, position.z);
      const babylonDirection = new Vector3(direction.x, direction.y, direction.z);
      const babylonUp = new Vector3(up.x, up.y, up.z);

      babylonCamera.position = babylonPosition;
      babylonCamera.setTarget(babylonPosition.add(babylonDirection));
      babylonCamera.upVector = babylonUp;
    });
  }

  // ... 其他同步方法
}