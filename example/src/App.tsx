import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "./components/Layout"
import { 
  DefaultMap, 
  SkyboxMap, 
  AtmosphereMap, 
  CameraMap, 
  PerformanceMap 
} from "./pages/basic"
import { Tracking, Terrain, Layers, Controls, Drawing } from "./pages"

export default function App() {
  return (
    <BrowserRouter 
      basename="/cesium"
      future={{ 
        v7_startTransition: true,
        v7_relativeSplatPath: true 
      }}
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DefaultMap />} />
          <Route path="basic">
            <Route path="default" element={<DefaultMap />} />
            <Route path="skybox" element={<SkyboxMap />} />
            <Route path="atmosphere" element={<AtmosphereMap />} />
            <Route path="camera" element={<CameraMap />} />
            <Route path="performance" element={<PerformanceMap />} />
          </Route>
          <Route path="tracking" element={<Tracking />} />
          <Route path="terrain" element={<Terrain />} />
          <Route path="layers" element={<Layers />} />
          <Route path="controls" element={<Controls />} />
          <Route path="drawing" element={<Drawing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
