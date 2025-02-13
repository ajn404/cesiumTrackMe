import { Viewer, Cartesian3, Math as CesiumMath } from "cesium";
import { MutableRefObject, useEffect, useRef } from "react";

interface UseCameraProps {
    viewer?: MutableRefObject<Viewer | undefined>;
    duration?: number;
}

export const useCamera = ({ viewer, duration = 2 }: UseCameraProps) => {
    const viewerRef = useRef<Viewer | undefined>(viewer?.current);

    useEffect(() => {
        console.log(viewer)
        viewerRef.current = viewer?.current;
    }, [viewer]);

    const cameraActions = {
        flyTo: (position: { longitude: number, latitude: number, height: number }) => {
            if (!viewerRef.current) {
                console.warn('Viewer is not initialized');
                return;
            }
            viewerRef.current.camera.flyTo({
                destination: Cartesian3.fromDegrees(
                    position.longitude,
                    position.latitude,
                    position.height
                ),
                duration
            });
        },

        zoomIn: (amount: number = 1000) => {
            if (!viewerRef.current) {
                console.warn('Viewer is not initialized');
                return;
            }
            const currentPosition = viewerRef.current.camera.positionCartographic;
            const newHeight = currentPosition.height - amount;
            viewerRef.current.camera.flyTo({
                destination: Cartesian3.fromDegrees(
                    CesiumMath.toDegrees(currentPosition.longitude),
                    CesiumMath.toDegrees(currentPosition.latitude),
                    newHeight > 100 ? newHeight : 100
                ),
                duration
            });
        },

        zoomOut: (amount: number = 1000) => {
            if (!viewerRef.current) {
                console.warn('Viewer is not initialized');
                return;
            }
            const currentPosition = viewerRef.current.camera.positionCartographic;
            const newHeight = currentPosition.height + amount;
            viewerRef.current.camera.flyTo({
                destination: Cartesian3.fromDegrees(
                    CesiumMath.toDegrees(currentPosition.longitude),
                    CesiumMath.toDegrees(currentPosition.latitude),
                    newHeight
                ),
                duration
            });
        },

        setView: (position: { longitude: number, latitude: number, height: number }, heading: number = 0, pitch: number = -90, roll: number = 0) => {
            if (!viewerRef.current) {
                console.warn('Viewer is not initialized');
                return;
            }
            viewerRef.current.camera.setView({
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
        },

        getCurrentPosition: () => {
            if (!viewerRef.current) {
                console.warn('Viewer is not initialized');
                return null;
            }
            const cartographic = viewerRef.current.camera.positionCartographic;
            return {
                longitude: CesiumMath.toDegrees(cartographic.longitude),
                latitude: CesiumMath.toDegrees(cartographic.latitude),
                height: cartographic.height
            };
        }
    };

    return cameraActions;
};
