import { Link } from "react-router-dom"
import { Globe2, Route, Map, Navigation, Mountain, Layers } from "lucide-react"

const menuItems = [
  {
    title: "基础地图",
    icon: <Globe2 className="h-4 w-4" />,
    href: "/"
  },
  {
    title: "轨迹追踪",
    icon: <Route className="h-4 w-4" />,
    href: "/tracking"
  },
  {
    title: "地形加载",
    icon: <Mountain className="h-4 w-4" />,
    href: "/terrain"
  },
  {
    title: "图层控制",
    icon: <Layers className="h-4 w-4" />,
    href: "/layers"
  },
  {
    title: "地图控件",
    icon: <Navigation className="h-4 w-4" />,
    href: "/controls"
  },
  {
    title: "矢量标绘",
    icon: <Map className="h-4 w-4" />,
    href: "/drawing"
  }
]

export function Sidebar() {
  return (
    <div className="w-64 border-r bg-sidebar p-4">
      <div className="mb-4 text-lg font-semibold">Cesium Hooks</div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  )
} 