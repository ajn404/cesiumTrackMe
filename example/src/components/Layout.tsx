import { Outlet } from "react-router"
import { Sidebar } from "./Sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export function Layout() {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-screen">
                <Sidebar />
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </SidebarProvider>
    )
}
