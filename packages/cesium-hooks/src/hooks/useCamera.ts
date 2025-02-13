import { Viewer, Cartesian3, Math as CesiumMath } from "cesium";

interface UseCameraProps {
    viewer?: Viewer;
    duration?: number;
}

export const useCamera = ({ viewer, duration = 2 }: UseCameraProps) => {
    const flyTo = (position: { longitude: number, latitude: number, height: number }) => {
        if (!viewer) {
            console.warn('Viewer is not initialized');
            return;
        }
        viewer.camera.flyTo({
            destination: Cartesian3.fromDegrees(
                position.longitude,
                position.latitude,
                position.height
            ),
            duration
        });
    };

    const zoomIn = (amount: number = 1000) => {
        if (!viewer) {
            console.warn('Viewer is not initialized');
            return;
        }
        const currentPosition = viewer.camera.positionCartographic;
        const newHeight = currentPosition.height - amount;
        viewer.camera.flyTo({
            destination: Cartesian3.fromDegrees(
                CesiumMath.toDegrees(currentPosition.longitude),
                CesiumMath.toDegrees(currentPosition.latitude),
                newHeight > 100 ? newHeight : 100 // 防止过度缩放
            ),
            duration
        });
    };

    const zoomOut = (amount: number = 1000) => {
        if (!viewer) {
            console.warn('Viewer is not initialized');
            return;
        }
        const currentPosition = viewer.camera.positionCartographic;
        const newHeight = currentPosition.height + amount;
        viewer.camera.flyTo({
            destination: Cartesian3.fromDegrees(
                CesiumMath.toDegrees(currentPosition.longitude),
                CesiumMath.toDegrees(currentPosition.latitude),
                newHeight
            ),
            duration
        });
    };

    const setView = (position: { longitude: number, latitude: number, height: number }, heading: number = 0, pitch: number = -90, roll: number = 0) => {
        if (!viewer) {
            console.warn('Viewer is not initialized');
            return;
        }
        viewer.camera.setView({
            destination: Cartesian3.fromDegrees(
                position.longitude,
                position.latitude,
                position.height
            ),
            orientation: {
                heading: CesiumMath.toRadians(heading),
                pitch: CesiumMath.toRadians(pitch),
                roll: CesiumMath.toRadians(roll)
            }
        });
    };

    const getCurrentPosition = () => {
        if (!viewer) {
            console.warn('Viewer is not initialized');
            return null;
        }
        const cartographic = viewer.camera.positionCartographic;
        return {
            longitude: CesiumMath.toDegrees(cartographic.longitude),
            latitude: CesiumMath.toDegrees(cartographic.latitude),
            height: cartographic.height
        };
    };

    return {
        flyTo,
        zoomIn,
        zoomOut,
        setView,
        getCurrentPosition
    };
};
