"use client"

import { useState } from "react"
import { Plus, Eye, Pencil, RefreshCw, CheckCircle, X, Zap, Navigation, Fuel } from "lucide-react"
import {
  CONDUCTOR_NOMBRES,
  VEHICULO_PLACAS,
  calcularCostoCombustiblePorOperacion,
  type CambioOperacion,
  type EstadoFacturacion,
  type EstadoOperacion,
  type Operation,
} from "@/lib/mock-data"

interface OperacionesScreenProps {
  onNavigate: (screen: string, opId?: string) => void
  operations: Operation[]
  onUpdateOperations: (ops: Operation[]) => void
}

type Estado = EstadoOperacion

const ESTADOS: Estado[] = ["En Ruta", "En Puerto", "Detenido", "Entregado"]
const ESTADOS_FACTURACION: EstadoFacturacion[] = [
  "En curso",
  "Entregado",
  "Listo para facturar",
  "Facturado",
]

const dotColors: Record<string, string> = {
  yellow: "#ca8a04",
  green: "#16a34a",
  red: "#dc2626",
  orange: "#ea580c",
}

function estadoStyles(estado: Estado): { statusColor: string; statusDot: string } {
  switch (estado) {
    case "En Ruta":
      return { statusColor: "#ca8a04", statusDot: "yellow" }
    case "En Puerto":
      return { statusColor: "#16a34a", statusDot: "green" }
    case "Detenido":
      return { statusColor: "#dc2626", statusDot: "red" }
    case "Entregado":
      return { statusColor: "#16a34a", statusDot: "green" }
  }
}

interface EditForm {
  vehiculo: string
  conductor: string
  estado: Estado
  estadoFacturacion: EstadoFacturacion
  horaDescarga: string
}

function facturacionBadgeStyle(
  estado: EstadoFacturacion
): { bg: string; color: string; border: string } {
  switch (estado) {
    case "En curso":
      return { bg: "rgba(156,163,175,0.12)", color: "#6b7280", border: "rgba(156,163,175,0.25)" }
    case "Entregado":
      return { bg: "rgba(59,130,246,0.12)", color: "#2563eb", border: "rgba(59,130,246,0.25)" }
    case "Listo para facturar":
      return { bg: "rgba(249,115,22,0.12)", color: "#ea580c", border: "rgba(249,115,22,0.25)" }
    case "Facturado":
      return { bg: "rgba(0,0,0,0.06)", color: "#16a34a", border: "rgba(0,0,0,0.2)" }
  }
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
      <label className="text-xs font-medium" style={{ color: "#6b7280" }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
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

export default function OperacionesScreen({
  onNavigate,
  operations,
  onUpdateOperations,
}: OperacionesScreenProps) {
  const [resendingId, setResendingId] = useState<string | null>(null)
  const [editingOp, setEditingOp] = useState<Operation | null>(null)
  const [editForm, setEditForm] = useState<EditForm>({
    vehiculo: VEHICULO_PLACAS[0],
    conductor: CONDUCTOR_NOMBRES[0],
    estado: ESTADOS[0],
    estadoFacturacion: "En curso",
    horaDescarga: "",
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
      estadoFacturacion: op.estadoFacturacion,
      horaDescarga: op.horaInicioDescarga ?? "",
    })
  }

  const closeEditModal = () => {
    setEditingOp(null)
  }

  const handleSave = () => {
    if (!editingOp) return

    const styles = estadoStyles(editForm.estado)
    const cambios: CambioOperacion[] = []
    const fechaActual = new Date().toLocaleString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    if (editingOp.placa !== editForm.vehiculo) {
      cambios.push({
        id: `CH-${Date.now()}-1`,
        fecha: fechaActual,
        campo: "Vehículo",
        valorAnterior: editingOp.placa,
        valorNuevo: editForm.vehiculo,
      })
    }

    if (editingOp.conductor !== editForm.conductor) {
      cambios.push({
        id: `CH-${Date.now()}-2`,
        fecha: fechaActual,
        campo: "Conductor",
        valorAnterior: editingOp.conductor,
        valorNuevo: editForm.conductor,
      })
    }

    if (editingOp.estado !== editForm.estado) {
      cambios.push({
        id: `CH-${Date.now()}-3`,
        fecha: fechaActual,
        campo: "Estado",
        valorAnterior: editingOp.estado,
        valorNuevo: editForm.estado,
      })
    }

    if (editingOp.estadoFacturacion !== editForm.estadoFacturacion) {
      cambios.push({
        id: `CH-${Date.now()}-4`,
        fecha: fechaActual,
        campo: "Facturación",
        valorAnterior: editingOp.estadoFacturacion,
        valorNuevo: editForm.estadoFacturacion,
      })
    }

    onUpdateOperations(
      operations.map((op) =>
        op.id === editingOp.id
          ? {
              ...op,
              vehiculo: editForm.vehiculo,
              placa: editForm.vehiculo,
              conductor: editForm.conductor,
              estado: editForm.estado,
              estadoFacturacion: editForm.estadoFacturacion,
              horaInicioDescarga: editForm.horaDescarga || undefined,
              status: editForm.estado,
              ...styles,
              hasConfirm: op.hasConfirm,
              historialCambios: [...(editingOp.historialCambios ?? []), ...cambios],
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
            <h1 className="text-xl font-bold text-gray-900">Operaciones</h1>
            <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>
              Gestión y seguimiento de operaciones activas
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("nueva")}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 text-white"
            style={{ backgroundColor: "#000000", color: "#ffffff" }}
          >
            <Plus className="w-4 h-4" />
            Nueva Operación
          </button>
        </div>

        {/* Operations table */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: "#e5e7eb" }}>
            <h2 className="text-sm font-semibold text-gray-900">Todas las Operaciones</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "#f9fafb" }}>
                  {["OP", "CLIENTE", "PLACA", "RUTA", "STATUS", "FACTURACIÓN", "COSTO COMBUSTIBLE", "ÚLTIMO EMAIL", "ACCIONES"].map((h) => (
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
                {operations.map((op, i) => {
                  const factBadge = facturacionBadgeStyle(op.estadoFacturacion)
                  const costoCombustible = calcularCostoCombustiblePorOperacion(op.placa, op.kmRecorridos)
                  return (
                  <tr
                    key={op.id}
                    className="transition-colors"
                    style={{
                      borderTop: i > 0 ? "1px solid #f3f4f6" : undefined,
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-mono font-semibold" style={{ color: "#111827" }}>
                        {op.id}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-gray-900">{op.shipper}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-mono" style={{ color: "#6b7280" }}>
                        {op.placa}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs block" style={{ color: "#6b7280" }}>
                        {op.ruta}
                      </span>
                      <span className="text-[10px] flex items-center gap-1 mt-0.5" style={{ color: "#9ca3af" }}>
                        <Navigation className="w-3 h-3 flex-shrink-0" />
                        Km recorridos (GPS): {op.kmRecorridos.toLocaleString("es-CL")} km
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: dotColors[op.statusDot] }}
                        />
                        <span className="text-xs font-medium" style={{ color: op.statusColor }}>
                          {op.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: factBadge.bg,
                          color: factBadge.color,
                          border: `1px solid ${factBadge.border}`,
                        }}
                      >
                        {op.estadoFacturacion}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs flex items-center gap-1 font-medium" style={{ color: "#374151" }}>
                        <Fuel className="w-3 h-3 flex-shrink-0" style={{ color: "#6b7280" }} />
                        ${costoCombustible.toLocaleString("es-CL")}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs" style={{ color: "#9ca3af" }}>
                        {op.lastEmail}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        {op.hasConfirm ? (
                          <button
                            type="button"
                            onClick={() => onNavigate("alerta")}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 text-white"
                            style={{ backgroundColor: "#000000", color: "#ffffff" }}
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
                              backgroundColor: "#eff6ff",
                              color: "#2563eb",
                              border: "1px solid #bfdbfe",
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
                            backgroundColor: "#f3f4f6",
                            color: "#6b7280",
                            border: "1px solid #e5e7eb",
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
                            color: "#ca8a04",
                            border: "1px solid rgba(234,179,8,0.2)",
                          }}
                        >
                          <Pencil className="w-3 h-3" />
                          Editar
                        </button>
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

      {/* Edit modal */}
      {editingOp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={closeEditModal}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-5"
            style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Editar Operación</h2>
              <button
                type="button"
                onClick={closeEditModal}
                className="p-1.5 rounded-lg transition-all hover:opacity-80"
                style={{ color: "#9ca3af" }}
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-mono" style={{ color: "#111827" }}>
              {editingOp.id} — {editingOp.shipper}
            </p>

            <div
              style={{
                backgroundColor: "rgba(0,0,0,0.04)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "10px 12px",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Zap className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#16a34a" }} />
              <span className="text-xs font-medium" style={{ color: "#16a34a" }}>
                Reasignación rápida: cambia vehículo o conductor sin perder el historial de la operación
              </span>
            </div>

            <div
              className="px-3 py-2.5 rounded-lg text-sm"
              style={{ backgroundColor: "rgba(0,0,0,0.04)", border: "1px solid #e5e7eb" }}
            >
              <span className="text-xs flex items-center gap-1" style={{ color: "#9ca3af" }}>
                <Navigation className="w-3 h-3" />
                Km recorridos (GPS)
              </span>
              <p className="font-medium text-gray-900 mt-0.5">
                {editingOp.kmRecorridos.toLocaleString("es-CL")} km
              </p>
            </div>

            <div
              className="px-3 py-2.5 rounded-lg text-sm"
              style={{ backgroundColor: "rgba(0,0,0,0.04)", border: "1px solid #e5e7eb" }}
            >
              <span className="text-xs flex items-center gap-1" style={{ color: "#9ca3af" }}>
                <Fuel className="w-3 h-3" />
                Costo combustible (calculado)
              </span>
              <p className="font-medium text-gray-900 mt-0.5">
                ${calcularCostoCombustiblePorOperacion(editingOp.placa, editingOp.kmRecorridos).toLocaleString("es-CL")} CLP
              </p>
            </div>

            <SelectField
              label="Vehículo"
              value={editForm.vehiculo}
              onChange={(vehiculo) => setEditForm((f) => ({ ...f, vehiculo }))}
              options={VEHICULO_PLACAS}
            />
            <SelectField
              label="Conductor"
              value={editForm.conductor}
              onChange={(conductor) => setEditForm((f) => ({ ...f, conductor }))}
              options={[...CONDUCTOR_NOMBRES]}
            />
            <SelectField
              label="Estado"
              value={editForm.estado}
              onChange={(estado) => setEditForm((f) => ({ ...f, estado: estado as Estado }))}
              options={ESTADOS}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: "#374151" }}>
                Hora de descarga
              </label>
              <p className="text-xs mb-1" style={{ color: "#9ca3af" }}>
                Se registra cuando el camión llega a destino
              </p>
              <input
                type="time"
                value={editForm.horaDescarga}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, horaDescarga: e.target.value }))
                }
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "#f9fafb",
                  fontSize: "14px",
                  color: "#111827",
                  width: "100%",
                }}
              />
            </div>
            <SelectField
              label="Estado de facturación"
              value={editForm.estadoFacturacion}
              onChange={(estadoFacturacion) =>
                setEditForm((f) => ({
                  ...f,
                  estadoFacturacion: estadoFacturacion as EstadoFacturacion,
                }))
              }
              options={ESTADOS_FACTURACION}
            />

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={closeEditModal}
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
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 text-white"
                style={{ backgroundColor: "#000000", color: "#ffffff" }}
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
