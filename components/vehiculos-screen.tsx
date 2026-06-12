"use client"

import { Plus } from "lucide-react"

const dotColors: Record<string, string> = {
  green: "#22c55e",
  orange: "#f97316",
}

const vehicles = [
  {
    placa: "AA-BB-11",
    marcaModelo: "Scania R450",
    anio: "2021",
    nMotor: "SC450-2021-001",
    nChasis: "9BSR4X2004B123456",
    polizaRc: "POL-2024-001",
    vigencia: "31/12/2026",
    genSet: "GS-001",
    paut: "PAUT-2024-CL-001",
    permisoInt: "PI-2024-001",
    operacion: "EXM4632-25",
    estado: "Activo",
    estadoColor: "#22c55e",
    estadoDot: "green",
  },
  {
    placa: "CC-DD-22",
    marcaModelo: "Scania R500",
    anio: "2020",
    nMotor: "SC500-2020-002",
    nChasis: "9BSR4X2004B234567",
    polizaRc: "POL-2024-002",
    vigencia: "30/06/2026",
    genSet: "GS-002",
    paut: "PAUT-2024-CL-002",
    permisoInt: "PI-2024-002",
    operacion: "EXM4633-25",
    estado: "Activo",
    estadoColor: "#22c55e",
    estadoDot: "green",
  },
  {
    placa: "GG-HH-44",
    marcaModelo: "Scania R410",
    anio: "2022",
    nMotor: "SC410-2022-004",
    nChasis: "9BSR4X2004B456789",
    polizaRc: "POL-2024-004",
    vigencia: "31/03/2027",
    genSet: "GS-004",
    paut: "PAUT-2024-CL-004",
    permisoInt: "PI-2024-004",
    operacion: "EXM4635-25",
    estado: "En zona final",
    estadoColor: "#f97316",
    estadoDot: "orange",
  },
]

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
        <h1 className="text-xl font-bold text-white">Flota de Vehículos</h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>
          Registro de camiones y documentación asociada
        </p>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="px-5 py-4 flex items-center justify-between border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <h2 className="text-sm font-semibold text-white">Vehículos registrados</h2>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: "#22c55e", color: "#0a1628" }}
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar Vehículo
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr style={{ backgroundColor: "rgba(15,31,61,0.5)" }}>
                {columns.map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                    style={{ color: "#475569" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v, i) => (
                <tr
                  key={v.placa}
                  className="transition-colors"
                  style={{
                    borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : undefined,
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-sm font-mono font-semibold" style={{ color: "#38bdf8" }}>
                      {v.placa}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-sm text-white">{v.marcaModelo}</span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-sm font-mono" style={{ color: "#94a3b8" }}>{v.anio}</span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-xs font-mono" style={{ color: "#94a3b8" }}>{v.nMotor}</span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-xs font-mono" style={{ color: "#94a3b8" }}>{v.nChasis}</span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-xs font-mono" style={{ color: "#94a3b8" }}>{v.polizaRc}</span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-xs" style={{ color: "#64748b" }}>{v.vigencia}</span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-xs font-mono" style={{ color: "#94a3b8" }}>{v.genSet}</span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-xs font-mono" style={{ color: "#94a3b8" }}>{v.paut}</span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-xs font-mono" style={{ color: "#94a3b8" }}>{v.permisoInt}</span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-sm font-mono font-semibold" style={{ color: "#38bdf8" }}>
                      {v.operacion}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: dotColors[v.estadoDot],
                          boxShadow: `0 0 6px ${dotColors[v.estadoDot]}80`,
                        }}
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
