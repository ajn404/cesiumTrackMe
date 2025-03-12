import { Outlet, Link, useLocation } from "react-router"
import { Sidebar } from "./Sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

function Breadcrumbs() {
    const location = useLocation()
    const pathnames = location.pathname.split("/").filter((x) => x)

    return (
        <nav className="p-1">
            {pathnames.length > 0 ? (
                <Link to="/">首页</Link>
            ) : (
                <span>首页</span>
            )}
            {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join("/")}`
                const isLast = index === pathnames.length - 1
                return isLast ? (
                    <span key={to}> / {value}</span>
                ) : (
                    <span key={to}>
                        {" "}
                        / <Link to={to}>{value}</Link>
                    </span>
                )
            })}
        </nav>
    )
}

export function Layout() {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-screen">
                <Sidebar />
                <main className="flex-1 max-w-full">
                    <div className="flex">
                        <SidebarTrigger className="p-4" />
                        {/* 显示路由面包屑 */}
                        <div className="flex-1">
                            <Breadcrumbs />
                        </div>
                    </div>
                    <Outlet />
                </main>
            </div>
        </SidebarProvider>
    )
}