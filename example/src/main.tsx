import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "@/components/theme-provider";
import { routes } from "@/routes/routes";
import { RouteRenderer } from "./routes/RouteRenderer";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter basename="/cesiumTrackMe" >
        <RouteRenderer routes={routes}  />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
) 