// import * as Cesium from "cesium";

import { Cartesian2, Cartographic, Clock, ClockRange, ClockViewModel, GeographicTilingScheme, JulianDate, Rectangle, Viewer, Math, ImageryProvider, WebMapTileServiceImageryProvider, WebMapServiceImageryProvider, ProviderViewModel, Color } from "cesium";

interface Level {
    width: number;
    height: number;
    resolution: number;
}

interface Gibs {
    GeographicTilingScheme: (
        options?: Partial<GeographicTilingScheme>
    ) => GeographicTilingScheme & {
        getNumberOfXTilesAtLevel: (level: number) => number;
        getNumberOfYTilesAtLevel: (level: number) => number;
        tileXYToRectangle: (
            x: number,
            y: number,
            level: number,
            result?: Rectangle
        ) => Rectangle;
        positionToTileXY: (
            position: Cartographic,
            level: number,
            result?: Cartesian2
        ) => Cartesian2;
    };
    Viewer: (config: GIBSConfig) => Viewer;
}

export const gibs: Gibs = {
    GeographicTilingScheme: function (
        options?: Partial<GeographicTilingScheme>
    ) {
        const self = new GeographicTilingScheme(options) as GeographicTilingScheme & {
            getNumberOfXTilesAtLevel: (level: number) => number;
            getNumberOfYTilesAtLevel: (level: number) => number;
            tileXYToRectangle: (
                x: number,
                y: number,
                level: number,
                result?: Rectangle
            ) => Rectangle;
            positionToTileXY: (
                position: Cartographic,
                level: number,
                result?: Cartesian2
            ) => Cartesian2;
        };
        const tilePixels = 512;
        const rectangle = Rectangle.MAX_VALUE;

        // Resolution: radians per pixel
        const levels: Level[] = [
            { width: 2, height: 1, resolution: 0.009817477042468103 },
            { width: 3, height: 2, resolution: 0.004908738521234052 },
            { width: 5, height: 3, resolution: 0.002454369260617026 },
            { width: 10, height: 5, resolution: 0.001227184630308513 },
            { width: 20, height: 10, resolution: 0.0006135923151542565 },
            { width: 40, height: 20, resolution: 0.00030679615757712823 },
            { width: 80, height: 40, resolution: 0.00015339807878856412 },
            { width: 160, height: 80, resolution: 0.00007669903939428206 },
            { width: 320, height: 160, resolution: 0.00003834951969714103 },
        ];

        self.getNumberOfXTilesAtLevel = function (level: number): number {
            return levels[level].width;
        };

        self.getNumberOfYTilesAtLevel = function (level: number): number {
            return levels[level].height;
        };

        self.tileXYToRectangle = function (
            x: number,
            y: number,
            level: number,
            result?: Rectangle
        ): Rectangle {
            const resolution = levels[level].resolution;

            const xTileWidth = resolution * tilePixels;
            const west = x * xTileWidth + rectangle.west;
            const east = (x + 1) * xTileWidth + rectangle.west;

            const yTileHeight = resolution * tilePixels;
            const north = rectangle.north - y * yTileHeight;
            const south = rectangle.north - (y + 1) * yTileHeight;

            if (!result) {
                result = new Rectangle(0, 0, 0, 0);
            }
            result.west = west;
            result.south = south;
            result.east = east;
            result.north = north;
            return result;
        };

        self.positionToTileXY = function (
            position: Cartographic,
            level: number,
            result?: Cartesian2
        ): Cartesian2 {
            if (!Rectangle.contains(rectangle, position)) {
                throw new Error("Position is out of rectangle bounds");
            }

            const xTiles = levels[level].width;
            const yTiles = levels[level].height;
            const resolution = levels[level].resolution;

            const xTileWidth = resolution * tilePixels;
            const yTileHeight = resolution * tilePixels;

            let longitude = position.longitude;
            if (rectangle.east < rectangle.west) {
                longitude += Math.TWO_PI;
            }

            let xTileCoordinate = ((longitude - rectangle.west) / xTileWidth) | 0;
            if (xTileCoordinate >= xTiles) {
                xTileCoordinate = xTiles - 1;
            }

            let latitude = position.latitude;
            let yTileCoordinate = ((rectangle.north - latitude) / yTileHeight) | 0;
            if (yTileCoordinate > yTiles) {
                yTileCoordinate = yTiles - 1;
            }

            if (!result) {
                result = new Cartesian2(0, 0);
            }
            result.x = xTileCoordinate;
            result.y = yTileCoordinate;
            return result;
        };

        return self;
    },
    Viewer: function (config: GIBSConfig): Viewer {
        // Earliest date of Corrected Reflectance in archive: Feb 24, 2000
        const startTime = JulianDate.fromDate(new Date(Date.UTC(2000, 1, 24)));
        const endTime = JulianDate.now();

        // If slightly after midnight, show the previous day's data while the near-real time imagery is processing.
        const show = new Date();
        if (show.getUTCHours() < 3) {
            show.setUTCDate(show.getUTCDate() - 1);
        }
        const initialTime = JulianDate.fromDate(show);

        // Keep track of the previous day. Only update the layer on a tick if the day has actually changed.
        let previousTime: string | null = null;
        let selectedSet: GIBSSet | null = null;

        const clock = new Clock();
        const clockViewModel = new ClockViewModel(clock);
        clockViewModel.startTime = startTime;
        clockViewModel.stopTime = endTime;
        clockViewModel.currentTime = initialTime;
        clockViewModel.multiplier = 0; // Don't start animation by default
        clockViewModel.clockRange = ClockRange.CLAMPED;

        // GIBS needs the day as a string parameter in the form of YYYY-MM-DD.
        // Date.toISOString returns YYYY-MM-DDTHH:MM:SSZ. Split at the 'T' and take the date which is the first part.
        const isoDate = (isoDateTime: string) => isoDateTime.split('T')[0];

        // Create the layer for the current day
        const createProvider = (layerId: string) => {
            const layer = config.layers[layerId];
            let time = '';

            if (layer.startDate) {
                const isoDateTime = clock.currentTime.toString();
                time = '?TIME=' + isoDate(isoDateTime);
            }

            let provider: ImageryProvider;
            if (!layer.wms) {
                const resolution = config.resolutions[layer.resolution];
                const options: WebMapTileServiceImageryProvider.ConstructorOptions = {
                    url: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi' + time,
                    layer: layer.id,
                    style: '',
                    format: layer.format,
                    tileMatrixSetID: resolution.tileMatrixSetID,
                    minimumLevel: 0,
                    maximumLevel: resolution.maximumLevel,
                    tileWidth: 512,
                    tileHeight: 512,
                    tilingScheme: gibs.GeographicTilingScheme()
                };
                if (layer.credit) {
                    options.credit = layer.credit;
                }
                provider = new WebMapTileServiceImageryProvider(options);
            } else {
                const optionsWMS: WebMapServiceImageryProvider.ConstructorOptions = {
                    url: 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi' + time,
                    layers: layer.id,
                    parameters: {
                        transparent: true,
                        format: 'image/png'
                    }
                };
                if (layer.credit) {
                    (optionsWMS as any).credit = layer.credit;
                }
                provider = new WebMapServiceImageryProvider(optionsWMS);
            }
            return provider;
        };

        const models: ProviderViewModel[] = [];
        config.sets.forEach((set) => {
            const model = new ProviderViewModel({
                name: set.name,
                tooltip: set.name,
                iconUrl: set.icon,
                creationFunction: function () {
                    // Return an empty set and update the layers in the same way done when the clock changes.
                    selectedSet = set;
                    setTimeout(updateLayers, 0);
                    return [];
                }
            });
            models.push(model);
        });

        const viewer = new Viewer(config.viewer || 'map', {
            clockViewModel: clockViewModel,
            imageryProviderViewModels: models,
            terrainProviderViewModels: [],
            geocoder: false
        });

        // Set the timeline to show up to a year ago
        const previousYear = new Date();
        previousYear.setUTCFullYear(previousYear.getUTCFullYear() - 1);
        viewer.timeline.zoomTo(JulianDate.fromDate(previousYear), endTime);

        let updateTimer: number | undefined = undefined;

        viewer.clock.onTick.addEventListener(onClockUpdate);
        onClockUpdate();
        viewer.scene.globe.baseColor = Color.BLACK;

        // Invoked when the current day changes, but do not call this too often if the user is sweeping through days.
        function updateLayers() {
            const qs = document.querySelector.bind(document) as typeof document.querySelector;
            const layers = viewer.scene.imageryLayers;
            layers.removeAll();
            if (selectedSet) {
                selectedSet.layers.forEach((layerId) => {
                    layers.addImageryProvider(createProvider(layerId));
                });
                const legend = selectedSet.legend;
                const legendDiv = qs('#legend') as HTMLElement | null;
                if (!legendDiv) return;
                if (!legend) {
                    legendDiv.style.display = 'none';
                } else if (legend.type === 'scale') {
                    const scaleTitle = qs('.scale .legend-title') as HTMLElement | null;
                    const colorbar = qs('.legend-colorbar') as HTMLImageElement | null;
                    const max = qs('.legend-max') as HTMLElement | null;
                    const min = qs('.legend-min') as HTMLElement | null;
                    if (scaleTitle) scaleTitle.textContent = legend.title;
                    if (colorbar && legend.colorbar) colorbar.setAttribute('src', legend.colorbar);
                    if (max && legend.max) max.innerHTML = legend.max;
                    if (min && legend.min) min.innerHTML = legend.min;
                    const single = qs('#legend .single') as HTMLElement | null;
                    const scale = qs('#legend .scale') as HTMLElement | null;
                    if (single) single.style.display = 'none';
                    if (scale) scale.style.display = 'block';
                    legendDiv.style.display = 'block';
                } else {
                    const singleTitle = qs('.single .legend-title') as HTMLElement | null;
                    const legendColor = qs('.legend-color') as HTMLElement | null;
                    if (singleTitle) singleTitle.textContent = legend.title;
                    if (legendColor && legend.color) legendColor.style.backgroundColor = legend.color;
                    const scale = qs('#legend .scale') as HTMLElement | null;
                    const single = qs('#legend .single') as HTMLElement | null;
                    if (scale) scale.style.display = 'none';
                    if (single) single.style.display = 'block';
                    legendDiv.style.display = 'block';
                }
            }
        }

        // When the clock changes, check to see if the day has changed and replace the current layers
        function onClockUpdate() {
            const isoDateTime = clock.currentTime.toString();
            const time = isoDate(isoDateTime);
            if (time !== previousTime) {
                previousTime = time;
                if (updateTimer !== undefined) clearTimeout(updateTimer);
                updateTimer = window.setTimeout(updateLayers, 250);
            }
        }

        function getLeadingPoint() {
            // Set default extent according to time of day:
            //   at 00:00 UTC, start at far eastern edge of map: '20.6015625,-46.546875,179.9296875,53.015625'
            //   at 23:00 UTC, start at far western edge of map: '-179.9296875,-46.546875,-20.6015625,53.015625'
            let curHour = new Date().getUTCHours();
            if (curHour < 3) {
                curHour = 23;
            }
            curHour -= 5;
            const minLon = 20.6015625 + curHour * (-200.53125 / 23.0);
            const maxLon = minLon + 159.328125;
            const minLat = -46.546875;
            const maxLat = 53.015625;
            return new Rectangle(
                Math.toRadians(minLon),
                Math.toRadians(minLat),
                Math.toRadians(maxLon),
                Math.toRadians(maxLat)
            );
        }

        viewer.camera.setView({ destination: getLeadingPoint() });

        return viewer;
    },
};

// 类型声明
interface GIBSLayer {
    id: string;
    format: string;
    resolution: string;
    wms?: boolean;
    credit?: string;
    startDate?: string | Date;
}

interface GIBSResolution {
    tileMatrixSetID: string;
    maximumLevel: number;
}

interface GIBSLegend {
    type: 'scale' | 'single';
    title: string;
    colorbar?: string;
    max?: string;
    min?: string;
    color?: string;
}

interface GIBSSet {
    name: string;
    icon: string;
    layers: string[];
    legend?: GIBSLegend;
}

export interface GIBSConfig {
    layers: Record<string, GIBSLayer>;
    resolutions: Record<string, GIBSResolution>;
    sets: GIBSSet[];
    viewer?: string;
}
