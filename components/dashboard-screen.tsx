"use client"

import { useMemo, useState } from "react"
import { Activity, Mail, Truck, AlertTriangle, Eye, RefreshCw, CheckCircle, BarChart3, Route, MapPinned } from "lucide-react"
import { CONDUCTOR_NOMBRES, VEHICULO_PLACAS, type Operation } from "@/lib/mock-data"

interface DashboardScreenProps {
  onNavigate: (screen: string, opId?: string) => void
  operations: Operation[]
}

const dotColors: Record<string, string> = {
  yellow: "#ca8a04",
  green: "#16a34a",
  red: "#dc2626",
  orange: "#ea580c",
}

function mostFrequent(items: Operation[], key: "ruta" | "placa"): string {
  if (items.length === 0) return "—"
  const counts = new Map<string, number>()
  for (const item of items) {
    const value = item[key]
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  let best = "—"
  let bestCount = 0
  for (const [value, count] of counts) {
    if (count > bestCount) {
      best = value
      bestCount = count
    }
  }
  return best
}

export default function DashboardScreen({ onNavigate, operations }: DashboardScreenProps) {
  const [resendingId, setResendingId] = useState<string | null>(null)
  const [filtroVehiculo, setFiltroVehiculo] = useState("Todos")
  const [filtroConductor, setFiltroConductor] = useState("Todos")
  const [filtroRuta, setFiltroRuta] = useState("Todas")

  const rutasUnicas = useMemo(
    () => [...new Set(operations.map((op) => op.ruta))].sort(),
    [operations]
  )

  const opsFiltradas = useMemo(
    () =>
      operations.filter((op) => {
        if (filtroVehiculo !== "Todos" && op.placa !== filtroVehiculo) return false
        if (filtroConductor !== "Todos" && op.conductor !== filtroConductor) return false
        if (filtroRuta !== "Todas" && op.ruta !== filtroRuta) return false
        return true
      }),
    [operations, filtroVehiculo, filtroConductor, filtroRuta]
  )

  const totalViajes = opsFiltradas.length
  const kmTotales = opsFiltradas.reduce((sum, op) => sum + op.kmRecorridos, 0)
  const rutaMasUsada = mostFrequent(opsFiltradas, "ruta")
  const vehiculoMasUsado = mostFrequent(opsFiltradas, "placa")

  const vehiculosConteo = useMemo(() => {
    const map = new Map<string, number>()
    for (const op of opsFiltradas) {
      map.set(op.placa, (map.get(op.placa) ?? 0) + 1)
    }
    return Array.from(map.entries())
      .map(([placa, count]) => ({ placa, count }))
      .sort((a, b) => b.count - a.count)
  }, [opsFiltradas])

  const maxCount = Math.max(...vehiculosConteo.map((v) => v.count), 1)

  const handleResend = (opId: string) => {
    setResendingId(opId)
    setTimeout(() => setResendingId(null), 1500)
  }

  const alertOp = operations.find((op) => op.hasConfirm)
  const enRuta = operations.filter((op) => op.estado === "En Ruta").length
  const alertasPendientes = operations.filter((op) => op.hasConfirm).length

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">TMS — Panel de Operaciones</h1>
        <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>Resumen en tiempo real del sistema de tracking terrestre</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Activity, label: "Operaciones Activas", value: String(operations.length), color: "#16a34a", bg: "rgba(0,0,0,0.06)" },
          { icon: Mail, label: "Emails Enviados Hoy", value: "8", color: "#2563eb", bg: "rgba(59,130,246,0.1)" },
          { icon: Truck, label: "Camiones En Ruta", value: String(enRuta), color: "#ca8a04", bg: "rgba(234,179,8,0.1)" },
          { icon: AlertTriangle, label: "Alertas Pendientes", value: String(alertasPendientes), color: "#dc2626", bg: "rgba(239,68,68,0.1)", badge: alertasPendientes > 0 },
        ].map(({ icon: Icon, label, value, color, bg, badge }) => (
          <div
            key={label}
            className="rounded-xl p-4 flex items-center gap-4"
            style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0" style={{ backgroundColor: bg }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                {badge && (
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#dc2626", color: "white" }}>
                    !
                  </span>
                )}
              </div>
              <p className="text-xs" style={{ color: "#9ca3af" }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Inteligencia de Negocio */}
      <div
        className="rounded-xl p-5 flex flex-col gap-5"
        style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
      >
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Inteligencia de Negocio</h2>
          <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>
            Análisis de operaciones por vehículo, conductor y ruta
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: "#6b7280" }}>
              Filtrar por Vehículo
            </label>
            <select
              value={filtroVehiculo}
              onChange={(e) => setFiltroVehiculo(e.target.value)}
              className="px-3 py-2.5 rounded-lg text-sm text-gray-900 outline-none cursor-pointer"
              style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
            >
              <option value="Todos">Todos</option>
              {VEHICULO_PLACAS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: "#6b7280" }}>
              Filtrar por Conductor
            </label>
            <select
              value={filtroConductor}
              onChange={(e) => setFiltroConductor(e.target.value)}
              className="px-3 py-2.5 rounded-lg text-sm text-gray-900 outline-none cursor-pointer"
              style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
            >
              <option value="Todos">Todos</option>
              {CONDUCTOR_NOMBRES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: "#6b7280" }}>
              Filtrar por Ruta
            </label>
            <select
              value={filtroRuta}
              onChange={(e) => setFiltroRuta(e.target.value)}
              className="px-3 py-2.5 rounded-lg text-sm text-gray-900 outline-none cursor-pointer"
              style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
            >
              <option value="Todas">Todas</option>
              {rutasUnicas.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BarChart3, label: "Total viajes", value: String(totalViajes) },
            { icon: Route, label: "Km totales recorridos", value: kmTotales.toLocaleString("es-CL") },
            { icon: MapPinned, label: "Ruta más utilizada", value: rutaMasUsada, small: true },
            { icon: Truck, label: "Vehículo más utilizado", value: vehiculoMasUsado, mono: true },
          ].map(({ icon: Icon, label, value, small, mono }) => (
            <div
              key={label}
              className="rounded-xl p-4"
              style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4" style={{ color: "#6b7280" }} />
                <p className="text-xs" style={{ color: "#9ca3af" }}>
                  {label}
                </p>
              </div>
              <p
                className={`font-bold text-gray-900 ${small ? "text-xs leading-snug" : "text-xl"} ${mono ? "font-mono" : ""}`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {vehiculosConteo.length > 0 && (
          <div className="flex flex-col gap-3 pt-1">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#9ca3af" }}>
              Operaciones por vehículo
            </p>
            {vehiculosConteo.map((v) => (
              <div key={v.placa} className="flex items-center gap-3">
                <span className="text-xs font-mono w-16">{v.placa}</span>
                <div className="flex-1 h-2 rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-black"
                    style={{ width: `${(v.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-8">{v.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {alertOp && (
        <div
          className="rounded-xl p-4 flex items-center justify-between gap-4"
          style={{ backgroundColor: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🚨</span>
            <div>
              <span className="font-semibold text-sm" style={{ color: "#ea580c" }}>
                {alertOp.id} — Camión {alertOp.placa} llegando a La Serena
              </span>
              <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
                {alertOp.ruta} · Detectado hace 8 minutos
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("alerta")}
            className="flex-shrink-0 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: "#ea580c", color: "white" }}
          >
            Ver Alerta
          </button>
        </div>
      )}

      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: "#e5e7eb" }}>
          <h2 className="text-sm font-semibold text-gray-900">Operaciones Activas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#f9fafb" }}>
                {["OP", "CLIENTE", "PLACA", "RUTA", "STATUS", "ÚLTIMO EMAIL", "ACCIONES"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#9ca3af" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {operations.map((op, i) => (
                <tr
                  key={op.id}
                  className="transition-colors cursor-pointer"
                  style={{
                    borderTop: i > 0 ? "1px solid #f3f4f6" : undefined,
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-mono font-semibold" style={{ color: "#111827" }}>
                      {op.id}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-gray-900">{op.shipper}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-mono" style={{ color: "#6b7280" }}>{op.placa}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs" style={{ color: "#6b7280" }}>{op.ruta}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: dotColors[op.statusDot] }}
                      />
                      <span className="text-xs font-medium" style={{ color: op.statusColor }}>
                        {op.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs" style={{ color: "#9ca3af" }}>{op.lastEmail}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {op.hasConfirm ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onNavigate("alerta")
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 text-white"
                          style={{ backgroundColor: "#000000", color: "#ffffff" }}
                        >
                          <CheckCircle className="w-3 h-3" />
                          Confirmar Entrega
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleResend(op.id)
                          }}
                          disabled={resendingId === op.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80 disabled:opacity-60"
                          style={{ backgroundColor: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }}
                        >
                          <RefreshCw className={`w-3 h-3 ${resendingId === op.id ? "animate-spin" : ""}`} />
                          Reenviar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onNavigate("detalle", op.id)
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                        style={{ backgroundColor: "#f3f4f6", color: "#6b7280", border: "1px solid #e5e7eb" }}
                      >
                        <Eye className="w-3 h-3" />
                        Ver
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
