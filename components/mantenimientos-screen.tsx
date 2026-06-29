"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, X, Wrench, Clock, Loader, CheckCircle2 } from "lucide-react"

interface MantenimientosScreenProps {
  onNavigate: (screen: string, opId?: string) => void
}

type EstadoMantenimiento = "Pendiente" | "En proceso" | "Completado"

interface Mantenimiento {
  id: string
  tipoServicio: string
  fecha: string
  vehiculo: string
  costo: number
  estado: EstadoMantenimiento
}

interface MantenimientoForm {
  tipoServicio: string
  fecha: string
  vehiculo: string
  costo: string
  estado: EstadoMantenimiento
}

const VEHICULOS = ["JRVK23", "CJYD40", "FPDW58", "JWYJ27", "HKSW55"]
const ESTADOS: EstadoMantenimiento[] = ["Pendiente", "En proceso", "Completado"]

const initialMantenimientos: Mantenimiento[] = [
  {
    id: "MNT-001",
    tipoServicio: "Cambio de aceite",
    fecha: "2026-06-25",
    vehiculo: "CJYD40",
    costo: 85000,
    estado: "Pendiente",
  },
  {
    id: "MNT-002",
    tipoServicio: "Revisión técnica",
    fecha: "2026-06-22",
    vehiculo: "FPDW58",
    costo: 120000,
    estado: "En proceso",
  },
  {
    id: "MNT-003",
    tipoServicio: "Cambio de neumáticos",
    fecha: "2026-06-20",
    vehiculo: "JRVK23",
    costo: 480000,
    estado: "Completado",
  },
  {
    id: "MNT-004",
    tipoServicio: "Revisión de frenos",
    fecha: "2026-06-28",
    vehiculo: "JWYJ27",
    costo: 95000,
    estado: "Pendiente",
  },
  {
    id: "MNT-005",
    tipoServicio: "Cambio de filtros",
    fecha: "2026-06-18",
    vehiculo: "HKSW55",
    costo: 65000,
    estado: "Completado",
  },
]

const emptyForm: MantenimientoForm = {
  tipoServicio: "",
  fecha: "",
  vehiculo: VEHICULOS[0],
  costo: "",
  estado: "Pendiente",
}

function estadoBadgeStyle(estado: EstadoMantenimiento): { bg: string; color: string; border: string } {
  switch (estado) {
    case "Pendiente":
      return { bg: "rgba(249,115,22,0.12)", color: "#fb923c", border: "rgba(249,115,22,0.25)" }
    case "En proceso":
      return { bg: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "rgba(59,130,246,0.25)" }
    case "Completado":
      return { bg: "rgba(34,197,94,0.12)", color: "#22c55e", border: "rgba(34,197,94,0.25)" }
  }
}

function formatCosto(value: number): string {
  return value.toLocaleString("es-CL") + " CLP"
}

function formatFecha(fecha: string): string {
  const [year, month, day] = fecha.split("-")
  return `${day}/${month}/${year}`
}

function nextMantenimientoId(items: Mantenimiento[]): string {
  const maxNum = items.reduce((max, m) => {
    const num = parseInt(m.id.replace("MNT-", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `MNT-${String(maxNum + 1).padStart(3, "0")}`
}

function TextField({
  label,
  type = "text",
  value,
  onChange,
  required,
}: {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: "#94a3b8" }}>
        {label}
        {required && <span style={{ color: "#ef4444" }}> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="px-3 py-2.5 rounded-lg text-sm text-white placeholder:text-slate-600 outline-none transition-all"
        style={{ backgroundColor: "#0f1f3d", border: "1px solid rgba(255,255,255,0.08)" }}
        onFocus={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.4)")}
        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
      />
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: "#94a3b8" }}>
        {label}
        {required && <span style={{ color: "#ef4444" }}> *</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
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

function MantenimientoModal({
  title,
  form,
  onChange,
  onClose,
  onSave,
  saveLabel,
}: {
  title: string
  form: MantenimientoForm
  onChange: (form: MantenimientoForm) => void
  onClose: () => void
  onSave: () => void
  saveLabel: string
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-4"
        style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.08)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg transition-all hover:opacity-80"
            style={{ color: "#64748b" }}
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="Tipo de servicio"
            value={form.tipoServicio}
            onChange={(tipoServicio) => onChange({ ...form, tipoServicio })}
            required
          />
          <TextField
            label="Fecha"
            type="date"
            value={form.fecha}
            onChange={(fecha) => onChange({ ...form, fecha })}
            required
          />
          <SelectField
            label="Vehículo"
            value={form.vehiculo}
            onChange={(vehiculo) => onChange({ ...form, vehiculo })}
            options={VEHICULOS}
            required
          />
          <TextField
            label="Costo"
            type="number"
            value={form.costo}
            onChange={(costo) => onChange({ ...form, costo })}
            required
          />
          <SelectField
            label="Estado"
            value={form.estado}
            onChange={(estado) => onChange({ ...form, estado: estado as EstadoMantenimiento })}
            options={ESTADOS}
            required
          />

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
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
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: "#22c55e", color: "#0a1628" }}
            >
              {saveLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function MantenimientosScreen({ onNavigate }: MantenimientosScreenProps) {
  void onNavigate
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>(initialMantenimientos)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Mantenimiento | null>(null)
  const [createForm, setCreateForm] = useState<MantenimientoForm>(emptyForm)
  const [editForm, setEditForm] = useState<MantenimientoForm>(emptyForm)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const stats = {
    total: mantenimientos.length,
    pendientes: mantenimientos.filter((m) => m.estado === "Pendiente").length,
    enProceso: mantenimientos.filter((m) => m.estado === "En proceso").length,
    completados: mantenimientos.filter((m) => m.estado === "Completado").length,
  }

  const openCreateModal = () => {
    setCreateForm(emptyForm)
    setShowCreateModal(true)
  }

  const openEditModal = (item: Mantenimiento) => {
    setEditingItem(item)
    setEditForm({
      tipoServicio: item.tipoServicio,
      fecha: item.fecha,
      vehiculo: item.vehiculo,
      costo: String(item.costo),
      estado: item.estado,
    })
  }

  const handleCreate = () => {
    const costo = parseInt(createForm.costo, 10)
    if (!createForm.tipoServicio || !createForm.fecha || !createForm.costo || Number.isNaN(costo)) return

    setMantenimientos((prev) => [
      ...prev,
      {
        id: nextMantenimientoId(prev),
        tipoServicio: createForm.tipoServicio,
        fecha: createForm.fecha,
        vehiculo: createForm.vehiculo,
        costo,
        estado: createForm.estado,
      },
    ])
    setShowCreateModal(false)
    setCreateForm(emptyForm)
  }

  const handleEdit = () => {
    if (!editingItem) return
    const costo = parseInt(editForm.costo, 10)
    if (!editForm.tipoServicio || !editForm.fecha || !editForm.costo || Number.isNaN(costo)) return

    setMantenimientos((prev) =>
      prev.map((m) =>
        m.id === editingItem.id
          ? {
              ...m,
              tipoServicio: editForm.tipoServicio,
              fecha: editForm.fecha,
              vehiculo: editForm.vehiculo,
              costo,
              estado: editForm.estado,
            }
          : m
      )
    )
    setEditingItem(null)
  }

  const handleDelete = (id: string) => {
    setMantenimientos((prev) => prev.filter((m) => m.id !== id))
    setDeletingId(null)
  }

  return (
    <>
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">Mantenimientos</h1>
            <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>
              Registro y seguimiento de mantenimiento de vehículos
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: "#22c55e", color: "#0a1628" }}
          >
            <Plus className="w-4 h-4" />
            Nuevo Mantenimiento
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Wrench, label: "Total", value: stats.total, color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
            { icon: Clock, label: "Pendientes", value: stats.pendientes, color: "#fb923c", bg: "rgba(249,115,22,0.1)" },
            { icon: Loader, label: "En Proceso", value: stats.enProceso, color: "#60a5fa", bg: "rgba(59,130,246,0.1)" },
            { icon: CheckCircle2, label: "Completados", value: stats.completados, color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div
              key={label}
              className="rounded-xl p-4 flex items-center gap-4"
              style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div
                className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
                style={{ backgroundColor: bg }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">{value}</span>
                <p className="text-xs" style={{ color: "#64748b" }}>
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <h2 className="text-sm font-semibold text-white">Registro de Mantenimientos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "rgba(15,31,61,0.5)" }}>
                  {["ID", "Tipo de Servicio", "Fecha", "Vehículo", "Costo", "Estado", "Acciones"].map((h) => (
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
                {mantenimientos.map((m, i) => {
                  const badge = estadoBadgeStyle(m.estado)
                  return (
                    <tr
                      key={m.id}
                      className="transition-colors"
                      style={{
                        borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : undefined,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-mono font-semibold" style={{ color: "#38bdf8" }}>
                          {m.id}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-white">{m.tipoServicio}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm" style={{ color: "#94a3b8" }}>
                          {formatFecha(m.fecha)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-mono" style={{ color: "#cbd5e1" }}>
                          {m.vehiculo}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-medium text-white">{formatCosto(m.costo)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                          }}
                        >
                          {m.estado}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {deletingId === m.id ? (
                          <div
                            className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg"
                            style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
                          >
                            <span className="text-xs font-medium" style={{ color: "#fca5a5" }}>
                              ¿Eliminar este mantenimiento?
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setDeletingId(null)}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
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
                                onClick={() => handleDelete(m.id)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                                style={{ backgroundColor: "#ef4444", color: "white" }}
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(m)}
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
                            <button
                              type="button"
                              onClick={() => setDeletingId(m.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                              style={{
                                backgroundColor: "rgba(239,68,68,0.1)",
                                color: "#f87171",
                                border: "1px solid rgba(239,68,68,0.2)",
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                              Eliminar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <MantenimientoModal
          title="Nuevo Mantenimiento"
          form={createForm}
          onChange={setCreateForm}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreate}
          saveLabel="Guardar"
        />
      )}

      {editingItem && (
        <MantenimientoModal
          title="Editar Mantenimiento"
          form={editForm}
          onChange={setEditForm}
          onClose={() => setEditingItem(null)}
          onSave={handleEdit}
          saveLabel="Guardar cambios"
        />
      )}
    </>
  )
}
