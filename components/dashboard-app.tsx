"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { OPERATIONS_MOCK, type Operation } from "@/lib/mock-data"
import Sidebar from "./sidebar"
import DashboardScreen from "./dashboard-screen"
import OperacionesScreen from "./operaciones-screen"
import NuevaOperacionScreen from "./nueva-operacion-screen"
import DetalleOperacionScreen from "./detalle-operacion-screen"
import AlertaScreen from "./alerta-screen"
import ConfiguracionScreen from "./configuracion-screen"
import VehiculosScreen from "./vehiculos-screen"
import MantenimientosScreen from "./mantenimientos-screen"
import ConductoresScreen from "./conductores-screen"
import SeguimientoScreen from "./seguimiento-screen"

type Screen = "dashboard" | "operaciones" | "seguimiento" | "vehiculos" | "conductores" | "mantenimientos" | "nueva" | "configuracion" | "detalle" | "alerta"

interface DashboardAppProps {
  onLogout: () => void
}

export default function DashboardApp({ onLogout }: DashboardAppProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard")
  const [selectedOpId, setSelectedOpId] = useState<string>("OP-001")
  const [operations, setOperations] = useState<Operation[]>(
    OPERATIONS_MOCK.map((op) => ({ ...op }))
  )

  const handleNavigate = (screen: string, opId?: string) => {
    if (opId) setSelectedOpId(opId)
    setCurrentScreen(screen as Screen)
  }

  const screenTitles: Record<Screen, string> = {
    dashboard: "Dashboard",
    operaciones: "Operaciones",
    seguimiento: "Seguimiento",
    vehiculos: "Vehículos",
    conductores: "Conductores",
    mantenimientos: "Mantenimientos",
    nueva: "Nueva Operación",
    configuracion: "Configuración",
    detalle: "Detalle Operación",
    alerta: "Alerta Zona Final",
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "dashboard":
        return <DashboardScreen operations={operations} onNavigate={handleNavigate} />
      case "operaciones":
        return (
          <OperacionesScreen
            operations={operations}
            onUpdateOperations={setOperations}
            onNavigate={handleNavigate}
          />
        )
      case "seguimiento":
        return <SeguimientoScreen onNavigate={handleNavigate} />
      case "vehiculos":
        return <VehiculosScreen />
      case "conductores":
        return <ConductoresScreen onNavigate={handleNavigate} />
      case "mantenimientos":
        return <MantenimientosScreen onNavigate={handleNavigate} />
      case "nueva":
        return (
          <NuevaOperacionScreen
            operationsCount={operations.length}
            onNavigate={handleNavigate}
            onCrearOperacion={(op) => {
              setOperations((prev) => [...prev, op])
              handleNavigate("operaciones")
            }}
          />
        )
      case "detalle":
        return <DetalleOperacionScreen operationId={selectedOpId} onNavigate={handleNavigate} />
      case "alerta":
        return <AlertaScreen onNavigate={handleNavigate} />
      case "configuracion":
        return <ConfiguracionScreen />
      default:
        return <DashboardScreen operations={operations} onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      <Sidebar
        activeScreen={currentScreen}
        onNavigate={(screen) => handleNavigate(screen)}
        onLogout={onLogout}
      />

      {/* Main content */}
      <main className="flex-1 overflow-auto min-h-screen" style={{ backgroundColor: "#ffffff" }}>
        {/* Top bar */}
        <div
          className="sticky top-0 z-30 flex items-center px-6 h-14 lg:px-6 pl-16 lg:pl-6"
          style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e5e7eb" }}
        >
          <h2 className="text-sm font-semibold text-gray-900">
            {screenTitles[currentScreen]}
          </h2>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleNavigate("alerta")}
              className="relative flex items-center justify-center w-9 h-9 rounded-full transition-all hover:opacity-80"
              style={{
                backgroundColor: "rgba(0,0,0,0.04)",
                border: "1px solid rgba(0,0,0,0.08)",
                color: "#16a34a",
              }}
              aria-label="Alertas"
            >
              <Bell className="w-4 h-4" />
              <span
                className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold"
                style={{ backgroundColor: "#dc2626", color: "white" }}
              >
                2
              </span>
            </button>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
              style={{ backgroundColor: "rgba(0,0,0,0.04)", color: "#16a34a", border: "1px solid rgba(0,0,0,0.08)" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: "#16a34a" }}
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
