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
import { FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { menuItems } from "@/constants/menu"

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
                        {item.docs && (
                          <button 
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              window.open(`/cesiumTrackMe/docs/${item.docs}`, '_parent')
                            }}
                            className="ml-auto hover:text-primary"
                            title="查看文档"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <div className="mt-auto px-4 py-4 flex gap-4">
          <a 
            href="https://github.com/ajn404/cesiumTrackMe.git" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary"
            title="GitHub 仓库"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
          </a>
          <a 
            href="https://www.npmjs.com/package/cesium-hooks" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary"
            title="NPM 包"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
              <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z"/>
            </svg>
          </a>
        </div>
      </SidebarContent>
    </ShadcnSidebar>
  )
}   