import{r as t,M as w,j as m}from"./index-mNeNeRHJ.js";import{u as C}from"./useCesium-5qPCBrni.js";function x(){const{mapProvider:c}=t.useContext(w),{cesiumContainerRef:o,viewer:n}=C(void 0,{tianDiTu:{enabled:c==="Tianditu",token:"fa4fa7129232846bfb71e9c37848b6df"}}),i=t.useRef(null),l=t.useRef(null);return t.useEffect(()=>{if(n.current){i.current=n.current.scene;const e=new Cesium.Primitive({geometryInstances:new Cesium.GeometryInstance({geometry:new Cesium.RectangleGeometry({rectangle:Cesium.Rectangle.fromDegrees(-180,-90,180,90),vertexFormat:Cesium.VertexFormat.POSITION_AND_ST})}),appearance:new Cesium.MaterialAppearance({material:new Cesium.Material({fabric:{type:"LiquidGlass",uniforms:{u_mouse:new Cesium.Cartesian2(0,0),u_time:0,u_resolution:new Cesium.Cartesian2(window.innerWidth,window.innerHeight)},source:`
                            uniform float u_time;
czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material = czm_getDefaultMaterial(materialInput);
    material.diffuse = vec3(abs(sin(u_time)), 1.0, abs(cos(u_time)));
    material.alpha = 0.9;
    return material;
}
                        `}}),translucent:!0})});l.current=e,i.current.primitives.add(e);const a=n.current.canvas;new Cesium.ScreenSpaceEventHandler(a).setInputAction(r=>{const s=r.endPosition;if(s){const f=s.x/a.clientWidth,p=1-s.y/a.clientHeight;e.appearance.material.uniforms.u_mouse=new Cesium.Cartesian2(f,p)}},Cesium.ScreenSpaceEventType.MOUSE_MOVE);const d=Cesium.JulianDate.now().secondsOfDay;i.current.postRender.addEventListener(()=>{const r=Cesium.JulianDate.now().secondsOfDay;e.appearance.material.uniforms.u_time=r-d});const u=()=>{e.appearance.material.uniforms.u_resolution=new Cesium.Cartesian2(window.innerWidth,window.innerHeight)};return window.addEventListener("resize",u),()=>{window.removeEventListener("resize",u)}}},[n]),m.jsx("div",{className:"h-full w-full",children:m.jsx("div",{ref:o,className:"h-full w-full"})})}export{x as default};
