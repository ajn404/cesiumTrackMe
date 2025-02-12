import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "./components/Layout"
import { 
  DefaultMap, 
  SkyboxMap, 
  AtmosphereMap, 
  CameraMap, 
  PerformanceMap,
  Tracking
} from "./pages"
import { Documentation } from './pages/Documentation'
import { ThemeProvider } from "@/components/theme-provider"

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter 
        basename="/cesiumTrackMe"
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
            <Route path="/:page" element={<Documentation />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
