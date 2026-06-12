"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Clock } from "lucide-react"

const geocercas = [
  { name: "PLANTA_POMONA", status: "UNIDAD RUMBO A PLANTA POR POMONA", platform: "BioGPS" },
  { name: "PLANTA_CUTRALCO", status: "UNIDAD RUMBO A PLANTA POR CUTRAL CO", platform: "BioGPS" },
  { name: "FRONTERA_LONQUIMAY", status: "FULL RUMBO A FRONTERA POR LONQUIMAY", platform: "CUSat" },
  { name: "FRONTERA_VILLAREGINA", status: "FULL RUMBO A FRONTERA POR VILLA REGINA", platform: "BioGPS" },
  { name: "PUERTO_CORONEL", status: "UNIDAD ENTREGADA A LA TERMINAL", platform: "BioGPS" },
  { name: "PUERTO_SANANTONIO", status: "UNIDAD ENTREGADA A LA TERMINAL", platform: "BioGPS" },
]

const destinatarios = [
  { client: "IBERCONSA", emails: "jessica@padwor.com, ale@starb.cl (+2)", updated: "01 jun 2026" },
  { client: "FRUTAS DEL SUR", emails: "ops@frutasdelsur.com (+1)", updated: "15 may 2026" },
  { client: "AGRO PATAGONIA", emails: "contacto@agropatagonia.com (+3)", updated: "20 may 2026" },
]

const platformColors: Record<string, { bg: string; color: string; border: string }> = {
  BioGPS: { bg: "rgba(34,197,94,0.1)", color: "#22c55e", border: "rgba(34,197,94,0.2)" },
  CUSat: { bg: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "rgba(59,130,246,0.2)" },
}

type Tab = "geocercas" | "destinatarios" | "horarios"

export default function ConfiguracionScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("geocercas")

  const tabs: { id: Tab; label: string }[] = [
    { id: "geocercas", label: "Geocercas" },
    { id: "destinatarios", label: "Destinatarios" },
    { id: "horarios", label: "Horarios" },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Configuración del Sistema</h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>Gestión de geocercas, destinatarios y horarios de notificaciones</p>
      </div>

      {/* Tab bar */}
      <div
        className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ backgroundColor: "#0f1f3d", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: activeTab === tab.id ? "#22c55e" : "transparent",
              color: activeTab === tab.id ? "#0a1628" : "#64748b",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "geocercas" && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <h2 className="text-sm font-semibold text-white">Geocercas configuradas</h2>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: "#22c55e", color: "#0a1628" }}
            >
              <Plus className="w-3.5 h-3.5" />
              Agregar Geocerca
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "rgba(15,31,61,0.5)" }}>
                  {["GEOCERCA", "STATUS QUE GENERA", "PLATAFORMA", "ACCIONES"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#475569" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {geocercas.map((g, i) => (
                  <tr
                    key={g.name}
                    style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : undefined }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    className="transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-mono font-semibold" style={{ color: "#38bdf8" }}>{g.name}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm" style={{ color: "#94a3b8" }}>{g.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: platformColors[g.platform]?.bg,
                          color: platformColors[g.platform]?.color,
                          border: `1px solid ${platformColors[g.platform]?.border}`,
                        }}
                      >
                        {g.platform}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                          style={{ backgroundColor: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" }}
                        >
                          <Pencil className="w-3 h-3" /> Editar
                        </button>
                        <button
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                          style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}
                        >
                          <Trash2 className="w-3 h-3" /> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "destinatarios" && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <h2 className="text-sm font-semibold text-white">Destinatarios por cliente</h2>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: "#22c55e", color: "#0a1628" }}
            >
              <Plus className="w-3.5 h-3.5" />
              Agregar Cliente
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "rgba(15,31,61,0.5)" }}>
                  {["CLIENTE", "EMAILS", "ÚLTIMA ACTUALIZACIÓN", "ACCIONES"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#475569" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {destinatarios.map((d, i) => (
                  <tr
                    key={d.client}
                    style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : undefined }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    className="transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-semibold text-white">{d.client}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm" style={{ color: "#94a3b8" }}>{d.emails}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm" style={{ color: "#64748b" }}>{d.updated}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                        style={{ backgroundColor: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" }}
                      >
                        <Pencil className="w-3 h-3" /> Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "horarios" && (
        <div className="flex flex-col gap-4 max-w-md">
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(34,197,94,0.1)" }}
              >
                <Clock className="w-5 h-5" style={{ color: "#22c55e" }} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Horarios por defecto</h2>
                <p className="text-xs" style={{ color: "#64748b" }}>Se aplica a todas las operaciones sin configuración específica</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-sm" style={{ color: "#94a3b8" }}>Frecuencia</span>
                <span className="text-sm font-semibold text-white">2 veces al día</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-sm" style={{ color: "#94a3b8" }}>Horario 1</span>
                <span className="text-sm font-mono font-semibold" style={{ color: "#22c55e" }}>09:00 AM</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-sm" style={{ color: "#94a3b8" }}>Horario 2</span>
                <span className="text-sm font-mono font-semibold" style={{ color: "#22c55e" }}>06:00 PM</span>
              </div>
            </div>

            <button
              className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
              style={{ backgroundColor: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}
            >
              <Pencil className="w-4 h-4" />
              Editar horarios globales
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
