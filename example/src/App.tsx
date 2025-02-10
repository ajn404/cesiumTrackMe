import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "./components/Layout"
import { BasicMap, Tracking, Terrain, Layers, Controls, Drawing } from "./pages"

export default function App() {
  return (
    <BrowserRouter future={{ 
      v7_startTransition: true,
      v7_relativeSplatPath: true 
    }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<BasicMap />} />
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
