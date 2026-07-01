"use client"

import { useState } from "react"
import { Plus, Pencil, UserX, X, Users, UserCheck, UserMinus, UserPlus, Upload, Eye } from "lucide-react"
import {
  VEHICULO_PLACAS,
  calcularEstadoDocumento,
  type ConductorFlota,
  type DocumentoCentral,
  type EstadoConductor,
  type Operation,
} from "@/lib/mock-data"

interface ConductoresScreenProps {
  onNavigate: (screen: string, opId?: string) => void
  documentos: DocumentoCentral[]
  onUpdateDocumentos: (docs: DocumentoCentral[]) => void
  operations: Operation[]
  conductores: ConductorFlota[]
  onUpdateConductores: (c: ConductorFlota[]) => void
}

type Conductor = ConductorFlota

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

const alertaColors = {
  verde: "#16a34a",
  amarillo: "#ca8a04",
  rojo: "#dc2626",
  "sin-documentos": "#9ca3af",
} as const

const alertaLabels = {
  verde: "Al día",
  amarillo: "Por vencer",
  rojo: "Vencido",
  "sin-documentos": "Sin docs",
} as const

type AlertaDocumentos = keyof typeof alertaColors

function getEstadoDocumentosConductor(
  conductorId: string,
  documentos: DocumentoCentral[]
): AlertaDocumentos {
  const docs = documentos.filter(
    (d) => d.tipoEntidad === "Conductor" && d.entidadId === conductorId
  )
  if (docs.length === 0) return "sin-documentos"
  const estados = docs.map((d) => calcularEstadoDocumento(d.fechaFin))
  if (estados.some((e) => e === "Vencido")) return "rojo"
  if (estados.some((e) => e === "Por vencer")) return "amarillo"
  return "verde"
}

function getDocumentosVencidosConductor(
  conductorId: string,
  documentos: DocumentoCentral[]
): DocumentoCentral[] {
  return documentos.filter(
    (d) =>
      d.tipoEntidad === "Conductor" &&
      d.entidadId === conductorId &&
      calcularEstadoDocumento(d.fechaFin) === "Vencido"
  )
}

function getOperacionAsociadaConductor(
  nombreConductor: string,
  operations: Operation[]
): string | null {
  const op = operations.find(
    (o) => o.conductor === nombreConductor && o.estado !== "Entregado"
  )
  return op ? op.id : null
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

function RenovarTextField({
  label,
  type = "text",
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
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
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="px-3 py-2.5 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all"
        style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
        onFocus={(e) => (e.target.style.borderColor = "#000000")}
        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
      />
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

export default function ConductoresScreen({
  onNavigate,
  documentos,
  onUpdateDocumentos,
  operations,
  conductores,
  onUpdateConductores,
}: ConductoresScreenProps) {
  void onNavigate
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Conductor | null>(null)
  const [createForm, setCreateForm] = useState<ConductorForm>(emptyForm)
  const [editForm, setEditForm] = useState<ConductorForm>(emptyForm)
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null)
  const [showRenovarModal, setShowRenovarModal] = useState(false)
  const [docARenovar, setDocARenovar] = useState<DocumentoCentral | null>(null)
  const [showDetalleModal, setShowDetalleModal] = useState(false)
  const [detalleConductor, setDetalleConductor] = useState<ConductorFlota | null>(null)
  const [renovarForm, setRenovarForm] = useState({
    fechaInicio: new Date().toISOString().split("T")[0],
    fechaFin: "",
    costo: "",
    archivoNombre: null as string | null,
  })
  const [renovarError, setRenovarError] = useState("")

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

  const openDetalle = (c: ConductorFlota) => {
    setDetalleConductor(c)
    setShowDetalleModal(true)
  }

  const handleCreate = () => {
    if (!createForm.nombre.trim() || !createForm.rut.trim() || !createForm.telefono.trim()) return

    onUpdateConductores([
      ...conductores,
      {
        id: nextConductorId(conductores),
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

    onUpdateConductores(
      conductores.map((c) =>
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
    onUpdateConductores(
      conductores.map((c) =>
        c.id === id
          ? { ...c, activo: false, estado: "No disponible", vehiculoAsignado: "Sin asignar" }
          : c
      )
    )
    setDeactivatingId(null)
  }

  const handleActivate = (id: string) => {
    onUpdateConductores(
      conductores.map((c) =>
        c.id === id ? { ...c, activo: true, estado: "Disponible" } : c
      )
    )
  }

  const openRenovar = (conductorId: string) => {
    const vencidos = getDocumentosVencidosConductor(conductorId, documentos)
    if (vencidos.length === 0) return
    setDocARenovar(vencidos[0])
    setRenovarForm({
      fechaInicio: new Date().toISOString().split("T")[0],
      fechaFin: "",
      costo: "",
      archivoNombre: null,
    })
    setRenovarError("")
    setShowRenovarModal(true)
  }

  const handleConfirmarRenovar = () => {
    if (!docARenovar) return
    if (!renovarForm.fechaFin) {
      setRenovarError("La fecha de vencimiento es requerida")
      return
    }
    const hoy = new Date().toISOString().split("T")[0]
    if (renovarForm.fechaFin <= renovarForm.fechaInicio) {
      setRenovarError("La fecha de fin debe ser posterior a la fecha de inicio")
      return
    }
    if (renovarForm.fechaFin <= hoy) {
      setRenovarError("La fecha de vencimiento debe ser futura")
      return
    }
    setRenovarError("")
    onUpdateDocumentos(
      documentos.map((d) =>
        d.id === docARenovar.id
          ? {
              ...d,
              fechaInicio: renovarForm.fechaInicio,
              fechaFin: renovarForm.fechaFin,
              fechaUltimoControl: new Date().toISOString().split("T")[0],
              fechaProximoControl: renovarForm.fechaFin,
              costo: renovarForm.costo ? parseInt(renovarForm.costo, 10) : d.costo,
              archivoNombre: renovarForm.archivoNombre ?? d.archivoNombre,
            }
          : d
      )
    )
    setShowRenovarModal(false)
    setDocARenovar(null)
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
                  {["Conductor", "RUT", "Teléfono", "Vehículo Asignado", "Operación", "Documentos", "Estado", "Acciones"].map((h) => (
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
                  const alertaDoc = getEstadoDocumentosConductor(c.id, documentos)
                  const vencidosConductor = getDocumentosVencidosConductor(c.id, documentos)
                  const opAsociada = getOperacionAsociadaConductor(c.nombre, operations)
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
                        <span className="text-sm font-mono font-semibold text-gray-900">{c.nombre}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-mono" style={{ color: "#6b7280" }}>
                          {c.rut}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-gray-900">{c.telefono}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        {c.vehiculoAsignado === "Sin asignar" ? (
                          <span className="text-sm italic" style={{ color: "#9ca3af" }}>
                            Sin asignar
                          </span>
                        ) : (
                          <span className="text-sm font-mono font-semibold text-gray-900">
                            {c.vehiculoAsignado}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {opAsociada ? (
                          <span className="text-sm font-mono font-semibold text-gray-900">
                            {opAsociada}
                          </span>
                        ) : (
                          <span className="text-sm italic" style={{ color: "#9ca3af" }}>
                            Sin operación
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div
                            style={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              backgroundColor: alertaColors[alertaDoc],
                              flexShrink: 0,
                            }}
                          />
                          <span className="text-xs" style={{ color: alertaColors[alertaDoc] }}>
                            {alertaLabels[alertaDoc]}
                          </span>
                        </div>
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
                          <button
                            type="button"
                            onClick={() => openDetalle(c)}
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
                          {vencidosConductor.length > 0 && (
                            <button
                              type="button"
                              onClick={() => openRenovar(c.id)}
                              style={{
                                backgroundColor: "rgba(220,38,38,0.08)",
                                color: "#dc2626",
                                border: "1px solid rgba(220,38,38,0.2)",
                                borderRadius: "6px",
                                padding: "4px 10px",
                                fontSize: "12px",
                                cursor: "pointer",
                                fontWeight: 600,
                              }}
                            >
                              Renovar doc
                            </button>
                          )}
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

      {showRenovarModal && docARenovar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => {
            setShowRenovarModal(false)
            setDocARenovar(null)
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-4"
            style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">Renovar documento</h2>
                <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
                  {docARenovar.tipoDocumento} — {docARenovar.entidadNombre}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowRenovarModal(false)
                  setDocARenovar(null)
                }}
                className="p-1.5 rounded-lg transition-all hover:opacity-80"
                style={{ color: "#9ca3af" }}
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleConfirmarRenovar()
              }}
              className="flex flex-col gap-4"
            >
              <RenovarTextField
                label="Nueva fecha inicio"
                type="date"
                value={renovarForm.fechaInicio}
                onChange={(fechaInicio) => setRenovarForm((f) => ({ ...f, fechaInicio }))}
                required
              />
              <RenovarTextField
                label="Nueva fecha fin"
                type="date"
                value={renovarForm.fechaFin}
                onChange={(fechaFin) => {
                  setRenovarForm((f) => ({ ...f, fechaFin }))
                  setRenovarError("")
                }}
                required
              />
              {renovarError && (
                <p className="text-xs" style={{ color: "#dc2626" }}>
                  {renovarError}
                </p>
              )}
              <RenovarTextField
                label="Costo de renovación"
                type="number"
                value={renovarForm.costo}
                onChange={(costo) => setRenovarForm((f) => ({ ...f, costo }))}
                placeholder="Ej: 85000"
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: "#6b7280" }}>
                  Cargar nuevo archivo
                </label>
                <label
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all"
                  style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", color: "#374151" }}
                >
                  <Upload className="w-4 h-4 flex-shrink-0" style={{ color: "#6b7280" }} />
                  <span className="truncate">
                    {renovarForm.archivoNombre || "Seleccionar archivo..."}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      setRenovarForm((f) => ({
                        ...f,
                        archivoNombre: file?.name ?? null,
                      }))
                    }}
                  />
                </label>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowRenovarModal(false)
                    setDocARenovar(null)
                  }}
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
                  Confirmar renovación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetalleModal && detalleConductor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowDetalleModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-4"
            style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Detalle del Conductor</h2>
              <button
                type="button"
                onClick={() => setShowDetalleModal(false)}
                className="p-1.5 rounded-lg transition-all hover:opacity-80"
                style={{ color: "#9ca3af" }}
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Nombre", value: detalleConductor.nombre, mono: true },
                { label: "RUT", value: detalleConductor.rut, mono: true },
                { label: "Teléfono", value: detalleConductor.telefono },
                {
                  label: "Vehículo asignado",
                  value: detalleConductor.vehiculoAsignado,
                  mono: detalleConductor.vehiculoAsignado !== "Sin asignar",
                  emptyItalic: detalleConductor.vehiculoAsignado === "Sin asignar",
                },
                { label: "ID", value: detalleConductor.id, mono: true },
                {
                  label: "Estado del sistema",
                  value: detalleConductor.activo ? "Activo" : "Inactivo",
                },
              ].map(({ label, value, mono, emptyItalic }) => (
                <div key={label}>
                  <span className="text-xs" style={{ color: "#9ca3af" }}>
                    {label}
                  </span>
                  {emptyItalic ? (
                    <p className="text-sm mt-0.5 italic" style={{ color: "#9ca3af" }}>
                      {value}
                    </p>
                  ) : (
                    <p className={`text-sm font-medium text-gray-900 mt-0.5 ${mono ? "font-mono" : ""}`}>
                      {value}
                    </p>
                  )}
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
                      backgroundColor: estadoBadgeStyle(detalleConductor.estado).bg,
                      color: estadoBadgeStyle(detalleConductor.estado).color,
                      border: `1px solid ${estadoBadgeStyle(detalleConductor.estado).border}`,
                    }}
                  >
                    {detalleConductor.estado}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-xs" style={{ color: "#9ca3af" }}>
                  Operación activa
                </span>
                <p className="text-sm mt-0.5">
                  {getOperacionAsociadaConductor(detalleConductor.nombre, operations) ? (
                    <span className="font-mono font-semibold" style={{ color: "#2563eb" }}>
                      {getOperacionAsociadaConductor(detalleConductor.nombre, operations)}
                    </span>
                  ) : (
                    <span className="text-sm italic" style={{ color: "#9ca3af" }}>
                      Sin operación activa
                    </span>
                  )}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-xs" style={{ color: "#9ca3af" }}>
                  Documentación
                </span>
                <div className="mt-1 flex flex-col gap-2">
                  {documentos.filter(
                    (d) => d.tipoEntidad === "Conductor" && d.entidadId === detalleConductor.id
                  ).length === 0 ? (
                    <p className="text-sm italic" style={{ color: "#9ca3af" }}>
                      Sin documentos registrados
                    </p>
                  ) : (
                    documentos
                      .filter(
                        (d) => d.tipoEntidad === "Conductor" && d.entidadId === detalleConductor.id
                      )
                      .map((doc) => {
                        const estado = calcularEstadoDocumento(doc.fechaFin)
                        const docColors = {
                          Vigente: "#16a34a",
                          "Por vencer": "#ca8a04",
                          Vencido: "#dc2626",
                        }
                        return (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between gap-2"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-900">{doc.tipoDocumento}</p>
                              <p className="text-xs" style={{ color: "#6b7280" }}>
                                Vence: {new Date(doc.fechaFin).toLocaleDateString("es-CL")}
                              </p>
                            </div>
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0"
                              style={{
                                color: docColors[estado],
                                backgroundColor: `${docColors[estado]}15`,
                              }}
                            >
                              {estado}
                            </span>
                          </div>
                        )
                      })
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDetalleModal(false)}
              className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 text-white mt-2"
              style={{ backgroundColor: "#000000", color: "#ffffff" }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
