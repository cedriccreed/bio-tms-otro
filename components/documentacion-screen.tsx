"use client"

import { useState } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  X,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  File,
  Upload,
} from "lucide-react"
import {
  CONDUCTORES_INICIALES,
  CONDUCTOR_NOMBRES,
  DOCUMENTOS_MOCK,
  VEHICULO_PLACAS,
  calcularEstadoDocumento,
  type DocumentoCentral,
  type EstadoDocumento,
  type TipoEntidad,
} from "@/lib/mock-data"

interface DocumentacionScreenProps {
  onNavigate: (screen: string, opId?: string) => void
}

interface DocumentoForm {
  tipoEntidad: TipoEntidad
  entidad: string
  tipoDocumento: string
  fechaInicio: string
  fechaFin: string
  fechaUltimoControl: string
  fechaProximoControl: string
  archivoNombre: string
}

const emptyForm: DocumentoForm = {
  tipoEntidad: "Vehiculo",
  entidad: VEHICULO_PLACAS[0],
  tipoDocumento: "",
  fechaInicio: "",
  fechaFin: "",
  fechaUltimoControl: "",
  fechaProximoControl: "",
  archivoNombre: "",
}

function formatFecha(fecha: string): string {
  const [year, month, day] = fecha.split("-")
  return `${day}/${month}/${year}`
}

function estadoBadgeStyle(estado: EstadoDocumento): { bg: string; color: string; border: string } {
  switch (estado) {
    case "Vigente":
      return { bg: "rgba(0,0,0,0.06)", color: "#16a34a", border: "rgba(0,0,0,0.2)" }
    case "Por vencer":
      return { bg: "rgba(234,179,8,0.12)", color: "#ca8a04", border: "rgba(234,179,8,0.25)" }
    case "Vencido":
      return { bg: "rgba(239,68,68,0.08)", color: "#dc2626", border: "rgba(239,68,68,0.25)" }
  }
}

function nextDocumentoId(items: DocumentoCentral[]): string {
  const maxNum = items.reduce((max, d) => {
    const num = parseInt(d.id.replace("DOC-", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `DOC-${String(maxNum + 1).padStart(3, "0")}`
}

function resolveEntidadIds(
  tipoEntidad: TipoEntidad,
  entidad: string
): { entidadId: string; entidadNombre: string } {
  if (tipoEntidad === "Vehiculo") {
    return { entidadId: entidad, entidadNombre: entidad }
  }
  const conductor = CONDUCTORES_INICIALES.find((c) => c.nombre === entidad)
  return {
    entidadId: conductor?.id ?? entidad,
    entidadNombre: entidad,
  }
}

function TextField({
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

function DocumentoModal({
  title,
  form,
  onChange,
  onClose,
  onSave,
  saveLabel,
}: {
  title: string
  form: DocumentoForm
  onChange: (form: DocumentoForm) => void
  onClose: () => void
  onSave: () => void
  saveLabel: string
}) {
  const entidadOptions = form.tipoEntidad === "Vehiculo" ? [...VEHICULO_PLACAS] : [...CONDUCTOR_NOMBRES]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave()
  }

  const handleTipoEntidadChange = (tipoEntidad: TipoEntidad) => {
    onChange({
      ...form,
      tipoEntidad,
      entidad: tipoEntidad === "Vehiculo" ? VEHICULO_PLACAS[0] : CONDUCTOR_NOMBRES[0],
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    onChange({ ...form, archivoNombre: file?.name ?? "" })
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
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: "#6b7280" }}>
              Aplica a <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <div className="flex gap-4">
              {(["Vehiculo", "Conductor"] as TipoEntidad[]).map((tipo) => (
                <label key={tipo} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tipoEntidad"
                    value={tipo}
                    checked={form.tipoEntidad === tipo}
                    onChange={() => handleTipoEntidadChange(tipo)}
                    className="accent-black"
                  />
                  <span className="text-sm text-gray-900">{tipo === "Vehiculo" ? "Vehículo" : "Conductor"}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: "#6b7280" }}>
              Entidad <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <select
              value={form.entidad}
              onChange={(e) => onChange({ ...form, entidad: e.target.value })}
              required
              className="px-3 py-2.5 rounded-lg text-sm text-gray-900 outline-none transition-all cursor-pointer"
              style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
            >
              {entidadOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <TextField
            label="Tipo de documento"
            value={form.tipoDocumento}
            onChange={(tipoDocumento) => onChange({ ...form, tipoDocumento })}
            placeholder="Ej: Permiso de circulación"
            required
          />
          <TextField
            label="Fecha inicio"
            type="date"
            value={form.fechaInicio}
            onChange={(fechaInicio) => onChange({ ...form, fechaInicio })}
            required
          />
          <TextField
            label="Fecha fin"
            type="date"
            value={form.fechaFin}
            onChange={(fechaFin) => onChange({ ...form, fechaFin })}
            required
          />
          <TextField
            label="Fecha último control"
            type="date"
            value={form.fechaUltimoControl}
            onChange={(fechaUltimoControl) => onChange({ ...form, fechaUltimoControl })}
          />
          <TextField
            label="Fecha próximo control"
            type="date"
            value={form.fechaProximoControl}
            onChange={(fechaProximoControl) => onChange({ ...form, fechaProximoControl })}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: "#6b7280" }}>
              Cargar archivo
            </label>
            <label
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all"
              style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", color: "#374151" }}
            >
              <Upload className="w-4 h-4 flex-shrink-0" style={{ color: "#6b7280" }} />
              <span className="truncate">{form.archivoNombre || "Seleccionar archivo..."}</span>
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

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

function buildDocumentoFromForm(form: DocumentoForm, id: string): DocumentoCentral | null {
  if (!form.entidad || !form.tipoDocumento.trim() || !form.fechaInicio || !form.fechaFin) return null
  const { entidadId, entidadNombre } = resolveEntidadIds(form.tipoEntidad, form.entidad)
  return {
    id,
    tipoEntidad: form.tipoEntidad,
    entidadId,
    entidadNombre,
    tipoDocumento: form.tipoDocumento.trim(),
    fechaInicio: form.fechaInicio,
    fechaFin: form.fechaFin,
    fechaUltimoControl: form.fechaUltimoControl || null,
    fechaProximoControl: form.fechaProximoControl || null,
    archivoNombre: form.archivoNombre || null,
  }
}

function formFromDocumento(doc: DocumentoCentral): DocumentoForm {
  return {
    tipoEntidad: doc.tipoEntidad,
    entidad: doc.tipoEntidad === "Vehiculo" ? doc.entidadId : doc.entidadNombre,
    tipoDocumento: doc.tipoDocumento,
    fechaInicio: doc.fechaInicio,
    fechaFin: doc.fechaFin,
    fechaUltimoControl: doc.fechaUltimoControl ?? "",
    fechaProximoControl: doc.fechaProximoControl ?? "",
    archivoNombre: doc.archivoNombre ?? "",
  }
}

export default function DocumentacionScreen({ onNavigate }: DocumentacionScreenProps) {
  void onNavigate
  const [documentos, setDocumentos] = useState<DocumentoCentral[]>(
    DOCUMENTOS_MOCK.map((d) => ({ ...d }))
  )
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingItem, setEditingItem] = useState<DocumentoCentral | null>(null)
  const [createForm, setCreateForm] = useState<DocumentoForm>(emptyForm)
  const [editForm, setEditForm] = useState<DocumentoForm>(emptyForm)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [filtroTipo, setFiltroTipo] = useState("Todos")
  const [filtroEstado, setFiltroEstado] = useState("Todos")

  const documentosFiltrados = documentos.filter((doc) => {
    if (filtroTipo === "Vehiculos" && doc.tipoEntidad !== "Vehiculo") return false
    if (filtroTipo === "Conductores" && doc.tipoEntidad !== "Conductor") return false
    if (filtroEstado !== "Todos") {
      const estado = calcularEstadoDocumento(doc.fechaFin)
      if (estado !== filtroEstado) return false
    }
    return true
  })

  const stats = {
    total: documentosFiltrados.length,
    vigentes: documentosFiltrados.filter((d) => calcularEstadoDocumento(d.fechaFin) === "Vigente").length,
    porVencer: documentosFiltrados.filter((d) => calcularEstadoDocumento(d.fechaFin) === "Por vencer").length,
    vencidos: documentosFiltrados.filter((d) => calcularEstadoDocumento(d.fechaFin) === "Vencido").length,
  }

  const openCreateModal = () => {
    setCreateForm({ ...emptyForm })
    setShowCreateModal(true)
  }

  const openEditModal = (item: DocumentoCentral) => {
    setEditingItem(item)
    setEditForm(formFromDocumento(item))
  }

  const handleCreate = () => {
    const doc = buildDocumentoFromForm(createForm, nextDocumentoId(documentos))
    if (!doc) return
    setDocumentos((prev) => [...prev, doc])
    setShowCreateModal(false)
    setCreateForm({ ...emptyForm })
  }

  const handleEdit = () => {
    if (!editingItem) return
    const doc = buildDocumentoFromForm(editForm, editingItem.id)
    if (!doc) return
    setDocumentos((prev) => prev.map((d) => (d.id === editingItem.id ? doc : d)))
    setEditingItem(null)
  }

  const handleDelete = (id: string) => {
    setDocumentos((prev) => prev.filter((d) => d.id !== id))
    setDeletingId(null)
  }

  return (
    <>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Documentación</h1>
            <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>
              Gestión centralizada de documentos de vehículos y conductores
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 text-white"
            style={{ backgroundColor: "#000000", color: "#ffffff" }}
          >
            <Plus className="w-4 h-4" />
            Nuevo Documento
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-xs font-medium" style={{ color: "#6b7280" }}>
              Tipo
            </label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="px-3 py-2.5 rounded-lg text-sm text-gray-900 outline-none transition-all cursor-pointer sm:max-w-xs"
              style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
            >
              <option value="Todos">Todos</option>
              <option value="Vehiculos">Vehículos</option>
              <option value="Conductores">Conductores</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-xs font-medium" style={{ color: "#6b7280" }}>
              Estado
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-3 py-2.5 rounded-lg text-sm text-gray-900 outline-none transition-all cursor-pointer sm:max-w-xs"
              style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
            >
              <option value="Todos">Todos</option>
              <option value="Vigente">Vigente</option>
              <option value="Por vencer">Por vencer</option>
              <option value="Vencido">Vencido</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: FileText, label: "Total documentos", value: stats.total, color: "#111827", bg: "rgba(0,0,0,0.06)" },
            { icon: CheckCircle2, label: "Vigentes", value: stats.vigentes, color: "#16a34a", bg: "rgba(0,0,0,0.06)" },
            { icon: AlertTriangle, label: "Por vencer", value: stats.porVencer, color: "#ca8a04", bg: "rgba(234,179,8,0.1)" },
            { icon: XCircle, label: "Vencidos", value: stats.vencidos, color: "#dc2626", bg: "rgba(239,68,68,0.08)" },
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
            <h2 className="text-sm font-semibold text-gray-900">Registro de Documentos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "#f9fafb" }}>
                  {[
                    "Entidad",
                    "Identificador",
                    "Tipo Documento",
                    "Fecha Inicio",
                    "Fecha Fin",
                    "Próximo Control",
                    "Estado",
                    "Archivo",
                    "Acciones",
                  ].map((h) => (
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
                {documentosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-8 text-center text-sm" style={{ color: "#9ca3af" }}>
                      No hay documentos para los filtros seleccionados
                    </td>
                  </tr>
                ) : (
                  documentosFiltrados.map((doc, i) => {
                    const estado = calcularEstadoDocumento(doc.fechaFin)
                    const badge = estadoBadgeStyle(estado)
                    return (
                      <tr
                        key={doc.id}
                        className="transition-colors"
                        style={{ borderTop: i > 0 ? "1px solid #f3f4f6" : undefined }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <td className="px-5 py-3.5">
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: doc.tipoEntidad === "Vehiculo" ? "rgba(0,0,0,0.06)" : "rgba(59,130,246,0.1)",
                              color: doc.tipoEntidad === "Vehiculo" ? "#374151" : "#2563eb",
                            }}
                          >
                            {doc.tipoEntidad === "Vehiculo" ? "Vehículo" : "Conductor"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-sm font-mono" style={{ color: "#374151" }}>
                            {doc.tipoEntidad === "Vehiculo" ? doc.entidadId : doc.entidadNombre}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-sm text-gray-900">{doc.tipoDocumento}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-sm whitespace-nowrap" style={{ color: "#6b7280" }}>
                            {formatFecha(doc.fechaInicio)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-sm whitespace-nowrap" style={{ color: "#6b7280" }}>
                            {formatFecha(doc.fechaFin)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-sm whitespace-nowrap" style={{ color: "#6b7280" }}>
                            {doc.fechaProximoControl ? formatFecha(doc.fechaProximoControl) : "—"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                            style={{
                              backgroundColor: badge.bg,
                              color: badge.color,
                              border: `1px solid ${badge.border}`,
                            }}
                          >
                            {estado}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {doc.archivoNombre ? (
                            <span className="text-xs flex items-center gap-1.5" style={{ color: "#374151" }}>
                              <File className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#6b7280" }} />
                              <span className="truncate max-w-[120px]">{doc.archivoNombre}</span>
                            </span>
                          ) : (
                            <span className="text-xs" style={{ color: "#9ca3af" }}>
                              Sin archivo
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          {deletingId === doc.id ? (
                            <div
                              className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg"
                              style={{
                                backgroundColor: "rgba(239,68,68,0.08)",
                                border: "1px solid rgba(239,68,68,0.2)",
                              }}
                            >
                              <span className="text-xs font-medium" style={{ color: "#dc2626" }}>
                                ¿Eliminar este documento?
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
                                  onClick={() => handleDelete(doc.id)}
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
                                onClick={() => openEditModal(doc)}
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
                                onClick={() => setDeletingId(doc.id)}
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
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <DocumentoModal
          title="Nuevo Documento"
          form={createForm}
          onChange={setCreateForm}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreate}
          saveLabel="Guardar"
        />
      )}

      {editingItem && (
        <DocumentoModal
          title="Editar Documento"
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
