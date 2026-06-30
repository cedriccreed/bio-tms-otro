"use client"

import { useState } from "react"
import { Plus, Pencil, Eye, X, Truck, CheckCircle2, Ban, RotateCcw } from "lucide-react"
import type { EstadoVehiculo, Operation, VehiculoFlota } from "@/lib/mock-data"

interface VehiculosScreenProps {
  vehiculos: VehiculoFlota[]
  onUpdateVehiculos: (v: VehiculoFlota[]) => void
  operations: Operation[]
}

interface VehiculoForm {
  placa: string
  marca: string
  modelo: string
  anio: string
  vin: string
}

const emptyForm: VehiculoForm = {
  placa: "",
  marca: "",
  modelo: "",
  anio: "",
  vin: "",
}

function estadoBadgeStyle(estado: EstadoVehiculo): { bg: string; color: string; border: string } {
  if (estado === "Activo") {
    return { bg: "rgba(0,0,0,0.06)", color: "#16a34a", border: "rgba(0,0,0,0.2)" }
  }
  return { bg: "rgba(156,163,175,0.12)", color: "#6b7280", border: "rgba(156,163,175,0.25)" }
}

function nextVehiculoId(items: VehiculoFlota[]): string {
  const maxNum = items.reduce((max, v) => {
    const num = parseInt(v.id.replace("V", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `V${String(maxNum + 1).padStart(3, "0")}`
}

function isFormValid(form: VehiculoForm): boolean {
  const anio = parseInt(form.anio, 10)
  return (
    form.placa.trim().length === 6 &&
    form.marca.trim() !== "" &&
    form.modelo.trim() !== "" &&
    !Number.isNaN(anio) &&
    anio >= 1990 &&
    anio <= 2027 &&
    form.vin.trim() !== ""
  )
}

function TextField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  maxLength,
}: {
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  maxLength?: number
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: "#6b7280" }}>
        {label}
        {required && <span style={{ color: "#dc2626" }}> *</span>}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
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

function VehiculoFormModal({
  title,
  form,
  onChange,
  onClose,
  onSave,
  saveLabel,
}: {
  title: string
  form: VehiculoForm
  onChange: (form: VehiculoForm) => void
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
            label="Patente"
            value={form.placa}
            onChange={(placa) => onChange({ ...form, placa: placa.toUpperCase().slice(0, 6) })}
            maxLength={6}
            required
          />
          <TextField
            label="Marca"
            value={form.marca}
            onChange={(marca) => onChange({ ...form, marca })}
            required
          />
          <TextField
            label="Modelo"
            value={form.modelo}
            onChange={(modelo) => onChange({ ...form, modelo })}
            required
          />
          <TextField
            label="Año"
            type="number"
            value={form.anio}
            onChange={(anio) => onChange({ ...form, anio })}
            required
          />
          <TextField
            label="VIN"
            placeholder="9BSC4X2004B123456"
            value={form.vin}
            onChange={(vin) => onChange({ ...form, vin })}
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
              disabled={!isFormValid(form)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40 text-white"
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

export default function VehiculosScreen({
  vehiculos,
  onUpdateVehiculos,
  operations,
}: VehiculosScreenProps) {
  void operations
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingItem, setEditingItem] = useState<VehiculoFlota | null>(null)
  const [detailItem, setDetailItem] = useState<VehiculoFlota | null>(null)
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null)
  const [createForm, setCreateForm] = useState<VehiculoForm>(emptyForm)
  const [editForm, setEditForm] = useState<VehiculoForm>(emptyForm)

  const stats = {
    total: vehiculos.length,
    activos: vehiculos.filter((v) => v.estado === "Activo").length,
    inactivos: vehiculos.filter((v) => v.estado === "Inactivo").length,
  }

  const openCreateModal = () => {
    setCreateForm(emptyForm)
    setShowCreateModal(true)
  }

  const openEditModal = (item: VehiculoFlota) => {
    setEditingItem(item)
    setEditForm({
      placa: item.placa,
      marca: item.marca,
      modelo: item.modelo,
      anio: item.anio,
      vin: item.vin,
    })
  }

  const handleCreate = () => {
    if (!isFormValid(createForm)) return
    const placaExists = vehiculos.some((v) => v.placa === createForm.placa.trim())
    if (placaExists) return

    onUpdateVehiculos([
      ...vehiculos,
      {
        id: nextVehiculoId(vehiculos),
        placa: createForm.placa.trim(),
        marca: createForm.marca.trim(),
        modelo: createForm.modelo.trim(),
        anio: createForm.anio.trim(),
        vin: createForm.vin.trim(),
        estado: "Activo",
        operacionAsociada: null,
      },
    ])
    setShowCreateModal(false)
    setCreateForm(emptyForm)
  }

  const handleEdit = () => {
    if (!editingItem || !isFormValid(editForm)) return

    onUpdateVehiculos(
      vehiculos.map((v) =>
        v.id === editingItem.id
          ? {
              ...v,
              placa: editForm.placa.trim(),
              marca: editForm.marca.trim(),
              modelo: editForm.modelo.trim(),
              anio: editForm.anio.trim(),
              vin: editForm.vin.trim(),
            }
          : v
      )
    )
    setEditingItem(null)
  }

  const handleDeactivate = (id: string) => {
    onUpdateVehiculos(
      vehiculos.map((v) =>
        v.id === id ? { ...v, estado: "Inactivo", operacionAsociada: null } : v
      )
    )
    setDeactivatingId(null)
  }

  const handleReactivate = (id: string) => {
    onUpdateVehiculos(
      vehiculos.map((v) => (v.id === id ? { ...v, estado: "Activo" } : v))
    )
  }

  return (
    <>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Flota de Vehículos</h1>
            <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>
              Gestión de camiones y asignación a operaciones
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 text-white"
            style={{ backgroundColor: "#000000", color: "#ffffff" }}
          >
            <Plus className="w-4 h-4" />
            Agregar Vehículo
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Truck, label: "Total", value: stats.total, color: "#6b7280", bg: "rgba(148,163,184,0.1)" },
            { icon: CheckCircle2, label: "Activos", value: stats.activos, color: "#16a34a", bg: "rgba(0,0,0,0.06)" },
            { icon: Ban, label: "Inactivos", value: stats.inactivos, color: "#6b7280", bg: "rgba(156,163,175,0.12)" },
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
            <h2 className="text-sm font-semibold text-gray-900">Vehículos registrados</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "#f9fafb" }}>
                  {["Patente", "Marca/Modelo", "Año", "VIN", "Operación Asociada", "Estado", "Acciones"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "#9ca3af" }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {vehiculos.map((v, i) => {
                  const badge = estadoBadgeStyle(v.estado)
                  const isInactive = v.estado === "Inactivo"
                  return (
                    <tr
                      key={v.id}
                      className="transition-colors"
                      style={{
                        borderTop: i > 0 ? "1px solid #f3f4f6" : undefined,
                        opacity: isInactive ? 0.6 : 1,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-mono font-semibold text-gray-900">{v.placa}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-gray-900">
                          {v.marca} {v.modelo}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-mono" style={{ color: "#6b7280" }}>
                          {v.anio}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-mono" style={{ color: "#6b7280" }}>
                          {v.vin}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {v.operacionAsociada ? (
                          <span className="text-sm font-mono font-semibold text-gray-900">
                            {v.operacionAsociada}
                          </span>
                        ) : (
                          <span className="text-sm italic" style={{ color: "#9ca3af" }}>
                            Sin asignar
                          </span>
                        )}
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
                          {v.estado}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setDetailItem(v)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                            style={{
                              backgroundColor: "#f3f4f6",
                              color: "#6b7280",
                              border: "1px solid #e5e7eb",
                            }}
                          >
                            <Eye className="w-3 h-3" />
                            Ver detalle
                          </button>
                          {v.estado === "Activo" ? (
                            <>
                              <button
                                type="button"
                                onClick={() => openEditModal(v)}
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
                                onClick={() => setDeactivatingId(v.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                                style={{
                                  backgroundColor: "transparent",
                                  color: "#dc2626",
                                  border: "1px solid #dc2626",
                                }}
                              >
                                <Ban className="w-3 h-3" />
                                Dar de baja
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleReactivate(v.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                              style={{
                                backgroundColor: "rgba(0,0,0,0.06)",
                                color: "#16a34a",
                                border: "1px solid rgba(0,0,0,0.2)",
                              }}
                            >
                              <RotateCcw className="w-3 h-3" />
                              Reactivar
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
        <VehiculoFormModal
          title="Agregar Vehículo"
          form={createForm}
          onChange={setCreateForm}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreate}
          saveLabel="Guardar"
        />
      )}

      {editingItem && (
        <VehiculoFormModal
          title="Editar Vehículo"
          form={editForm}
          onChange={setEditForm}
          onClose={() => setEditingItem(null)}
          onSave={handleEdit}
          saveLabel="Guardar cambios"
        />
      )}

      {detailItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setDetailItem(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-4"
            style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Detalle del Vehículo</h2>
              <button
                type="button"
                onClick={() => setDetailItem(null)}
                className="p-1.5 rounded-lg transition-all hover:opacity-80"
                style={{ color: "#9ca3af" }}
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Patente", value: detailItem.placa, mono: true },
                { label: "Marca", value: detailItem.marca },
                { label: "Modelo", value: detailItem.modelo },
                { label: "Año", value: detailItem.anio, mono: true },
                { label: "VIN", value: detailItem.vin, mono: true, span: 2 },
              ].map(({ label, value, mono, span }) => (
                <div key={label} className={span === 2 ? "col-span-2" : undefined}>
                  <span className="text-xs" style={{ color: "#9ca3af" }}>
                    {label}
                  </span>
                  <p className={`text-sm font-medium text-gray-900 mt-0.5 ${mono ? "font-mono" : ""}`}>
                    {value}
                  </p>
                </div>
              ))}
              <div>
                <span className="text-xs" style={{ color: "#9ca3af" }}>
                  Estado
                </span>
                <div className="mt-1">
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: estadoBadgeStyle(detailItem.estado).bg,
                      color: estadoBadgeStyle(detailItem.estado).color,
                      border: `1px solid ${estadoBadgeStyle(detailItem.estado).border}`,
                    }}
                  >
                    {detailItem.estado}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-xs" style={{ color: "#9ca3af" }}>
                  Operación asociada
                </span>
                <p className="text-sm mt-0.5">
                  {detailItem.operacionAsociada ? (
                    <span className="font-mono font-semibold" style={{ color: "#2563eb" }}>
                      {detailItem.operacionAsociada}
                    </span>
                  ) : (
                    <span className="italic" style={{ color: "#9ca3af" }}>
                      Sin asignar
                    </span>
                  )}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDetailItem(null)}
              className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 text-white mt-2"
              style={{ backgroundColor: "#000000", color: "#ffffff" }}
            >
              Cerrar
            </button>
          </div>
        </div>
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
            <h2 className="text-base font-bold text-gray-900">Dar de baja vehículo</h2>
            <p className="text-sm" style={{ color: "#6b7280" }}>
              El vehículo quedará inactivo y no podrá ser asignado a nuevas operaciones. ¿Deseas continuar?
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
                Dar de baja
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
