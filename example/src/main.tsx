import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "@/context/ThemeProvider";
import { routes } from "@/routes/routes";
import { RouteRenderer } from "./routes/RouteRenderer";
import { MapProvider } from "@/context/MapProvider"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <MapProvider>
        <BrowserRouter basename="/cesiumTrackMe" >
          <RouteRenderer routes={routes}  />
        </BrowserRouter>
      </MapProvider>
    </ThemeProvider>
  </React.StrictMode>
) 