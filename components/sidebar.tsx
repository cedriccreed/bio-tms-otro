"use client"

import { Truck, LayoutDashboard, ClipboardList, Plus, Settings, Circle, Menu, X, Wrench, Users, MapPin, Fuel, FileText } from "lucide-react"
import { useState } from "react"

type Screen = "dashboard" | "operaciones" | "seguimiento" | "vehiculos" | "conductores" | "documentacion" | "mantenimientos" | "combustible" | "nueva" | "configuracion" | "detalle" | "alerta"

interface SidebarProps {
  activeScreen: Screen
  onNavigate: (screen: Screen) => void
  onLogout: () => void
}

const navItems = [
  { id: "dashboard" as Screen, label: "Dashboard", icon: LayoutDashboard },
  { id: "nueva" as Screen, label: "Nueva Operación", icon: Plus },
  { id: "operaciones" as Screen, label: "Operaciones", icon: ClipboardList },
  { id: "seguimiento" as Screen, label: "Seguimiento", icon: MapPin },
  { id: "vehiculos" as Screen, label: "Vehículos", icon: Truck },
  { id: "conductores" as Screen, label: "Conductores", icon: Users },
  { id: "mantenimientos" as Screen, label: "Mantenimientos", icon: Wrench },
  { id: "combustible" as Screen, label: "Combustible", icon: Fuel },
  { id: "documentacion" as Screen, label: "Documentación", icon: FileText },
  { id: "configuracion" as Screen, label: "Configuración", icon: Settings },
]

function getActiveNav(screen: Screen): Screen {
  if (screen === "detalle") return "operaciones"
  return screen
}

interface SidebarContentProps {
  activeNav: Screen
  onNavigate: (screen: Screen) => void
  onLogout: () => void
  onNavClick: () => void
}

function SidebarContent({ activeNav, onNavigate, onLogout, onNavClick }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full bg-white border-r border-[#e5e7eb]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#e5e7eb]">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-black">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-base font-bold text-gray-900 leading-none">TMS</p>
          <p className="text-xs mt-0.5 text-[#9ca3af]">Sistema de Gestión</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeNav === id
          return (
            <button
              key={id}
              onClick={() => {
                onNavigate(id)
                onNavClick()
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left transition-all"
              style={{
                backgroundColor: isActive ? "#000000" : "transparent",
                color: isActive ? "#ffffff" : "#6b7280",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "#f3f4f6"
                  e.currentTarget.style.color = "#111827"
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent"
                  e.currentTarget.style.color = "#6b7280"
                }
              }}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0 w-[18px] h-[18px]" />
              <span className="text-sm font-medium flex-1">{label}</span>
            </button>
          )
        })}
      </nav>

      {/* Bottom user info */}
      <div className="px-4 py-4 border-t border-[#e5e7eb]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white bg-black">
            AP
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate">Alejandro Pérez</p>
            <p className="text-xs text-[#9ca3af]">Supervisor</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Circle className="w-2 h-2 fill-current text-[#16a34a]" />
            <span className="text-xs text-[#16a34a]">Activo</span>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="mt-3 w-full text-xs py-1.5 rounded-lg transition-all hover:opacity-80 text-center text-[#6b7280] bg-[#f3f4f6] border border-[#e5e7eb]"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

export default function Sidebar({ activeScreen, onNavigate, onLogout }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeNav = getActiveNav(activeScreen)

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-lg lg:hidden bg-white border border-[#e5e7eb] text-gray-900"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className="fixed top-0 left-0 bottom-0 w-64 z-40 lg:hidden transition-transform duration-300 bg-white"
        style={{ transform: mobileOpen ? "translateX(0)" : "translateX(-100%)" }}
      >
        <SidebarContent
          activeNav={activeNav}
          onNavigate={onNavigate}
          onLogout={onLogout}
          onNavClick={() => setMobileOpen(false)}
        />
      </aside>

      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 h-screen sticky top-0">
        <SidebarContent
          activeNav={activeNav}
          onNavigate={onNavigate}
          onLogout={onLogout}
          onNavClick={() => setMobileOpen(false)}
        />
      </aside>
    </>
  )
}
