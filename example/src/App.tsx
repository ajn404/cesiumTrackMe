import { BrowserRouter, Routes, Route } from "react-router"
import { Layout } from "./components/Layout"
import { ThemeProvider } from "@/components/theme-provider"
import { routes } from "@/constants/routes"

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename="/cesiumTrackMe">
        <Routes>
          <Route path="/" element={<Layout />}>
            {routes.map((group, index) =>
              group.items ? (
                group.items.map((item) => (
                  <Route key={item.path} path={item.path} element={<item.element />} />
                ))
              ) : (
                <Route key={group.path} path={group.path} element={<group.element />} />
              )
            )}
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
