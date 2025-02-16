import{r as d,j as r}from"./index-DcuqsTuA.js";import{u as f}from"./useCesium-CFK1jZMS.js";function h(){const{cesiumContainerRef:n,viewer:e}=f(void 0,{hideCredit:!0});return d.useEffect(()=>{e.current&&requestIdleCallback(async()=>{const t=new Cesium.CustomShader({uniforms:{u_time:{value:0,type:Cesium.UniformType.FLOAT},u_resolution:{value:new Cesium.Cartesian2(window.innerWidth,window.innerHeight),type:Cesium.UniformType.VEC2}},varyings:{v_uv:Cesium.VaryingType.VEC2},mode:Cesium.CustomShaderMode.MODIFY_MATERIAL,lightingModel:Cesium.LightingModel.PBR,translucencyMode:Cesium.CustomShaderTranslucencyMode.TRANSLUCENT,vertexShaderText:`
          void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {
            v_uv = (vsInput.attributes.positionMC.xy + 1.0) / 2.0;
          }
        `,fragmentShaderText:`
          #define PI 3.14159265359

          // 网格平铺
          vec2 tile(vec2 st, float zoom) {
              st *= zoom;
              return fract(st);
          }

          // 棱形图案生成
          float diamondPattern(vec2 st) {
              st = abs(st - 0.5);
              return step(st.x + st.y, 0.5);
          }

          void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
              vec2 st = v_uv;
              st.x *= u_resolution.x / u_resolution.y;

              float zoom = 1.0;
              st = tile(st, zoom);

              float pattern = diamondPattern(st);
              float checker = mod(floor(gl_FragCoord.x / (u_resolution.x / zoom)) +
                  floor(gl_FragCoord.y / (u_resolution.y / zoom)), 2.0);
              vec3 color = mix(vec3(abs(cos(u_time))), vec3(abs(sin(u_time))), abs(1.0 - pattern));

              material.diffuse = color;
              material.alpha = 1.0;
          }
        `});function o(){const c=performance.now()*.001;t.setUniform("u_time",c),t.setUniform("u_resolution",new Cesium.Cartesian2(window.innerWidth,window.innerHeight))}e.current.scene.preRender.addEventListener(o);const s=new Cesium.Cartesian3(-1.5719521361662298e6,439524197876768e-8,4.3319493142119665e6),i=Cesium.Cartographic.fromCartesian(s),a=Cesium.Math.toDegrees(i.longitude),u=Cesium.Math.toDegrees(i.latitude),m=i.height,l=e.current.trackedEntity=e.current.entities.add({name:"animate",position:Cesium.Cartesian3.fromDegrees(a,u,m),model:{uri:"/cesiumTrackMe/assets/Cesium_Man.glb",scale:100,customShader:t}});e.current.trackedEntity=l})},[e]),r.jsx("div",{className:"h-full w-full",children:r.jsx("div",{ref:n,className:"h-full w-full"})})}export{h as default};
