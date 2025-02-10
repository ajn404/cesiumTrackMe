import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"
import { Globe2, Route, Map, Navigation, Mountain, Layers, Sun, Moon, Compass, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    groupLabel: "基础功能",
    items: [
      {
        title: "默认地图",
        href: "/basic/default",
        icon: Map
      },
      {
        title: "天空盒",
        href: "/basic/skybox",
        icon: Sun
      },
      {
        title: "大气效果",
        href: "/basic/atmosphere",
        icon: Moon
      },
      {
        title: "相机控制",
        href: "/basic/camera",
        icon: Eye
      },
      {
        title: "性能优化",
        href: "/basic/performance",
        icon: Compass
      }
    ]
  },
  {
    groupLabel: "进阶功能",
    items: [
      {
        title: "轨迹追踪",
        href: "/tracking",
        icon: Route
      },
      {
        title: "地形加载",
        href: "/terrain",
        icon: Mountain
      },
      {
        title: "图层控制",
        href: "/layers",
        icon: Layers
      },
      {
        title: "地图控件",
        href: "/controls",
        icon: Navigation
      },
      {
        title: "矢量标绘",
        href: "/drawing",
        icon: Globe2
      }
    ]
  }
]

export function Sidebar() {
  const location = useLocation()

  return (
    <ShadcnSidebar className="w-64 border-r p-4">
      <SidebarContent>
        <div className="px-4 py-4">
          <h1 className="text-lg font-semibold">Cesium Hooks</h1>
        </div>
        {menuItems.map((group) => (
          <SidebarGroup key={group.groupLabel}>
            <SidebarGroupLabel>{group.groupLabel}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        location.pathname === item.href && "bg-accent"
                      )}
                    >
                      <Link to={item.href} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </ShadcnSidebar>
  )
}   