"use client"

import { useState } from "react"
import { CheckCircle, Mail, AlertTriangle } from "lucide-react"

interface NuevaOperacionProps {
  onNavigate: (screen: string) => void
}

function PrefilledField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: "#94a3b8" }}>{label}</label>
      <div
        className="flex items-center justify-between px-3 py-2.5 rounded-lg"
        style={{ backgroundColor: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}
      >
        <span className="text-sm text-white">{value}</span>
        <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#22c55e" }} />
      </div>
    </div>
  )
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
      <label className="text-xs font-medium" style={{ color: "#94a3b8" }}>
        {label}{required && <span style={{ color: "#ef4444" }}> *</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-3 py-2.5 rounded-lg text-sm text-white placeholder:text-slate-600 outline-none transition-all"
        style={{ backgroundColor: "#0f1f3d", border: "1px solid rgba(255,255,255,0.08)" }}
        onFocus={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.4)")}
        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
      />
    </div>
  )
}

export default function NuevaOperacionScreen({ onNavigate }: NuevaOperacionProps) {
  const [vehicleAssigned, setVehicleAssigned] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [frequency, setFrequency] = useState<1 | 2 | 3>(2)
  const [placa, setPlaca] = useState("")
  const [chofer, setChofer] = useState("")
  const [contenedor, setContenedor] = useState("")
  const [precinto, setPrecinto] = useState("")

  const canContinue =
    vehicleAssigned || (placa.trim() !== "" && chofer.trim() !== "" && contenedor.trim() !== "" && precinto.trim() !== "")

  const handleOpenModal = () => {
    if (canContinue) setShowModal(true)
  }

  const handleConfirmTracking = () => {
    setShowModal(false)
    onNavigate("dashboard")
  }

  return (
    <>
      <div className="flex flex-col gap-6 p-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-white">Nueva Operación — Departure Notice</h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>Operación detectada desde email de Jessica</p>
        </div>

        {/* STEP 1 — Email banner */}
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)" }}
        >
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#60a5fa" }} />
            <div>
              <p className="text-sm font-medium" style={{ color: "#93c5fd" }}>
                Email detected from jessica@padwor.com
              </p>
              <p className="text-xs mt-1" style={{ color: "#64748b" }}>
                Asunto: EXM4636-25/POL:CORONEL/POD:NEW YORK/BUQUE:MSC RAYSHMI/IBERCONSA
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <CheckCircle className="w-3.5 h-3.5" style={{ color: "#22c55e" }} />
                <span className="text-xs" style={{ color: "#22c55e" }}>Thread ID captured automatically ✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 1 — Pre-filled operation fields */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: "rgba(34,197,94,0.15)", color: "#22c55e" }}
            >1</span>
            Datos de la Operación
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PrefilledField label="EXM / OP" value="EXM4636-25" />
            <PrefilledField label="SHIPPER / Exportador" value="IBERCONSA" />
            <PrefilledField label="Puerto Origen (POL)" value="CORONEL" />
            <PrefilledField label="Puerto Destino (POD)" value="NEW YORK" />
            <PrefilledField label="Buque" value="MSC RAYSHMI" />
          </div>
        </div>

        {/* STEP 2 — Vehicle configuration */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: "rgba(34,197,94,0.15)", color: "#22c55e" }}
            >2</span>
            Datos del Vehículo
          </h2>

          <div
            className="flex items-center justify-between mb-4 p-3 rounded-lg"
            style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span className="text-sm" style={{ color: "#94a3b8" }}>Vehicle assigned in email?</span>
            <div
              className="flex rounded-lg p-1"
              style={{ backgroundColor: "#0f1f3d", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <button
                type="button"
                onClick={() => setVehicleAssigned(true)}
                className="px-4 py-1.5 rounded-md text-xs font-semibold transition-all"
                style={{
                  backgroundColor: vehicleAssigned ? "#22c55e" : "transparent",
                  color: vehicleAssigned ? "#0a1628" : "#64748b",
                }}
              >
                YES
              </button>
              <button
                type="button"
                onClick={() => setVehicleAssigned(false)}
                className="px-4 py-1.5 rounded-md text-xs font-semibold transition-all"
                style={{
                  backgroundColor: !vehicleAssigned ? "#22c55e" : "transparent",
                  color: !vehicleAssigned ? "#0a1628" : "#64748b",
                }}
              >
                NO
              </button>
            </div>
          </div>

          {!vehicleAssigned && (
            <>
              <div
                className="flex items-center gap-2 p-3 rounded-lg mb-4"
                style={{ backgroundColor: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)" }}
              >
                <AlertTriangle className="w-4 h-4" style={{ color: "#eab308" }} />
                <span className="text-xs font-medium" style={{ color: "#fbbf24" }}>Asignación manual requerida</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField label="Placa" placeholder="Ej: AA-BB-11" value={placa} onChange={setPlaca} required />
                <TextField label="Chofer" placeholder="Nombre del conductor" value={chofer} onChange={setChofer} required />
                <TextField label="Contenedor" placeholder="Ej: MSCU1234567" value={contenedor} onChange={setContenedor} required />
                <TextField label="Precinto" placeholder="N° de precinto" value={precinto} onChange={setPrecinto} required />
              </div>
            </>
          )}

          <button
            type="button"
            onClick={handleOpenModal}
            disabled={!canContinue}
            className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Continuar a configuración de envíos
          </button>
        </div>
      </div>

      {/* STEP 2 — Confirmation modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-5"
            style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.08)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-bold text-white">Configuración de notificaciones</h2>

            <div className="flex flex-col gap-2">
              <p className="text-sm" style={{ color: "#94a3b8" }}>How many times per day to send status?</p>
              <div className="flex gap-2">
                {([1, 2, 3] as const).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setFrequency(n)}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      backgroundColor: frequency === n ? "#22c55e" : "rgba(255,255,255,0.06)",
                      color: frequency === n ? "#0a1628" : "#94a3b8",
                      border: frequency === n ? "none" : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {n} {n === 1 ? "time" : "times"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-sm" style={{ color: "#94a3b8" }}>Schedule 1:</span>
                <span className="text-sm font-mono font-semibold text-white">09:00</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-sm" style={{ color: "#94a3b8" }}>Schedule 2:</span>
                <span className="text-sm font-mono font-semibold text-white">18:00</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmTracking}
              className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:opacity-90"
              style={{ backgroundColor: "#22c55e", color: "#0a1628" }}
            >
              Confirm and Start Tracking ✅
            </button>
          </div>
        </div>
      )}
    </>
  )
}
