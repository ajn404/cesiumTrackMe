const fs = require('fs-extra');
const path = require('path');

const sourceDir = path.resolve('dist/cesiumTrackMe');
const targetDir = path.resolve('dist/cesium');

if (fs.existsSync(sourceDir)) {
  fs.moveSync(sourceDir, targetDir, { overwrite: true });
  console.log(`Successfully renamed ${sourceDir} to ${targetDir}`);
} else {
  console.error(`Directory ${sourceDir} does not exist`);
} 