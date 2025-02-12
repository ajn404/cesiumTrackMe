import { Map, Sun, Moon, Eye, Compass, Route } from "lucide-react"
import { DefaultMap, SkyboxMap, AtmosphereMap, CameraMap, PerformanceMap, Tracking, Documentation, TerrainMap } from "@/pages"
import { title } from "process"

export const routes = [
    {
        groupLabel: "基础功能",
        items: [
            {
                title: "默认地图",
                path: "/basic/default",
                element: DefaultMap,
                icon: Map,
                docs: "default-map"
            },
            {
                title: "天空盒",
                path: "/basic/skybox",
                element: SkyboxMap,
                icon: Sun
            },
            {
                title: "大气效果",
                path: "/basic/atmosphere",
                element: AtmosphereMap,
                icon: Moon
            },
            {
                title: "相机控制",
                path: "/basic/camera",
                element: CameraMap,
                icon: Eye
            },
            {
                title: "性能优化",
                path: "/basic/performance",
                element: PerformanceMap,
                icon: Compass
            }
        ]
    },
    {
        groupLabel: "进阶功能",
        items: [
            {
                title: "轨迹追踪",
                path: "/advanced/tracking",
                element: Tracking,
                icon: Route
            },
            {
                title: "地形地图",
                path: "/advanced/terrain",
                element: TerrainMap,
                icon: Route
            }
        ]
    },
    {
        path: "/:page",
        element: Documentation
    }
]