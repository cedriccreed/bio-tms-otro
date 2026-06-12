"use client"

import { RefreshCw, CheckCircle, ExternalLink, MapPin, Clock, Satellite, ChevronLeft } from "lucide-react"

interface DetalleOperacionProps {
  operationId?: string
  onNavigate: (screen: string) => void
}

const timelineEvents = [
  { done: true, date: "09 Jun 09:00", text: "Email enviado: UNIDAD RUMBO A PLANTA POR VILLA REGINA" },
  { done: true, date: "09 Jun 18:00", text: "Email enviado: UNIDAD RUMBO A PLANTA POR CUTRAL CO" },
  { done: true, date: "10 Jun 09:00", text: "Email enviado: UNIDAD RUMBO A PLANTA POR POMONA" },
  { done: true, date: "10 Jun 18:00", text: "Email enviado: UNIDAD EN PLANTA" },
  { done: true, date: "11 Jun 09:00", text: "Email enviado: FULL EN PLANTA A LA ESPERA DE DOCUMENTACIÓN" },
  { done: false, date: "11 Jun 18:00", text: "Próximo envío programado" },
]

const opData = [
  { label: "POL", value: "Coronel" },
  { label: "POD", value: "New York" },
  { label: "Buque", value: "MSC Rayshmi" },
  { label: "Placa", value: "AA-BB-11" },
  { label: "Chofer", value: "Juan Pérez" },
  { label: "Contenedor", value: "MSCU1234567" },
  { label: "Naviera", value: "MSC" },
  { label: "Booking", value: "BK-98765" },
]

export default function DetalleOperacionScreen({ operationId = "EXM4632-25", onNavigate }: DetalleOperacionProps) {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-1 text-xs transition-all hover:opacity-80"
          style={{ color: "#64748b" }}
        >
          <ChevronLeft className="w-4 h-4" />
          Dashboard
        </button>
        <span style={{ color: "#334155" }}>/</span>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white">{operationId} — IBERCONSA</h1>
            <span
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: "rgba(234,179,8,0.12)", color: "#eab308", border: "1px solid rgba(234,179,8,0.25)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              EN TRÁNSITO
            </span>
          </div>
        </div>
      </div>

      {/* Operation data cards */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#475569" }}>
          Datos de la Operación
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {opData.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-xs" style={{ color: "#475569" }}>{label}</span>
              <span className="text-sm font-semibold text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content: timeline + GPS */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Timeline */}
        <div
          className="lg:col-span-3 rounded-xl p-5"
          style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h2 className="text-sm font-semibold text-white mb-5">Historial de Eventos</h2>
          <div className="relative flex flex-col gap-0">
            {/* Vertical line */}
            <div
              className="absolute left-3.5 top-3 bottom-8 w-px"
              style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
            />
            {timelineEvents.map((event, i) => (
              <div key={i} className="flex items-start gap-4 pb-5 last:pb-0 relative">
                {/* Dot */}
                <div
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center z-10"
                  style={{
                    backgroundColor: event.done ? "rgba(34,197,94,0.15)" : "rgba(59,130,246,0.12)",
                    border: `1px solid ${event.done ? "rgba(34,197,94,0.4)" : "rgba(59,130,246,0.3)"}`,
                  }}
                >
                  {event.done ? (
                    <CheckCircle className="w-3.5 h-3.5" style={{ color: "#22c55e" }} />
                  ) : (
                    <RefreshCw className="w-3 h-3 animate-spin" style={{ color: "#60a5fa" }} />
                  )}
                </div>
                <div className="flex flex-col gap-0.5 pt-0.5">
                  <span className="text-xs font-mono" style={{ color: "#475569" }}>{event.date}</span>
                  <span className="text-sm" style={{ color: event.done ? "#cbd5e1" : "#60a5fa" }}>
                    {event.text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GPS Info */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div
            className="rounded-xl p-5 flex flex-col gap-4"
            style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <h2 className="text-sm font-semibold text-white">Información GPS</h2>

            <div className="flex flex-col gap-3">
              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ backgroundColor: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(34,197,94,0.12)" }}
                >
                  <MapPin className="w-4 h-4" style={{ color: "#22c55e" }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: "#64748b" }}>Posición actual</p>
                  <p className="text-sm font-semibold text-white">Cutral Co, Neuquén</p>
                </div>
              </div>

              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(59,130,246,0.1)" }}
                >
                  <Clock className="w-4 h-4" style={{ color: "#60a5fa" }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: "#64748b" }}>Última actualización</p>
                  <p className="text-sm font-semibold text-white">hace 3 minutos</p>
                </div>
              </div>

              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(34,197,94,0.1)" }}
                >
                  <Satellite className="w-4 h-4" style={{ color: "#22c55e" }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: "#64748b" }}>Plataforma</p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-white">BioGPS</p>
                    <CheckCircle className="w-3.5 h-3.5" style={{ color: "#22c55e" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Mini map placeholder */}
            <div
              className="rounded-lg h-32 flex items-center justify-center"
              style={{ backgroundColor: "#0f1f3d", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex flex-col items-center gap-1.5">
                <MapPin className="w-5 h-5" style={{ color: "#334155" }} />
                <span className="text-xs" style={{ color: "#334155" }}>Mapa BioGPS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div
        className="rounded-xl p-4 flex flex-wrap items-center gap-3"
        style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" }}
        >
          <RefreshCw className="w-4 h-4" />
          Reenviar Status Ahora
        </button>
        <button
          onClick={() => onNavigate("alerta")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: "#22c55e", color: "#0a1628" }}
        >
          <CheckCircle className="w-4 h-4" />
          Confirmar Entrega
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-80 ml-auto"
          style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <ExternalLink className="w-4 h-4" />
          Ver Hilo Gmail
        </button>
      </div>
    </div>
  )
}
