"use client"

import { useState } from "react"
import { Plus, Eye, Pencil, RefreshCw, CheckCircle, X } from "lucide-react"

interface OperacionesScreenProps {
  onNavigate: (screen: string, opId?: string) => void
}

type Estado = "En Ruta" | "En Puerto" | "Detenido" | "Entregado"

interface Operation {
  id: string
  shipper: string
  placa: string
  vehiculo: string
  conductor: string
  status: string
  estado: Estado
  statusColor: string
  statusDot: string
  lastEmail: string
  hasConfirm: boolean
}

const VEHICULOS = ["JRVK23", "CJYD40", "FPDW58", "JWYJ27", "HKSW55"]
const CONDUCTORES = ["Juan Pérez", "Carlos Muñoz", "Pedro Soto", "Luis Herrera", "Mario García"]
const ESTADOS: Estado[] = ["En Ruta", "En Puerto", "Detenido", "Entregado"]

const initialOperations: Operation[] = [
  {
    id: "EXM4632-25",
    shipper: "IBERCONSA",
    placa: "CJYD40",
    vehiculo: "CJYD40",
    conductor: "Juan Pérez",
    status: "RUMBO A PLANTA POR CUTRAL CO",
    estado: "En Ruta",
    statusColor: "#eab308",
    statusDot: "yellow",
    lastEmail: "Hoy 09:00",
    hasConfirm: false,
  },
  {
    id: "EXM4633-25",
    shipper: "FRUTAS DEL SUR",
    placa: "FPDW58",
    vehiculo: "FPDW58",
    conductor: "Carlos Muñoz",
    status: "FULL EN PLANTA",
    estado: "En Puerto",
    statusColor: "#22c55e",
    statusDot: "green",
    lastEmail: "Hoy 09:00",
    hasConfirm: false,
  },
  {
    id: "EXM4634-25",
    shipper: "EXPORTADORA XYZ",
    placa: "HKSW55",
    vehiculo: "HKSW55",
    conductor: "Pedro Soto",
    status: "Sin señal GPS +2h",
    estado: "Detenido",
    statusColor: "#ef4444",
    statusDot: "red",
    lastEmail: "Pendiente",
    hasConfirm: false,
  },
  {
    id: "EXM4635-25",
    shipper: "AGRO PATAGONIA",
    placa: "JWYJ27",
    vehiculo: "JWYJ27",
    conductor: "Luis Herrera",
    status: "LLEGANDO A ZONA FINAL",
    estado: "En Puerto",
    statusColor: "#f97316",
    statusDot: "orange",
    lastEmail: "Hace 30 min",
    hasConfirm: true,
  },
  {
    id: "EXM4636-25",
    shipper: "CITRUS EXPORT",
    placa: "JRVK23",
    vehiculo: "JRVK23",
    conductor: "Mario García",
    status: "FULL RUMBO A FRONTERA POR LONQUIMAY",
    estado: "En Ruta",
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

function estadoStyles(estado: Estado): { statusColor: string; statusDot: string } {
  switch (estado) {
    case "En Ruta":
      return { statusColor: "#eab308", statusDot: "yellow" }
    case "En Puerto":
      return { statusColor: "#22c55e", statusDot: "green" }
    case "Detenido":
      return { statusColor: "#ef4444", statusDot: "red" }
    case "Entregado":
      return { statusColor: "#22c55e", statusDot: "green" }
  }
}

interface EditForm {
  vehiculo: string
  conductor: string
  estado: Estado
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: "#94a3b8" }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2.5 rounded-lg text-sm text-white outline-none transition-all cursor-pointer"
        style={{ backgroundColor: "#0f1f3d", border: "1px solid rgba(255,255,255,0.08)" }}
        onFocus={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.4)")}
        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
      >
        {options.map((opt) => (
          <option key={opt} value={opt} style={{ backgroundColor: "#0f1f3d" }}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function OperacionesScreen({ onNavigate }: OperacionesScreenProps) {
  const [operations, setOperations] = useState<Operation[]>(initialOperations)
  const [resendingId, setResendingId] = useState<string | null>(null)
  const [editingOp, setEditingOp] = useState<Operation | null>(null)
  const [editForm, setEditForm] = useState<EditForm>({
    vehiculo: VEHICULOS[0],
    conductor: CONDUCTORES[0],
    estado: ESTADOS[0],
  })

  const handleResend = (opId: string) => {
    setResendingId(opId)
    setTimeout(() => setResendingId(null), 1500)
  }

  const openEditModal = (op: Operation) => {
    setEditingOp(op)
    setEditForm({
      vehiculo: op.vehiculo,
      conductor: op.conductor,
      estado: op.estado,
    })
  }

  const closeEditModal = () => {
    setEditingOp(null)
  }

  const handleSave = () => {
    if (!editingOp) return

    const styles = estadoStyles(editForm.estado)
    setOperations((prev) =>
      prev.map((op) =>
        op.id === editingOp.id
          ? {
              ...op,
              vehiculo: editForm.vehiculo,
              placa: editForm.vehiculo,
              conductor: editForm.conductor,
              estado: editForm.estado,
              status: editForm.estado,
              ...styles,
              hasConfirm: op.hasConfirm,
            }
          : op
      )
    )
    closeEditModal()
  }

  return (
    <>
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">Operaciones</h1>
            <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>
              Gestión y seguimiento de operaciones activas
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("nueva")}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: "#22c55e", color: "#0a1628" }}
          >
            <Plus className="w-4 h-4" />
            Nueva Operación
          </button>
        </div>

        {/* Operations table */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <h2 className="text-sm font-semibold text-white">Todas las Operaciones</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "rgba(15,31,61,0.5)" }}>
                  {["OP / EXM", "SHIPPER", "PLACA", "STATUS ACTUAL", "ÚLTIMO EMAIL", "ACCIONES"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#475569" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {operations.map((op, i) => (
                  <tr
                    key={op.id}
                    className="transition-colors"
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
                      <span className="text-sm font-mono" style={{ color: "#94a3b8" }}>
                        {op.placa}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: dotColors[op.statusDot],
                            boxShadow: `0 0 6px ${dotColors[op.statusDot]}80`,
                          }}
                        />
                        <span className="text-xs font-medium" style={{ color: op.statusColor }}>
                          {op.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs" style={{ color: "#64748b" }}>
                        {op.lastEmail}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        {op.hasConfirm ? (
                          <button
                            type="button"
                            onClick={() => onNavigate("alerta")}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                            style={{ backgroundColor: "#22c55e", color: "#0a1628" }}
                          >
                            <CheckCircle className="w-3 h-3" />
                            Confirmar Entrega
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleResend(op.id)}
                            disabled={resendingId === op.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80 disabled:opacity-60"
                            style={{
                              backgroundColor: "rgba(59,130,246,0.15)",
                              color: "#60a5fa",
                              border: "1px solid rgba(59,130,246,0.2)",
                            }}
                          >
                            <RefreshCw className={`w-3 h-3 ${resendingId === op.id ? "animate-spin" : ""}`} />
                            Reenviar
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onNavigate("detalle", op.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                          style={{
                            backgroundColor: "rgba(255,255,255,0.06)",
                            color: "#94a3b8",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <Eye className="w-3 h-3" />
                          Ver
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(op)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                          style={{
                            backgroundColor: "rgba(234,179,8,0.12)",
                            color: "#eab308",
                            border: "1px solid rgba(234,179,8,0.2)",
                          }}
                        >
                          <Pencil className="w-3 h-3" />
                          Editar
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

      {/* Edit modal */}
      {editingOp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={closeEditModal}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-5"
            style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.08)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Editar Operación</h2>
              <button
                type="button"
                onClick={closeEditModal}
                className="p-1.5 rounded-lg transition-all hover:opacity-80"
                style={{ color: "#64748b" }}
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-mono" style={{ color: "#38bdf8" }}>
              {editingOp.id} — {editingOp.shipper}
            </p>

            <SelectField
              label="Vehículo"
              value={editForm.vehiculo}
              onChange={(vehiculo) => setEditForm((f) => ({ ...f, vehiculo }))}
              options={VEHICULOS}
            />
            <SelectField
              label="Conductor"
              value={editForm.conductor}
              onChange={(conductor) => setEditForm((f) => ({ ...f, conductor }))}
              options={CONDUCTORES}
            />
            <SelectField
              label="Estado"
              value={editForm.estado}
              onChange={(estado) => setEditForm((f) => ({ ...f, estado: estado as Estado }))}
              options={ESTADOS}
            />

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={closeEditModal}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  color: "#94a3b8",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: "#22c55e", color: "#0a1628" }}
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
