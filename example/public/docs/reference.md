

### 源码解读

- [微信公众号-Cesium绘制一帧流程](https://mp.weixin.qq.com/s/Edf4tJ4kEmHFpaWZix-DQQ)


### wmts

- [obs-Day 19 of #30DayMapChallenge 2022 - "Globe](https://observablehq.com/d/a228bf2cbb47ba06)
- [自己随手写的](https://codepen.io/ajn404/pen/raVZLbZ?editors=1010)

```js
var gibs = {};

gibs.GeographicTilingScheme = function (options) {
  var self = new Cesium.GeographicTilingScheme(options);
  var Math = Cesium.Math;

  var tilePixels = 512;
  var rectangle = Cesium.Rectangle.MAX_VALUE;

  // Resolution: radians per pixel
  var levels = [
    { width: 2, height: 1, resolution: 0.009817477042468103 },
    { width: 3, height: 2, resolution: 0.004908738521234052 },
    { width: 5, height: 3, resolution: 0.002454369260617026 },
    { width: 10, height: 5, resolution: 0.001227184630308513 },
    { width: 20, height: 10, resolution: 0.0006135923151542565 },
    { width: 40, height: 20, resolution: 0.00030679615757712823 },
    { width: 80, height: 40, resolution: 0.00015339807878856412 },
    { width: 160, height: 80, resolution: 0.00007669903939428206 },
    { width: 320, height: 160, resolution: 0.00003834951969714103 }
  ];

  self.getNumberOfXTilesAtLevel = function (level) {
    return levels[level].width;
  };

  self.getNumberOfYTilesAtLevel = function (level) {
    return levels[level].height;
  };

  self.tileXYToRectangle = function (x, y, level, result) {
    var resolution = levels[level].resolution;

    var xTileWidth = resolution * tilePixels;
    var west = x * xTileWidth + rectangle.west;
    var east = (x + 1) * xTileWidth + rectangle.west;

    var yTileHeight = resolution * tilePixels;
    var north = rectangle.north - y * yTileHeight;
    var south = rectangle.north - (y + 1) * yTileHeight;

    if (!result) {
      result = new Cesium.Rectangle(0, 0, 0, 0);
    }
    result.west = west;
    result.south = south;
    result.east = east;
    result.north = north;
    return result;
  };

  self.positionToTileXY = function (position, level, result) {
    if (!Cesium.Rectangle.contains(rectangle, position)) {
      return undefined;
    }

    var xTiles = levels[level].width;
    var yTiles = levels[level].height;
    var resolution = levels[level].resolution;

    var xTileWidth = resolution * tilePixels;
    var yTileHeight = resolution * tilePixels;

    var longitude = position.longitude;
    if (rectangle.east < rectangle.west) {
      longitude += Math.TWO_PI;
    }

    var xTileCoordinate = (longitude - rectangle.west) / xTileWidth | 0;
    if (xTileCoordinate >= xTiles) {
      xTileCoordinate = xTiles - 1;
    }

    var latitude = position.latitude;
    var yTileCoordinate = (rectangle.north - latitude) / yTileHeight | 0;
    if (yTileCoordinate > yTiles) {
      yTileCoordinate = yTiles - 1;
    }

    if (!result) {
      result = new Cesium.Cartesian2(0, 0);
    }
    result.x = xTileCoordinate;
    result.y = yTileCoordinate;
    return result;
  };

  return self;
};


var initialTime = Cesium.JulianDate.fromDate(
    new Date(Date.UTC(2014, 5, 15)));

  // Earliest date of Corrected Reflectance in archive: Feb 24, 2000
  var startTime = Cesium.JulianDate.fromDate(
    new Date(Date.UTC(2000, 1, 24)));

  var endTime = Cesium.JulianDate.now();

  var clock = new Cesium.Clock();
  var clockViewModel = new Cesium.ClockViewModel(clock);
  clockViewModel.startTime = startTime;
  clockViewModel.endTime = endTime;
  clockViewModel.currentTime = initialTime;
  clockViewModel.multiplier = 0; // Don't start animation by default
  clockViewModel.clockRange = Cesium.ClockRange.CLAMPED;

  // Keep track of the previous day. Only update the layer on a tick if the
  // day has actually changed.
  var previousTime = null;

  // GIBS needs the day as a string parameter in the form of YYYY-MM-DD.
  // Date.toISOString returns YYYY-MM-DDTHH:MM:SSZ. Split at the 'T' and
  // take the date which is the first part.
  var isoDate = function (isoDateTime) {
    return isoDateTime.split('T')[0];
  };

  // Create the layer for the current day
  var createDailyProvider = function () {
    var isoDateTime = clock.currentTime.toString();
    var time = 'TIME=' + isoDate(isoDateTime);

    // Day of the imagery to display is appended to the imagery
    // provider URL
    var provider = new Cesium.WebMapTileServiceImageryProvider({
      url: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?' + time,
      layer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
      style: '',
      format: 'image/jpeg',
      tileMatrixSetID: '250m',
      maximumLevel: 8,
      tileWidth: 256,
      tileHeight: 256,
      tilingScheme: gibs.GeographicTilingScheme()
    });

    return provider;
  };

  var viewer = new Cesium.Viewer('cesiumContainer', {
    clockViewModel: clockViewModel,
    baseLayerPicker: false, // Only showing one layer in this demo
    imageryProvider: createDailyProvider(),
    geocoder: false // Cesium Ion account needed for geocoder
  });

  // Set the timeline to show up to a year ago
  var previousYear = new Date();
  previousYear.setUTCFullYear(previousYear.getUTCFullYear() - 1);
  viewer.timeline.zoomTo(Cesium.JulianDate.fromDate(previousYear), endTime);

  viewer.scene.globe.baseColor = Cesium.Color.BLACK;

  // When the clock changes, check to see if the day has changed and
  // replace the current layer with a new one.
  function doClockUpdate() {
    viewer.scene.imageryLayers.removeAll();
    viewer.scene.imageryLayers.addImageryProvider(
      createDailyProvider());
  };

  // Don't do this check too often
  var updateTimer = null;
  function onClockUpdate() {
    var isoDateTime = clock.currentTime.toString();
    var time = isoDate(isoDateTime);
    if (time !== previousTime) {
      previousTime = time;
      clearTimeout(updateTimer);
      updateTimer = setTimeout(doClockUpdate, 250);
    }
  }

  viewer.clock.onTick.addEventListener(onClockUpdate);
  onClockUpdate();
```