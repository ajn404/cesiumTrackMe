import { useCesium } from 'cesium-hooks'
import { MapContext } from '@/context/MapProvider'
import { useContext, useEffect } from 'react'
import { Cesium3DTileset, Credit, Ellipsoid, GeographicTilingScheme, WebMapTileServiceImageryProvider } from 'cesium';

export default function DefaultMap() {
  const { mapProvider } = useContext(MapContext)
  Ellipsoid.default = Ellipsoid.MOON;
  const { cesiumContainerRef, viewer } = useCesium(
    import.meta.env.VITE_ION_TOKEN,
    {
      sceneModePicker: true,
      tianDiTu: {
        enabled: mapProvider === 'Tianditu',
        token: import.meta.env.VITE_TIANDITU_TOKEN
      },
      // globe: false,
      baseLayerPicker: false,
      geocoder: false,
    }
  )

  // useEffect(() => {
  //   if (viewer.current) {
  //     const init = async () => {
  //       const tileset = await Cesium3DTileset.fromIonAssetId(2684829);
  //       viewer.current.scene.primitives.add(tileset);
  //     }
  //     init();

  //   }
  // }, [cesiumContainerRef])

  return (
    <div className="h-full w-full">
      <div ref={cesiumContainerRef} className="h-full w-full" />
    </div>
  )
} 