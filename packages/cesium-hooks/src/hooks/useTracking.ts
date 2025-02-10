import { useEffect, useRef } from "react";
import { Viewer, Entity, Cartesian3, Color, ConstantPositionProperty } from "cesium";
import * as Cesium from "cesium";

interface UseTrackingProps {
    viewer: Viewer;
    position: { longitude: number, latitude: number, height: number };
}

export const useTracking = ({ viewer, position }: UseTrackingProps) => {
    const entityRef = useRef<Entity>();

    useEffect(() => {
        if (!entityRef.current) {
            entityRef.current = viewer.entities.add({
                position: Cartesian3.fromDegrees(
                    position.longitude,
                    position.latitude,
                    position.height
                ),
                point: {
                    pixelSize: 10,
                    color: Color.RED
                }
            });
        } else {
            entityRef.current.position = new ConstantPositionProperty(
                Cartesian3.fromDegrees(
                    position.longitude,
                    position.latitude,
                    position.height
                )
            );
        }
    }, [viewer, position]);

    return {
        updatePosition: (position: { longitude: number, latitude: number, height: number }) => {
            if (entityRef.current) {
                entityRef.current.position = new Cesium.ConstantPositionProperty(
                    Cartesian3.fromDegrees(
                        position.longitude,
                        position.latitude,
                        position.height
                    )
                );
            }
        }
    };
};