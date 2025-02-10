import { useEffect } from "react";
import { Viewer, Cartesian3 } from "cesium";
interface UseCameraProps {
    viewer: Viewer;
    position?: { longitude: number, latitude: number, height: number };
    duration?: number;
}

export const useCamera = ({ viewer, position, duration = 2 }: UseCameraProps) => {
    useEffect(() => {
        if (position) {
            viewer.camera.flyTo({
                destination: Cartesian3.fromDegrees(
                    position.longitude,
                    position.latitude,
                    position.height
                ),
                duration
            });
        }
    }, [viewer, position, duration]);

    return {
        flyTo: (position: { longitude: number, latitude: number, height: number }) => {
            viewer.camera.flyTo({
                destination: Cartesian3.fromDegrees(
                    position.longitude,
                    position.latitude,
                    position.height
                ),
                duration
            });
        }
    };
};
