"use client"

import { useState } from "react"
import { Activity, Mail, Truck, AlertTriangle, Eye, RefreshCw, CheckCircle } from "lucide-react"

interface DashboardScreenProps {
  onNavigate: (screen: string, opId?: string) => void
}

const operations = [
  {
    id: "EXM4632-25",
    shipper: "IBERCONSA",
    placa: "AA-BB-11",
    status: "RUMBO A PLANTA POR CUTRAL CO",
    statusColor: "#eab308",
    statusDot: "yellow",
    lastEmail: "Hoy 09:00",
    hasConfirm: false,
  },
  {
    id: "EXM4633-25",
    shipper: "FRUTAS DEL SUR",
    placa: "CC-DD-22",
    status: "FULL EN PLANTA",
    statusColor: "#22c55e",
    statusDot: "green",
    lastEmail: "Hoy 09:00",
    hasConfirm: false,
  },
  {
    id: "EXM4634-25",
    shipper: "EXPORTADORA XYZ",
    placa: "EE-FF-33",
    status: "Sin señal GPS +2h",
    statusColor: "#ef4444",
    statusDot: "red",
    lastEmail: "Pendiente",
    hasConfirm: false,
  },
  {
    id: "EXM4635-25",
    shipper: "AGRO PATAGONIA",
    placa: "GG-HH-44",
    status: "LLEGANDO A ZONA FINAL",
    statusColor: "#f97316",
    statusDot: "orange",
    lastEmail: "Hace 30 min",
    hasConfirm: true,
  },
  {
    id: "EXM4636-25",
    shipper: "CITRUS EXPORT",
    placa: "II-JJ-55",
    status: "FULL RUMBO A FRONTERA POR LONQUIMAY",
    statusColor: "#eab308",
    statusDot: "yellow",
    lastEmail: "Hoy 09:00",
    hasConfirm: false,
  },
]

const dotColors: Record<string, string> = {
  yellow: "#eab308",
  green: "#22c55e",
  red: "#ef4444",
  orange: "#f97316",
}

export default function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  const [resendingId, setResendingId] = useState<string | null>(null)

  const handleResend = (opId: string) => {
    setResendingId(opId)
    setTimeout(() => setResendingId(null), 1500)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">TMS — Panel de Operaciones</h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>Resumen en tiempo real del sistema de tracking terrestre</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Activity, label: "Operaciones Activas", value: "12", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
          { icon: Mail, label: "Emails Enviados Hoy", value: "8", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
          { icon: Truck, label: "Camiones En Ruta", value: "9", color: "#eab308", bg: "rgba(234,179,8,0.1)" },
          { icon: AlertTriangle, label: "Alertas Pendientes", value: "2", color: "#ef4444", bg: "rgba(239,68,68,0.1)", badge: true },
        ].map(({ icon: Icon, label, value, color, bg, badge }) => (
          <div
            key={label}
            className="rounded-xl p-4 flex items-center gap-4"
            style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0" style={{ backgroundColor: bg }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{value}</span>
                {badge && (
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#ef4444", color: "white" }}>
                    !
                  </span>
                )}
              </div>
              <p className="text-xs" style={{ color: "#64748b" }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Alert banner */}
      <div
        className="rounded-xl p-4 flex items-center justify-between gap-4"
        style={{ backgroundColor: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🚨</span>
          <div>
            <span className="font-semibold text-sm" style={{ color: "#fb923c" }}>
              EXM4635-25 — Camión GG-HH-44 llegando a Puerto Coronel
            </span>
            <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>Detectado hace 8 minutos · Puerto Coronel</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate("alerta")}
          className="flex-shrink-0 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
          style={{ backgroundColor: "#f97316", color: "white" }}
        >
          Ver Alerta
        </button>
      </div>

      {/* Operations table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <h2 className="text-sm font-semibold text-white">Operaciones Activas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "rgba(15,31,61,0.5)" }}>
                {["OP / EXM", "SHIPPER", "PLACA", "STATUS ACTUAL", "ÚLTIMO EMAIL", "ACCIONES"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#475569" }}>
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
                    borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : undefined,
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-mono font-semibold" style={{ color: "#38bdf8" }}>
                      {op.id}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-white">{op.shipper}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-mono" style={{ color: "#94a3b8" }}>{op.placa}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: dotColors[op.statusDot], boxShadow: `0 0 6px ${dotColors[op.statusDot]}80` }}
                      />
                      <span className="text-xs font-medium" style={{ color: op.statusColor }}>
                        {op.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs" style={{ color: "#64748b" }}>{op.lastEmail}</span>
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
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                          style={{ backgroundColor: "#22c55e", color: "#0a1628" }}
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
                          style={{ backgroundColor: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" }}
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
                        style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }}
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
