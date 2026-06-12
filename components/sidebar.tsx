"use client"

import { Truck, LayoutDashboard, ClipboardList, Plus, Bell, Settings, Circle, Menu, X } from "lucide-react"
import { useState } from "react"

type Screen = "dashboard" | "operaciones" | "nueva" | "alertas" | "configuracion" | "detalle" | "alerta"

interface SidebarProps {
  activeScreen: Screen
  onNavigate: (screen: Screen) => void
  onLogout: () => void
}

const navItems = [
  { id: "dashboard" as Screen, label: "Dashboard", icon: LayoutDashboard },
  { id: "operaciones" as Screen, label: "Operaciones", icon: ClipboardList },
  { id: "nueva" as Screen, label: "Nueva Operación", icon: Plus },
  { id: "alertas" as Screen, label: "Alertas", icon: Bell, badge: 2 },
  { id: "configuracion" as Screen, label: "Configuración", icon: Settings },
]

const alertGroup: Screen[] = ["alertas", "alerta"]

function getActiveNav(screen: Screen): Screen {
  if (screen === "detalle") return "operaciones"
  if (alertGroup.includes(screen)) return "alertas"
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
    <div className="flex flex-col h-full" style={{ backgroundColor: "#0f172a" }}>
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)" }}
        >
          <Truck className="w-5 h-5" style={{ color: "#22c55e" }} />
        </div>
        <div>
          <p className="text-base font-bold text-white leading-none">BioTMS</p>
          <p className="text-xs mt-0.5" style={{ color: "#475569" }}>Padwor Group × Starb</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {navItems.map(({ id, label, icon: Icon, badge }) => {
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
                backgroundColor: isActive ? "rgba(34,197,94,0.12)" : "transparent",
                color: isActive ? "#22c55e" : "#64748b",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)"
                if (!isActive) e.currentTarget.style.color = "#94a3b8"
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = "transparent"
                if (!isActive) e.currentTarget.style.color = "#64748b"
              }}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0 w-[18px] h-[18px]" />
              <span className="text-sm font-medium flex-1">{label}</span>
              {badge && (
                <span
                  className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
                  style={{ backgroundColor: "#ef4444", color: "white" }}
                >
                  {badge}
                </span>
              )}
              {isActive && (
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "#22c55e", boxShadow: "0 0 6px #22c55e" }}
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom user info */}
      <div
        className="px-4 py-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
            style={{ backgroundColor: "#1e3a5f" }}
          >
            AP
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">Alejandro Pérez</p>
            <p className="text-xs" style={{ color: "#475569" }}>Supervisor</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Circle className="w-2 h-2 fill-current" style={{ color: "#22c55e" }} />
            <span className="text-xs" style={{ color: "#22c55e" }}>Activo</span>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="mt-3 w-full text-xs py-1.5 rounded-lg transition-all hover:opacity-80 text-center"
          style={{ color: "#475569", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
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
      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-lg lg:hidden"
        style={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className="fixed top-0 left-0 bottom-0 w-64 z-40 lg:hidden transition-transform duration-300"
        style={{ transform: mobileOpen ? "translateX(0)" : "translateX(-100%)" }}
      >
        <SidebarContent
          activeNav={activeNav}
          onNavigate={onNavigate}
          onLogout={onLogout}
          onNavClick={() => setMobileOpen(false)}
        />
      </aside>

      {/* Desktop sidebar */}
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
