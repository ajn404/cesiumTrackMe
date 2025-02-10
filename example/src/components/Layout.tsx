import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"

export function Layout() {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    )
}
