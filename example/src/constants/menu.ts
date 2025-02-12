import { Map, Sun, Moon, Eye, Compass, Route, Mountain, Layers, Navigation, Globe2 } from "lucide-react"

export const menuItems = [
  {
    groupLabel: "基础功能",
    items: [
      {
        title: "默认地图",
        href: "/basic/default",
        icon: Map,
        docs: "default-map"
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
      // {
      //   title: "地形加载",
      //   href: "/terrain",
      //   icon: Mountain
      // },
      // {
      //   title: "图层控制",
      //   href: "/layers",
      //   icon: Layers
      // },
      // {
      //   title: "地图控件",
      //   href: "/controls",
      //   icon: Navigation
      // },
      // {
      //   title: "矢量标绘",
      //   href: "/drawing",
      //   icon: Globe2
      // }
    ]
  }
] 