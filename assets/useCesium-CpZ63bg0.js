import{r as n}from"./index-DkMtsVeE.js";function y(o,r={}){const s=n.useRef(null),a=n.useRef(),t=n.useRef(),i=n.useRef(),c=n.useRef(!1);return Cesium.Ion.defaultAccessToken=o,n.useEffect(()=>{if(s.current&&!a.current){const l={terrainProvider:void 0,baseLayerPicker:!1,timeline:!1,animation:!1,fullscreenButton:!1,vrButton:!1,geocoder:!1,homeButton:!1,infoBox:!1,sceneModePicker:!1,selectionIndicator:!1,navigationHelpButton:!1,requestRenderMode:!0,maximumRenderTimeChange:1e3},e=new Cesium.Viewer(s.current,{...l,...r,skyBox:r.skyBox?new Cesium.SkyBox({}):!1,skyAtmosphere:r.skyAtmosphere?new Cesium.SkyAtmosphere:!1});if(r.hideCredit&&(e.cesiumWidget.creditContainer.style.display="none"),r.defaultCamera){const{longitude:u,latitude:f,height:m,heading:d=0,pitch:C=-90,roll:R=0}=r.defaultCamera;e.camera.setView({destination:Cesium.Cartesian3.fromDegrees(u,f,m),orientation:{heading:Cesium.Math.toRadians(d),pitch:Cesium.Math.toRadians(C),roll:Cesium.Math.toRadians(R)}})}return r.enableDrag===!1&&(e.scene.screenSpaceCameraController.enableRotate=!1,e.scene.screenSpaceCameraController.enableTranslate=!1,e.scene.screenSpaceCameraController.enableZoom=!1,e.scene.screenSpaceCameraController.enableTilt=!1,e.scene.screenSpaceCameraController.enableLook=!1),a.current=e,t.current=e.scene,i.current=e.camera,c.current=!0,()=>{a.current&&(a.current.destroy(),a.current=void 0,t.current=void 0,i.current=void 0,c.current=!1)}}},[]),{cesiumContainerRef:s,viewer:a,scene:t,camera:i,isReady:c}}export{y as u};
