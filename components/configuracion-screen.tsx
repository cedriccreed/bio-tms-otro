"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Clock } from "lucide-react"

const geocercas = [
  { name: "ZONA_SAN_ANTONIO", status: "UNIDAD SALIÓ DE SAN ANTONIO", platform: "BioGPS" },
  { name: "RUTA5_CURANILAHUE", status: "UNIDAD EN RUTA 5 SUR — ZONA CURANILAHUE", platform: "BioGPS" },
  { name: "RUTA5_CHILLAN", status: "UNIDAD EN RUTA 5 SUR — ZONA CHILLÁN", platform: "BioGPS" },
  { name: "ZONA_LINARES", status: "UNIDAD LLEGANDO A LINARES", platform: "BioGPS" },
  { name: "ZONA_LA_SERENA", status: "UNIDAD EN ZONA DE ENTREGA LA SERENA", platform: "BioGPS" },
  { name: "ZONA_SANTIAGO", status: "UNIDAD EN ZONA DE DESCARGA SANTIAGO", platform: "BioGPS" },
]

const destinatarios = [
  { client: "Distribuidora Maule Sur", emails: "contacto@maulesur.cl, operaciones@maulesur.cl (+1)", updated: "01 jun 2026" },
  { client: "Agroexport Valparaíso", emails: "ops@agroexportvp.cl (+1)", updated: "15 may 2026" },
  { client: "Minera Atacama Logistics", emails: "despacho@mineraatacama.cl (+3)", updated: "20 may 2026" },
]

const platformColors: Record<string, { bg: string; color: string; border: string }> = {
  BioGPS: { bg: "rgba(0,0,0,0.06)", color: "#16a34a", border: "rgba(0,0,0,0.15)" },
  CUSat: { bg: "rgba(59,130,246,0.1)", color: "#2563eb", border: "rgba(59,130,246,0.2)" },
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
        <h1 className="text-xl font-bold text-gray-900">Configuración del Sistema</h1>
        <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>Gestión de geocercas, destinatarios y horarios de notificaciones</p>
      </div>

      {/* Tab bar */}
      <div
        className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: activeTab === tab.id ? "#000000" : "transparent",
              color: activeTab === tab.id ? "#ffffff" : "#6b7280",
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
          style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
        >
          <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: "#e5e7eb" }}>
            <h2 className="text-sm font-semibold text-gray-900">Geocercas configuradas</h2>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 text-white"
              style={{ backgroundColor: "#000000", color: "#ffffff" }}
            >
              <Plus className="w-3.5 h-3.5" />
              Agregar Geocerca
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "#f9fafb" }}>
                  {["GEOCERCA", "STATUS QUE GENERA", "PLATAFORMA", "ACCIONES"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#9ca3af" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {geocercas.map((g, i) => (
                  <tr
                    key={g.name}
                    style={{ borderTop: i > 0 ? "1px solid #f3f4f6" : undefined }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    className="transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-mono font-semibold" style={{ color: "#111827" }}>{g.name}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm" style={{ color: "#6b7280" }}>{g.status}</span>
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
                          style={{ backgroundColor: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }}
                        >
                          <Pencil className="w-3 h-3" /> Editar
                        </button>
                        <button
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                          style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#dc2626", border: "1px solid rgba(239,68,68,0.2)" }}
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
          style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
        >
          <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: "#e5e7eb" }}>
            <h2 className="text-sm font-semibold text-gray-900">Destinatarios por cliente</h2>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 text-white"
              style={{ backgroundColor: "#000000", color: "#ffffff" }}
            >
              <Plus className="w-3.5 h-3.5" />
              Agregar Cliente
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "#f9fafb" }}>
                  {["CLIENTE", "EMAILS", "ÚLTIMA ACTUALIZACIÓN", "ACCIONES"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#9ca3af" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {destinatarios.map((d, i) => (
                  <tr
                    key={d.client}
                    style={{ borderTop: i > 0 ? "1px solid #f3f4f6" : undefined }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    className="transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-semibold text-gray-900">{d.client}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm" style={{ color: "#6b7280" }}>{d.emails}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm" style={{ color: "#9ca3af" }}>{d.updated}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                        style={{ backgroundColor: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }}
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
            style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(0,0,0,0.06)" }}
              >
                <Clock className="w-5 h-5" style={{ color: "#16a34a" }} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Horarios por defecto</h2>
                <p className="text-xs" style={{ color: "#9ca3af" }}>Se aplica a todas las operaciones sin configuración específica</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}>
                <span className="text-sm" style={{ color: "#6b7280" }}>Frecuencia</span>
                <span className="text-sm font-semibold text-gray-900">2 veces al día</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}>
                <span className="text-sm" style={{ color: "#6b7280" }}>Horario 1</span>
                <span className="text-sm font-mono font-semibold" style={{ color: "#16a34a" }}>09:00 AM</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}>
                <span className="text-sm" style={{ color: "#6b7280" }}>Horario 2</span>
                <span className="text-sm font-mono font-semibold" style={{ color: "#16a34a" }}>06:00 PM</span>
              </div>
            </div>

            <button
              className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
              style={{ backgroundColor: "rgba(0,0,0,0.06)", color: "#16a34a", border: "1px solid rgba(0,0,0,0.15)" }}
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
