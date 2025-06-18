import { useCesium } from 'cesium-hooks'
import { MapContext } from '@/context/MapProvider'
import { useContext, useEffect } from 'react'
import { Cesium3DTileset, Credit, Ellipsoid, GeographicTilingScheme, UrlTemplateImageryProvider, WebMapTileServiceImageryProvider } from 'cesium';

export default function DefaultMap() {
  const imageProvide = new WebMapTileServiceImageryProvider({
    url: 'https://gibs-c.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_CityLights_2012/default//GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg',
    layer : 'BlueMarble_ShadedRelief',
    style : 'default',
    format : 'image/jpeg',
    tileMatrixSetID : 'GoogleMapsCompatible_Level9',
    maximumLevel: 9,
  })

  const { cesiumContainerRef, viewer } = useCesium(
    import.meta.env.VITE_ION_TOKEN,
    {
      imageryProvider: imageProvide,
    }
  )

  return (
    <div className="h-full w-full">
      <div ref={cesiumContainerRef} className="h-full w-full" />
    </div>
  )
} 