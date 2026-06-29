"use client"

import { Plus } from "lucide-react"
import { VEHICULOS_FLOTA_MOCK } from "@/lib/mock-data"

const dotColors: Record<string, string> = {
  green: "#16a34a",
  orange: "#ea580c",
}

const columns = [
  "PLACA",
  "MARCA/MODELO",
  "AÑO",
  "N° MOTOR",
  "N° CHASIS",
  "PÓLIZA RC",
  "VIGENCIA",
  "GEN SET",
  "PAUT",
  "PERMISO INT.",
  "OPERACIÓN",
  "ESTADO",
] as const

export default function VehiculosScreen() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Flota de Vehículos</h1>
        <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>
          Registro de camiones y documentación asociada
        </p>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
      >
        <div
          className="px-5 py-4 flex items-center justify-between border-b"
          style={{ borderColor: "#e5e7eb" }}
        >
          <h2 className="text-sm font-semibold text-gray-900">Vehículos registrados</h2>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 text-white"
            style={{ backgroundColor: "#000000", color: "#ffffff" }}
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar Vehículo
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr style={{ backgroundColor: "#f9fafb" }}>
                {columns.map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                    style={{ color: "#9ca3af" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {VEHICULOS_FLOTA_MOCK.map((v, i) => (
                <tr
                  key={v.placa}
                  className="transition-colors"
                  style={{
                    borderTop: i > 0 ? "1px solid #f3f4f6" : undefined,
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-sm font-mono font-semibold" style={{ color: "#111827" }}>
                      {v.placa}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{v.marcaModelo}</span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-sm font-mono" style={{ color: "#6b7280" }}>{v.anio}</span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-xs font-mono" style={{ color: "#6b7280" }}>{v.nMotor}</span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-xs font-mono" style={{ color: "#6b7280" }}>{v.nChasis}</span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-xs font-mono" style={{ color: "#6b7280" }}>{v.polizaRc}</span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-xs" style={{ color: "#9ca3af" }}>{v.vigencia}</span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-xs font-mono" style={{ color: "#6b7280" }}>{v.genSet}</span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-xs font-mono" style={{ color: "#6b7280" }}>{v.paut}</span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-xs font-mono" style={{ color: "#6b7280" }}>{v.permisoInt}</span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-sm font-mono font-semibold" style={{ color: "#111827" }}>
                      {v.operacion}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: dotColors[v.estadoDot] }}
                      />
                      <span className="text-xs font-medium" style={{ color: v.estadoColor }}>
                        {v.estado}
                      </span>
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
