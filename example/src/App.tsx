import { BrowserRouter } from "react-router";
import { ThemeProvider } from "@/components/theme-provider";
import { routes } from "@/constants/routes";
import { RouteRenderer } from "./routes/RouteRenderer";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename="/cesiumTrackMe">
        <RouteRenderer routes={routes} />
      </BrowserRouter>
    </ThemeProvider>
  );
}