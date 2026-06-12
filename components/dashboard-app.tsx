"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import Sidebar from "./sidebar"
import DashboardScreen from "./dashboard-screen"
import NuevaOperacionScreen from "./nueva-operacion-screen"
import DetalleOperacionScreen from "./detalle-operacion-screen"
import AlertaScreen from "./alerta-screen"
import ConfiguracionScreen from "./configuracion-screen"
import VehiculosScreen from "./vehiculos-screen"

type Screen = "dashboard" | "operaciones" | "vehiculos" | "nueva" | "configuracion" | "detalle" | "alerta"

interface DashboardAppProps {
  onLogout: () => void
}

export default function DashboardApp({ onLogout }: DashboardAppProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard")
  const [selectedOpId, setSelectedOpId] = useState<string>("EXM4632-25")

  const handleNavigate = (screen: string, opId?: string) => {
    if (opId) setSelectedOpId(opId)
    setCurrentScreen(screen as Screen)
  }

  const screenTitles: Record<Screen, string> = {
    dashboard: "Dashboard",
    operaciones: "Operaciones",
    vehiculos: "Vehículos",
    nueva: "Nueva Operación",
    configuracion: "Configuración",
    detalle: "Detalle Operación",
    alerta: "Alerta Zona Final",
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "dashboard":
      case "operaciones":
        return <DashboardScreen onNavigate={handleNavigate} />
      case "vehiculos":
        return <VehiculosScreen />
      case "nueva":
        return <NuevaOperacionScreen onNavigate={handleNavigate} />
      case "detalle":
        return <DetalleOperacionScreen operationId={selectedOpId} onNavigate={handleNavigate} />
      case "alerta":
        return <AlertaScreen onNavigate={handleNavigate} />
      case "configuracion":
        return <ConfiguracionScreen />
      default:
        return <DashboardScreen onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#0d1b2e" }}>
      <Sidebar
        activeScreen={currentScreen}
        onNavigate={(screen) => handleNavigate(screen)}
        onLogout={onLogout}
      />

      {/* Main content */}
      <main className="flex-1 overflow-auto min-h-screen" style={{ backgroundColor: "#0d1b2e" }}>
        {/* Top bar */}
        <div
          className="sticky top-0 z-30 flex items-center px-6 h-14 lg:px-6 pl-16 lg:pl-6"
          style={{ backgroundColor: "rgba(13,27,46,0.95)", borderBottom: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(10px)" }}
        >
          <h2 className="text-sm font-semibold" style={{ color: "#94a3b8" }}>
            {screenTitles[currentScreen]}
          </h2>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleNavigate("alerta")}
              className="relative flex items-center justify-center w-9 h-9 rounded-full transition-all hover:opacity-80"
              style={{
                backgroundColor: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.15)",
                color: "#22c55e",
              }}
              aria-label="Alertas"
            >
              <Bell className="w-4 h-4" />
              <span
                className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold"
                style={{ backgroundColor: "#ef4444", color: "white" }}
              >
                2
              </span>
            </button>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
              style={{ backgroundColor: "rgba(34,197,94,0.08)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.15)" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: "#22c55e" }}
              />
              Sistema Activo
            </div>
          </div>
        </div>

        {/* Screen content */}
        <div className="min-h-[calc(100vh-56px)]">
          {renderScreen()}
        </div>
      </main>
    </div>
  )
}
