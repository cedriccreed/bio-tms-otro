"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, X, Fuel, DollarSign, Droplets, Gauge, Hash } from "lucide-react"
import { COMBUSTIBLE_MOCK, VEHICULO_PLACAS, type CompraCombustible } from "@/lib/mock-data"

interface CombustibleScreenProps {
  onNavigate: (screen: string, opId?: string) => void
}

interface CombustibleForm {
  vehiculo: string
  fecha: string
  litros: string
  precioLitro: string
  kilometraje: string
  estacion: string
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0]
}

const emptyForm: CombustibleForm = {
  vehiculo: VEHICULO_PLACAS[0],
  fecha: todayISO(),
  litros: "",
  precioLitro: "",
  kilometraje: "",
  estacion: "",
}

function formatCosto(value: number): string {
  return `$${value.toLocaleString("es-CL")}`
}

function formatFecha(fecha: string): string {
  const [year, month, day] = fecha.split("-")
  return `${day}/${month}/${year}`
}

function nextCombustibleId(items: CompraCombustible[]): string {
  const maxNum = items.reduce((max, c) => {
    const num = parseInt(c.id.replace("COMB-", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `COMB-${String(maxNum + 1).padStart(3, "0")}`
}

function filterByPeriodo(fecha: string, filtroPeriodo: string, hoy: Date): boolean {
  const date = new Date(fecha)
  if (filtroPeriodo === "semana") {
    const inicioSemana = new Date(hoy)
    inicioSemana.setDate(hoy.getDate() - 7)
    return date >= inicioSemana
  }
  if (filtroPeriodo === "mes") {
    return date.getMonth() === hoy.getMonth() && date.getFullYear() === hoy.getFullYear()
  }
  if (filtroPeriodo === "trimestre") {
    const inicioTrimestre = new Date(hoy)
    inicioTrimestre.setMonth(hoy.getMonth() - 3)
    return date >= inicioTrimestre
  }
  if (filtroPeriodo === "anio") {
    return date.getFullYear() === hoy.getFullYear()
  }
  return true
}

function TextField({
  label,
  type = "text",
  value,
  onChange,
  required,
  readOnly,
  placeholder,
}: {
  label: string
  type?: string
  value: string
  onChange?: (value: string) => void
  required?: boolean
  readOnly?: boolean
  placeholder?: string
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
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        required={required}
        readOnly={readOnly}
        placeholder={placeholder}
        className="px-3 py-2.5 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all"
        style={{
          backgroundColor: readOnly ? "rgba(0,0,0,0.04)" : "#f9fafb",
          border: "1px solid #e5e7eb",
          cursor: readOnly ? "default" : undefined,
        }}
        onFocus={(e) => {
          if (!readOnly) e.target.style.borderColor = "#000000"
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#e5e7eb"
        }}
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

function CombustibleModal({
  title,
  form,
  costoTotal,
  onChange,
  onClose,
  onSave,
  saveLabel,
}: {
  title: string
  form: CombustibleForm
  costoTotal: number
  onChange: (form: CombustibleForm) => void
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
        className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
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
          <SelectField
            label="Vehículo"
            value={form.vehiculo}
            onChange={(vehiculo) => onChange({ ...form, vehiculo })}
            options={[...VEHICULO_PLACAS]}
            required
          />
          <TextField
            label="Fecha"
            type="date"
            value={form.fecha}
            onChange={(fecha) => onChange({ ...form, fecha })}
            required
          />
          <TextField
            label="Litros"
            type="number"
            value={form.litros}
            onChange={(litros) => onChange({ ...form, litros })}
            required
          />
          <TextField
            label="Precio por litro"
            type="number"
            value={form.precioLitro}
            onChange={(precioLitro) => onChange({ ...form, precioLitro })}
            required
          />
          <TextField
            label="Costo total"
            value={costoTotal > 0 ? formatCosto(costoTotal) : "—"}
            readOnly
          />
          <TextField
            label="Kilometraje"
            type="number"
            value={form.kilometraje}
            onChange={(kilometraje) => onChange({ ...form, kilometraje })}
            required
          />
          <TextField
            label="Estación"
            value={form.estacion}
            onChange={(estacion) => onChange({ ...form, estacion })}
            placeholder="Ej: Copec San Antonio"
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

function calcCostoTotal(litros: string, precioLitro: string): number {
  const l = parseFloat(litros)
  const p = parseFloat(precioLitro)
  if (Number.isNaN(l) || Number.isNaN(p) || l <= 0 || p <= 0) return 0
  return Math.round(l * p)
}

export default function CombustibleScreen({ onNavigate }: CombustibleScreenProps) {
  void onNavigate
  const [compras, setCompras] = useState<CompraCombustible[]>(
    COMBUSTIBLE_MOCK.map((c) => ({ ...c }))
  )
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingItem, setEditingItem] = useState<CompraCombustible | null>(null)
  const [createForm, setCreateForm] = useState<CombustibleForm>({ ...emptyForm, fecha: todayISO() })
  const [editForm, setEditForm] = useState<CombustibleForm>(emptyForm)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [filtroPeriodo, setFiltroPeriodo] = useState("todos")
  const [filtroVehiculo, setFiltroVehiculo] = useState("Todos")

  const hoy = new Date()

  const comprasFiltradas = compras.filter((c) => {
    if (filtroVehiculo !== "Todos" && c.vehiculo !== filtroVehiculo) return false
    return filterByPeriodo(c.fecha, filtroPeriodo, hoy)
  })

  const totalGastado = comprasFiltradas.reduce((sum, c) => sum + c.costoTotal, 0)
  const totalLitros = comprasFiltradas.reduce((sum, c) => sum + c.litros, 0)
  const promedioPrecio =
    comprasFiltradas.length > 0
      ? Math.round(
          comprasFiltradas.reduce((sum, c) => sum + c.precioLitro, 0) / comprasFiltradas.length
        )
      : 0
  const numCargas = comprasFiltradas.length

  const createCostoTotal = calcCostoTotal(createForm.litros, createForm.precioLitro)
  const editCostoTotal = calcCostoTotal(editForm.litros, editForm.precioLitro)

  const openCreateModal = () => {
    setCreateForm({ ...emptyForm, fecha: todayISO() })
    setShowCreateModal(true)
  }

  const openEditModal = (item: CompraCombustible) => {
    setEditingItem(item)
    setEditForm({
      vehiculo: item.vehiculo,
      fecha: item.fecha,
      litros: String(item.litros),
      precioLitro: String(item.precioLitro),
      kilometraje: String(item.kilometraje),
      estacion: item.estacion,
    })
  }

  const buildCompraFromForm = (form: CombustibleForm, id: string, costoTotal: number): CompraCombustible | null => {
    const litros = parseFloat(form.litros)
    const precioLitro = parseFloat(form.precioLitro)
    const kilometraje = parseInt(form.kilometraje, 10)
    if (
      !form.vehiculo ||
      !form.fecha ||
      Number.isNaN(litros) ||
      Number.isNaN(precioLitro) ||
      Number.isNaN(kilometraje) ||
      litros <= 0 ||
      precioLitro <= 0
    ) {
      return null
    }
    return {
      id,
      fecha: form.fecha,
      vehiculo: form.vehiculo,
      litros,
      precioLitro,
      costoTotal,
      kilometraje,
      estacion: form.estacion.trim(),
    }
  }

  const handleCreate = () => {
    const compra = buildCompraFromForm(createForm, nextCombustibleId(compras), createCostoTotal)
    if (!compra) return
    setCompras((prev) => [...prev, compra])
    setShowCreateModal(false)
    setCreateForm({ ...emptyForm, fecha: todayISO() })
  }

  const handleEdit = () => {
    if (!editingItem) return
    const compra = buildCompraFromForm(editForm, editingItem.id, editCostoTotal)
    if (!compra) return
    setCompras((prev) => prev.map((c) => (c.id === editingItem.id ? compra : c)))
    setEditingItem(null)
  }

  const handleDelete = (id: string) => {
    setCompras((prev) => prev.filter((c) => c.id !== id))
    setDeletingId(null)
  }

  return (
    <>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Compra de Combustible</h1>
            <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>
              Registro de cargas de combustible por vehículo
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 text-white"
            style={{ backgroundColor: "#000000", color: "#ffffff" }}
          >
            <Plus className="w-4 h-4" />
            Nueva Compra
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-xs font-medium" style={{ color: "#6b7280" }}>
              Vehículo
            </label>
            <select
              value={filtroVehiculo}
              onChange={(e) => setFiltroVehiculo(e.target.value)}
              className="px-3 py-2.5 rounded-lg text-sm text-gray-900 outline-none transition-all cursor-pointer sm:max-w-xs"
              style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
              onFocus={(e) => (e.target.style.borderColor = "#000000")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            >
              <option value="Todos">Todos</option>
              {VEHICULO_PLACAS.map((placa) => (
                <option key={placa} value={placa}>
                  {placa}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-xs font-medium" style={{ color: "#6b7280" }}>
              Período
            </label>
            <select
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value)}
              className="px-3 py-2.5 rounded-lg text-sm text-gray-900 outline-none transition-all cursor-pointer sm:max-w-xs"
              style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
              onFocus={(e) => (e.target.style.borderColor = "#000000")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            >
              <option value="todos">Todos los períodos</option>
              <option value="semana">Esta semana</option>
              <option value="mes">Este mes</option>
              <option value="trimestre">Este trimestre</option>
              <option value="anio">Este año</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: DollarSign,
              label: "Total gastado",
              value: formatCosto(totalGastado),
              color: "#111827",
              bg: "rgba(0,0,0,0.06)",
            },
            {
              icon: Droplets,
              label: "Total litros",
              value: totalLitros.toLocaleString("es-CL"),
              color: "#2563eb",
              bg: "rgba(59,130,246,0.1)",
            },
            {
              icon: Gauge,
              label: "Promedio $/litro",
              value: promedioPrecio > 0 ? formatCosto(promedioPrecio) : "—",
              color: "#6b7280",
              bg: "rgba(148,163,184,0.1)",
            },
            {
              icon: Hash,
              label: "N° de cargas",
              value: String(numCargas),
              color: "#16a34a",
              bg: "rgba(0,0,0,0.06)",
            },
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
                <span className="text-lg font-bold text-gray-900">{value}</span>
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
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Fuel className="w-4 h-4" />
              Registro de Compras
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "#f9fafb" }}>
                  {[
                    "Fecha",
                    "Vehículo",
                    "Litros",
                    "Precio/Litro",
                    "Costo Total",
                    "Kilometraje",
                    "Estación",
                    "Acciones",
                  ].map((h) => (
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
                {comprasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-8 text-center text-sm" style={{ color: "#9ca3af" }}>
                      No hay compras registradas para los filtros seleccionados
                    </td>
                  </tr>
                ) : (
                  comprasFiltradas.map((c, i) => (
                    <tr
                      key={c.id}
                      className="transition-colors"
                      style={{
                        borderTop: i > 0 ? "1px solid #f3f4f6" : undefined,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <td className="px-5 py-3.5">
                        <span className="text-sm" style={{ color: "#6b7280" }}>
                          {formatFecha(c.fecha)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-mono" style={{ color: "#374151" }}>
                          {c.vehiculo}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-gray-900">{c.litros.toLocaleString("es-CL")} L</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm" style={{ color: "#6b7280" }}>
                          {formatCosto(c.precioLitro)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-medium text-gray-900">{formatCosto(c.costoTotal)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-mono" style={{ color: "#6b7280" }}>
                          {c.kilometraje.toLocaleString("es-CL")} km
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-gray-900">{c.estacion || "—"}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        {deletingId === c.id ? (
                          <div
                            className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg"
                            style={{
                              backgroundColor: "rgba(239,68,68,0.08)",
                              border: "1px solid rgba(239,68,68,0.2)",
                            }}
                          >
                            <span className="text-xs font-medium" style={{ color: "#dc2626" }}>
                              ¿Eliminar esta compra?
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setDeletingId(null)}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
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
                                onClick={() => handleDelete(c.id)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                                style={{ backgroundColor: "#dc2626", color: "white" }}
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(c)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                              style={{
                                backgroundColor: "#f3f4f6",
                                color: "#374151",
                                border: "1px solid #e5e7eb",
                              }}
                            >
                              <Pencil className="w-3 h-3" />
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingId(c.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                              style={{
                                backgroundColor: "rgba(239,68,68,0.08)",
                                color: "#dc2626",
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CombustibleModal
          title="Nueva Compra de Combustible"
          form={createForm}
          costoTotal={createCostoTotal}
          onChange={setCreateForm}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreate}
          saveLabel="Guardar"
        />
      )}

      {editingItem && (
        <CombustibleModal
          title="Editar Compra de Combustible"
          form={editForm}
          costoTotal={editCostoTotal}
          onChange={setEditForm}
          onClose={() => setEditingItem(null)}
          onSave={handleEdit}
          saveLabel="Guardar"
        />
      )}
    </>
  )
}
