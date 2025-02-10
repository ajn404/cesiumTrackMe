import { useCesium } from "./index";
import { useEffect } from "react";

export default () => {
  const { cesiumContainerRef, viewer } = useCesium();

  useEffect(() => {
    if (viewer.current) {
      console.log(viewer.current, viewer.current.camera)
    }
  }, []);

  return (
    <>
      <div
        onDoubleClick={() => {
          if (cesiumContainerRef.current) {
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              cesiumContainerRef.current.requestFullscreen();
            }
          }
        }}
        ref={cesiumContainerRef}
        style={{ width: "100%", height: "100%", userSelect: "none" }}
      />
    </>
  );
};
