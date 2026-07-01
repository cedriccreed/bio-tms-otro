"use client"

import { useMemo, useState } from "react"
import { CONDUCTOR_NOMBRES, VEHICULO_PLACAS, type Operation } from "@/lib/mock-data"

interface NuevaOperacionProps {
  onNavigate: (screen: string) => void
  onCrearOperacion: (op: Operation) => void
  operationsCount: number
}
const ORIGENES = ["San Antonio", "Santiago"] as const
const DESTINOS = ["Santiago", "San Antonio", "Linares", "Rancagua", "La Serena", "Puerto Montt"] as const

function todayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function getRuta(origen: string, destino: string): string {
  if (!origen || !destino || origen === destino) return ""

  const routes: Record<string, string> = {
    "San Antonio|Santiago": "Ruta 68 — San Antonio → Santiago",
    "San Antonio|Linares": "Ruta 5 Sur — San Antonio → Linares",
    "San Antonio|Rancagua": "Ruta 78 — San Antonio → Rancagua",
    "Santiago|San Antonio": "Ruta 68 — Santiago → San Antonio",
    "Santiago|La Serena": "Ruta 5 Norte — Santiago → La Serena",
    "Santiago|Puerto Montt": "Ruta 7 — Santiago → Puerto Montt",
    "Santiago|Linares": "Ruta 5 Sur — Santiago → Linares",
    "Santiago|Rancagua": "Ruta 78 — Santiago → Rancagua",
    "San Antonio|La Serena": "Ruta 5 Sur — San Antonio → La Serena",
    "San Antonio|Puerto Montt": "Ruta 5 Sur — San Antonio → Puerto Montt",
  }

  return routes[`${origen}|${destino}`] ?? `Ruta — ${origen} → ${destino}`
}

function getPuntosReferencia(origen: string, destino: string): string[] {
  if (origen === "San Antonio" && destino === "Santiago") {
    return ["Puerto San Antonio", "Peaje Cuncumén", "Peaje Lo Prado", "Terminal Santiago"]
  }
  if (origen === "San Antonio" && destino === "Linares") {
    return ["Puerto San Antonio", "Peaje Angostura", "Peaje Palmilla", "Terminal Linares"]
  }
  return ["Punto origen", "Punto intermedio", "Punto destino"]
}

function SectionCard({
  title,
  step,
  children,
}: {
  title: string
  step: number
  children: React.ReactNode
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
    >
      <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span
          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: "rgba(0,0,0,0.08)", color: "#111827" }}
        >
          {step}
        </span>
        {title}
      </h2>
      {children}
    </div>
  )
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="text-xs font-medium" style={{ color: "#6b7280" }}>
      {label}
      {required && <span style={{ color: "#dc2626" }}> *</span>}
    </label>
  )
}

function TextField({
  label,
  placeholder,
  value,
  onChange,
  required,
  readOnly,
}: {
  label: string
  placeholder?: string
  value: string
  onChange?: (value: string) => void
  required?: boolean
  readOnly?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel label={label} required={required} />
      <input
        type="text"
        value={value}
        readOnly={readOnly}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        required={required}
        className="px-3 py-2.5 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all"
        style={{
          backgroundColor: readOnly ? "rgba(0,0,0,0.04)" : "#f9fafb",
          border: "1px solid #e5e7eb",
          cursor: readOnly ? "default" : undefined,
        }}
        onFocus={readOnly ? undefined : (e) => (e.target.style.borderColor = "#000000")}
        onBlur={readOnly ? undefined : (e) => (e.target.style.borderColor = "#e5e7eb")}
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
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  required?: boolean
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel label={label} required={required} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="px-3 py-2.5 rounded-lg text-sm text-gray-900 outline-none transition-all cursor-pointer"
        style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
        onFocus={(e) => (e.target.style.borderColor = "#000000")}
        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}

function TimeField({
  label,
  value,
  onChange,
  required,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel label={label} required={required} />
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="px-3 py-2.5 rounded-lg text-sm text-gray-900 outline-none transition-all"
        style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
        onFocus={(e) => (e.target.style.borderColor = "#000000")}
        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
      />
    </div>
  )
}

function PuntosReferencia({ puntos }: { puntos: string[] }) {
  return (
    <div className="relative pl-2">
      {puntos.map((punto, i) => (
        <div key={`${punto}-${i}`} className="flex gap-4 relative pb-6 last:pb-0">
          {i < puntos.length - 1 && (
            <div
              className="absolute left-[11px] top-6 bottom-0 w-px"
              style={{ backgroundColor: "#d1d5db" }}
            />
          )}
          <div
            className="relative z-10 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: "#f3f4f6", border: "1px solid #d1d5db", color: "#6b7280" }}
          >
            {i + 1}
          </div>
          <div className="pt-0.5">
            <p className="text-sm font-medium text-gray-900">{punto}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function NuevaOperacionScreen({
  onNavigate,
  onCrearOperacion,
  operationsCount,
}: NuevaOperacionProps) {
  void onNavigate
  const numeroOperacion = "OP-00" + (operationsCount + 1)
  const [cliente, setCliente] = useState("")
  const [fecha, setFecha] = useState(todayISO)
  const [origen, setOrigen] = useState("")
  const [destino, setDestino] = useState("")
  const [horaCarga, setHoraCarga] = useState("")
  const [vehiculo, setVehiculo] = useState("")
  const [conductor, setConductor] = useState("")
  const [guiaDespacho, setGuiaDespacho] = useState("")
  const [tipoCarga, setTipoCarga] = useState("")

  const ruta = useMemo(() => getRuta(origen, destino), [origen, destino])
  const puntosReferencia = useMemo(
    () => (origen && destino ? getPuntosReferencia(origen, destino) : []),
    [origen, destino]
  )

  const isFormComplete =
    cliente.trim() !== "" &&
    fecha !== "" &&
    origen !== "" &&
    destino !== "" &&
    origen !== destino &&
    horaCarga !== "" &&
    vehiculo !== "" &&
    conductor !== "" &&
    guiaDespacho.trim() !== "" &&
    tipoCarga.trim() !== ""

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormComplete) return

    onCrearOperacion({
      id: numeroOperacion,
      cliente: cliente.trim(),
      shipper: cliente.trim(),
      placa: vehiculo,
      vehiculo,
      conductor,
      ruta,
      status: "En Ruta",
      statusColor: "#ca8a04",
      statusDot: "yellow",
      lastEmail: "Sin historial",
      hasConfirm: false,
      horaInicioCarga: horaCarga,
      guiaDespacho: guiaDespacho.trim(),
      tipoCarga: tipoCarga.trim(),
      origen,
      destino,
      estado: "En Ruta",
      fecha,
      kmRecorridos: 0,
      estadoFacturacion: "En curso",
      historialCambios: [],
    })
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Nueva Operación</h1>
        <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>
          Registro de orden de transporte terrestre
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <SectionCard title="Datos de la Operación" step={1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="N° Operación" value={numeroOperacion} readOnly />
            <TextField
              label="Cliente/Empresa"
              placeholder="Ej: Distribuidora Maule Sur"
              value={cliente}
              onChange={setCliente}
              required
            />
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <FieldLabel label="Fecha de operación" required />
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
                className="px-3 py-2.5 rounded-lg text-sm text-gray-900 outline-none transition-all"
                style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
                onFocus={(e) => (e.target.style.borderColor = "#000000")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Ruta" step={2}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Origen"
              value={origen}
              onChange={setOrigen}
              options={ORIGENES}
              placeholder="Seleccionar origen"
              required
            />
            <SelectField
              label="Destino"
              value={destino}
              onChange={setDestino}
              options={DESTINOS}
              placeholder="Seleccionar destino"
              required
            />
            <TextField
              label="Ruta"
              value={ruta}
              readOnly
            />
            <div className="hidden md:block" />
            <TimeField
              label="Hora inicio de carga"
              value={horaCarga}
              onChange={setHoraCarga}
              required
            />
          </div>
          {origen && destino && origen === destino && (
            <p className="text-xs mt-3" style={{ color: "#dc2626" }}>
              El origen y el destino deben ser distintos.
            </p>
          )}
        </SectionCard>

        <SectionCard title="Vehículo y Conductor" step={3}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Vehículo"
              value={vehiculo}
              onChange={setVehiculo}
              options={VEHICULO_PLACAS}
              placeholder="Seleccionar vehículo"
              required
            />
            <SelectField
              label="Conductor"
              value={conductor}
              onChange={setConductor}
              options={CONDUCTOR_NOMBRES}
              placeholder="Seleccionar conductor"
              required
            />
            <TextField
              label="N° Guía de despacho"
              placeholder="Ej: GD-2026-001234"
              value={guiaDespacho}
              onChange={setGuiaDespacho}
              required
            />
            <TextField
              label="Tipo de carga"
              placeholder="Ej: Fruta fresca refrigerada"
              value={tipoCarga}
              onChange={setTipoCarga}
              required
            />
          </div>
        </SectionCard>

        <SectionCard title="Puntos de referencia" step={4}>
          {origen && destino && origen !== destino ? (
            <PuntosReferencia puntos={puntosReferencia} />
          ) : (
            <p className="text-sm" style={{ color: "#9ca3af" }}>
              Selecciona origen y destino para ver los puntos de referencia de la ruta.
            </p>
          )}
        </SectionCard>

        <button
          type="submit"
          disabled={!isFormComplete}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white"
          style={{ backgroundColor: "#000000", color: "#ffffff" }}
        >
          Crear Operación
        </button>
      </form>
    </div>
  )
}
