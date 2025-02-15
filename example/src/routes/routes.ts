import { Map, Sun, Moon, Eye, Compass, Route } from "lucide-react";
import { LazyLoad } from "@/components/hoc/LazyLoad";

export const routes = [
    {
        groupLabel: "基础功能",
        items: [
            {
                title: "默认地图",
                path: "/basic/default",
                element: LazyLoad(() => import('@/pages/basic/DefaultMap')),
                icon: Map,
                docs: "default-map",
            },
            {
                title: "天空盒",
                path: "/basic/skybox",
                element: LazyLoad(() => import('@/pages/basic/SkyboxMap')),
                icon: Sun
            },
            {
                title: "大气效果",
                path: "/basic/atmosphere",
                element: LazyLoad(() => import('@/pages/basic/AtmosphereMap')),
                icon: Moon
            },
            {
                title: "相机控制",
                path: "/basic/camera",
                element: LazyLoad(() => import('@/pages/basic/CameraMap')),
                docs:'use-camera',
                icon: Eye
            },
            {
                title: "性能优化",
                path: "/basic/performance",
                element: LazyLoad(() => import('@/pages/basic/PerformanceMap')),
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
                element: LazyLoad(() => import('@/pages/advanced/Tracking')),
                docs: "advance",
                icon: Route
            },
            {
                title: "地形地图",
                path: "/advanced/terrain",
                element: LazyLoad(() => import('@/pages/advanced/Terrain')),
                icon: Route
            },
            {
                title: "自定义着色器",
                path: "/advanced/shader",
                element: LazyLoad(() => import('@/pages/advanced/Shader')),
                icon: Route
            },
            {
                title: "天地图",
                path: "/advanced/tianditu",
                element: LazyLoad(() => import('@/pages/advanced/TianDiTu')),
                icon: Route,
                docs:'tianditu'
            }
        ]
    },
    {
        path: "/:page",
        element: LazyLoad(() => import('@/pages/Documentation'))
    }
];