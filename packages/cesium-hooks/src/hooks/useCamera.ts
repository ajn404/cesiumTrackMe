import { Viewer, Cartesian3 } from "cesium";

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

    return {
        flyTo
    };
};
