"use client"

import { useState } from "react"
import { Plus, Pencil, UserX, X, Users, UserCheck, UserMinus, UserPlus } from "lucide-react"
import {
  CONDUCTORES_INICIALES,
  VEHICULO_PLACAS,
  type EstadoConductor,
} from "@/lib/mock-data"

interface ConductoresScreenProps {
  onNavigate: (screen: string, opId?: string) => void
}

interface Conductor {
  id: string
  nombre: string
  rut: string
  telefono: string
  vehiculoAsignado: string
  estado: EstadoConductor
  activo: boolean
}

interface ConductorForm {
  nombre: string
  rut: string
  telefono: string
  vehiculoAsignado: string
  estado: EstadoConductor
}

const ESTADOS: EstadoConductor[] = ["Disponible", "No disponible"]
const VEHICULO_OPCIONES = [...VEHICULO_PLACAS, "Sin asignar"]

const emptyForm: ConductorForm = {
  nombre: "",
  rut: "",
  telefono: "",
  vehiculoAsignado: "Sin asignar",
  estado: "Disponible",
}

function estadoBadgeStyle(estado: EstadoConductor): { bg: string; color: string; border: string } {
  if (estado === "Disponible") {
    return { bg: "rgba(0,0,0,0.06)", color: "#16a34a", border: "rgba(0,0,0,0.2)" }
  }
  return { bg: "rgba(239,68,68,0.08)", color: "#dc2626", border: "rgba(239,68,68,0.25)" }
}

function nextConductorId(items: Conductor[]): string {
  const maxNum = items.reduce((max, c) => {
    const num = parseInt(c.id.replace("C", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `C${String(maxNum + 1).padStart(3, "0")}`
}

function TextField({
  label,
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: "#6b7280" }}>
        {label}
        {required && <span style={{ color: "#dc2626" }}> *</span>}
      </label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="px-3 py-2.5 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all"
        style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
        onFocus={(e) => (e.target.style.borderColor = "#000000")}
        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
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
      <label className="text-xs font-medium" style={{ color: "#6b7280" }}>
        {label}
        {required && <span style={{ color: "#dc2626" }}> *</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="px-3 py-2.5 rounded-lg text-sm text-gray-900 outline-none transition-all cursor-pointer"
        style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
        onFocus={(e) => (e.target.style.borderColor = "#000000")}
        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
      >
        {options.map((opt) => (
          <option key={opt} value={opt} style={{ backgroundColor: "#f9fafb" }}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}

function ConductorModal({
  title,
  form,
  onChange,
  onClose,
  onSave,
  saveLabel,
}: {
  title: string
  form: ConductorForm
  onChange: (form: ConductorForm) => void
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
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-4"
        style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg transition-all hover:opacity-80"
            style={{ color: "#9ca3af" }}
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="Nombre completo"
            value={form.nombre}
            onChange={(nombre) => onChange({ ...form, nombre })}
            required
          />
          <TextField
            label="RUT"
            placeholder="12.345.678-9"
            value={form.rut}
            onChange={(rut) => onChange({ ...form, rut })}
            required
          />
          <TextField
            label="Teléfono"
            placeholder="+56 9 XXXX XXXX"
            value={form.telefono}
            onChange={(telefono) => onChange({ ...form, telefono })}
            required
          />
          <SelectField
            label="Vehículo asignado"
            value={form.vehiculoAsignado}
            onChange={(vehiculoAsignado) => onChange({ ...form, vehiculoAsignado })}
            options={VEHICULO_OPCIONES}
            required
          />
          <SelectField
            label="Estado"
            value={form.estado}
            onChange={(estado) => onChange({ ...form, estado: estado as EstadoConductor })}
            options={ESTADOS}
            required
          />

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
              style={{
                backgroundColor: "#f3f4f6",
                color: "#6b7280",
                border: "1px solid #e5e7eb",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 text-white"
              style={{ backgroundColor: "#000000", color: "#ffffff" }}
            >
              {saveLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ConductoresScreen({ onNavigate }: ConductoresScreenProps) {
  void onNavigate
  const [conductores, setConductores] = useState<Conductor[]>(
    CONDUCTORES_INICIALES.map((c) => ({ ...c }))
  )
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Conductor | null>(null)
  const [createForm, setCreateForm] = useState<ConductorForm>(emptyForm)
  const [editForm, setEditForm] = useState<ConductorForm>(emptyForm)
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null)

  const stats = {
    total: conductores.length,
    disponibles: conductores.filter((c) => c.estado === "Disponible").length,
    noDisponibles: conductores.filter((c) => c.estado === "No disponible").length,
    inactivos: conductores.filter((c) => !c.activo).length,
  }

  const openCreateModal = () => {
    setCreateForm(emptyForm)
    setShowCreateModal(true)
  }

  const openEditModal = (item: Conductor) => {
    setEditingItem(item)
    setEditForm({
      nombre: item.nombre,
      rut: item.rut,
      telefono: item.telefono,
      vehiculoAsignado: item.vehiculoAsignado,
      estado: item.estado,
    })
  }

  const handleCreate = () => {
    if (!createForm.nombre.trim() || !createForm.rut.trim() || !createForm.telefono.trim()) return

    setConductores((prev) => [
      ...prev,
      {
        id: nextConductorId(prev),
        nombre: createForm.nombre.trim(),
        rut: createForm.rut.trim(),
        telefono: createForm.telefono.trim(),
        vehiculoAsignado: createForm.vehiculoAsignado,
        estado: createForm.estado,
        activo: true,
      },
    ])
    setShowCreateModal(false)
    setCreateForm(emptyForm)
  }

  const handleEdit = () => {
    if (!editingItem) return
    if (!editForm.nombre.trim() || !editForm.rut.trim() || !editForm.telefono.trim()) return

    setConductores((prev) =>
      prev.map((c) =>
        c.id === editingItem.id
          ? {
              ...c,
              nombre: editForm.nombre.trim(),
              rut: editForm.rut.trim(),
              telefono: editForm.telefono.trim(),
              vehiculoAsignado: editForm.vehiculoAsignado,
              estado: editForm.estado,
            }
          : c
      )
    )
    setEditingItem(null)
  }

  const handleDeactivate = (id: string) => {
    setConductores((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, activo: false, estado: "No disponible", vehiculoAsignado: "Sin asignar" }
          : c
      )
    )
    setDeactivatingId(null)
  }

  const handleActivate = (id: string) => {
    setConductores((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, activo: true, estado: "Disponible" } : c
      )
    )
  }

  return (
    <>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Conductores</h1>
            <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>
              Gestión de conductores y asignación de vehículos
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 text-white"
            style={{ backgroundColor: "#000000", color: "#ffffff" }}
          >
            <Plus className="w-4 h-4" />
            Nuevo Conductor
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "Total conductores", value: stats.total, color: "#6b7280", bg: "rgba(148,163,184,0.1)" },
            { icon: UserCheck, label: "Disponibles", value: stats.disponibles, color: "#16a34a", bg: "rgba(0,0,0,0.06)" },
            { icon: UserMinus, label: "No disponibles", value: stats.noDisponibles, color: "#dc2626", bg: "rgba(239,68,68,0.08)" },
            { icon: UserX, label: "Inactivos", value: stats.inactivos, color: "#9ca3af", bg: "rgba(156,163,175,0.12)" },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div
              key={label}
              className="rounded-xl p-4 flex items-center gap-4"
              style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
            >
              <div
                className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
                style={{ backgroundColor: bg }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                <p className="text-xs" style={{ color: "#9ca3af" }}>
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: "#e5e7eb" }}>
            <h2 className="text-sm font-semibold text-gray-900">Listado de Conductores</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "#f9fafb" }}>
                  {["Conductor", "RUT", "Teléfono", "Vehículo Asignado", "Estado", "Acciones"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#9ca3af" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {conductores.map((c, i) => {
                  const badge = estadoBadgeStyle(c.estado)
                  return (
                    <tr
                      key={c.id}
                      className="transition-colors"
                      style={{
                        borderTop: i > 0 ? "1px solid #f3f4f6" : undefined,
                        opacity: c.activo ? 1 : 0.6,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-semibold text-gray-900">{c.nombre}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-mono" style={{ color: "#6b7280" }}>
                          {c.rut}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm" style={{ color: "#374151" }}>
                          {c.telefono}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="text-sm font-mono"
                          style={{ color: c.vehiculoAsignado === "Sin asignar" ? "#9ca3af" : "#374151" }}
                        >
                          {c.vehiculoAsignado}
                        </span>
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
                          {c.estado}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          {c.activo ? (
                            <>
                              <button
                                type="button"
                                onClick={() => openEditModal(c)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                                style={{
                                  backgroundColor: "rgba(234,179,8,0.12)",
                                  color: "#ca8a04",
                                  border: "1px solid rgba(234,179,8,0.2)",
                                }}
                              >
                                <Pencil className="w-3 h-3" />
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeactivatingId(c.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                                style={{
                                  backgroundColor: "transparent",
                                  color: "#dc2626",
                                  border: "1px solid #dc2626",
                                }}
                              >
                                <UserX className="w-3 h-3" />
                                Desactivar
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleActivate(c.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                              style={{
                                backgroundColor: "rgba(0,0,0,0.06)",
                                color: "#16a34a",
                                border: "1px solid rgba(0,0,0,0.2)",
                              }}
                            >
                              <UserPlus className="w-3 h-3" />
                              Activar
                            </button>
                          )}
                        </div>
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
        <ConductorModal
          title="Nuevo Conductor"
          form={createForm}
          onChange={setCreateForm}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreate}
          saveLabel="Guardar"
        />
      )}

      {editingItem && (
        <ConductorModal
          title="Editar Conductor"
          form={editForm}
          onChange={setEditForm}
          onClose={() => setEditingItem(null)}
          onSave={handleEdit}
          saveLabel="Guardar cambios"
        />
      )}

      {deactivatingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setDeactivatingId(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4"
            style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-bold text-gray-900">Desactivar conductor</h2>
            <p className="text-sm" style={{ color: "#6b7280" }}>
              El conductor quedará inactivo y se desvinculará de su vehículo asignado. ¿Deseas continuar?
            </p>
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setDeactivatingId(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                style={{
                  backgroundColor: "#f3f4f6",
                  color: "#6b7280",
                  border: "1px solid #e5e7eb",
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleDeactivate(deactivatingId)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 text-white"
                style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
              >
                Desactivar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
