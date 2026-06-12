"use client"

import { useState } from "react"
import { MapPin, Clock, Satellite, CheckCircle, ChevronLeft, Mail, Users } from "lucide-react"

interface AlertaScreenProps {
  onNavigate: (screen: string) => void
}

export default function AlertaScreen({ onNavigate }: AlertaScreenProps) {
  const [confirmed, setConfirmed] = useState(false)

  const handleConfirm = () => {
    setConfirmed(true)
    setTimeout(() => {
      onNavigate("dashboard")
    }, 2000)
  }

  if (confirmed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(34,197,94,0.15)", border: "2px solid rgba(34,197,94,0.4)" }}
        >
          <CheckCircle className="w-10 h-10" style={{ color: "#22c55e" }} />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Entrega Confirmada</h2>
          <p className="text-sm mt-2" style={{ color: "#64748b" }}>Operation closed · Thread archived</p>
          <p className="text-xs mt-1" style={{ color: "#475569" }}>Redirecting to Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Alert header */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)" }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse"
            style={{ backgroundColor: "rgba(239,68,68,0.15)" }}
          >
            <span className="text-xl">🚨</span>
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: "#f87171" }}>
              ALERTA — CAMIÓN EN ZONA FINAL
            </h1>
            <p className="text-xs" style={{ color: "#64748b" }}>Sistema PADWORTMS · Detección automática por geocerca</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main alert card */}
        <div
          className="rounded-xl p-6 flex flex-col gap-5"
          style={{ backgroundColor: "#1e293b", border: "1px solid rgba(249,115,22,0.3)" }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-lg font-mono font-bold" style={{ color: "#fb923c" }}>EXM4635-25</span>
              <span style={{ color: "#334155" }}>|</span>
              <span className="text-lg font-bold text-white">AGRO PATAGONIA</span>
            </div>
            <p className="text-sm" style={{ color: "#94a3b8" }}>
              El camión placa{" "}
              <span className="font-mono font-bold text-white">GG-HH-44</span>{" "}
              ha ingresado a la geocerca de destino
            </p>
          </div>

          <div
            className="w-full h-px"
            style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
          />

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
              <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: "#f97316" }} />
              <div>
                <p className="text-xs" style={{ color: "#64748b" }}>Ubicación</p>
                <p className="text-sm font-semibold text-white">Puerto Coronel</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
              <Clock className="w-4 h-4 flex-shrink-0" style={{ color: "#eab308" }} />
              <div>
                <p className="text-xs" style={{ color: "#64748b" }}>Detección</p>
                <p className="text-sm font-semibold text-white">Hace 8 minutos</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
              <Satellite className="w-4 h-4 flex-shrink-0" style={{ color: "#22c55e" }} />
              <div>
                <p className="text-xs" style={{ color: "#64748b" }}>Detectado por</p>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-white">BioGPS</p>
                  <CheckCircle className="w-3.5 h-3.5" style={{ color: "#22c55e" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email preview */}
        <div
          className="rounded-xl p-5 flex flex-col gap-4"
          style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Mail className="w-4 h-4" style={{ color: "#60a5fa" }} />
            Vista previa del email de cierre
          </h2>

          <div
            className="rounded-lg p-4 font-mono text-sm flex flex-col gap-2"
            style={{ backgroundColor: "#0f1f3d", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="pb-2 mb-2"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-xs" style={{ color: "#475569" }}>Asunto: Re: EXM4635-25/POL:CORONEL/POD:NEW YORK</p>
            </div>
            <div
              className="py-3 text-center"
              style={{ borderTop: "2px solid rgba(255,255,255,0.1)", borderBottom: "2px solid rgba(255,255,255,0.1)" }}
            >
              <p className="font-bold text-white text-base">UNIDAD ENTREGADA A LA TERMINAL</p>
              <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>SERVICIO FINALIZADO 11/06/2026 18:42</p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5" style={{ color: "#22c55e" }} />
              <span className="text-xs" style={{ color: "#94a3b8" }}>Se enviará como reply al hilo original</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5" style={{ color: "#60a5fa" }} />
              <span className="text-xs" style={{ color: "#94a3b8" }}>
                Destinatarios:{" "}
                <span className="text-white">jessica@padwor.com</span>
                {" "}+3 más
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleConfirm}
          className="flex-1 flex items-center justify-center gap-3 py-5 rounded-xl text-base font-bold transition-all hover:opacity-90 hover:scale-[1.01]"
          style={{ backgroundColor: "#22c55e", color: "#0a1628" }}
        >
          <CheckCircle className="w-6 h-6" />
          CONFIRMAR ENTREGA Y CERRAR CADENA
        </button>
        <button
          onClick={() => onNavigate("dashboard")}
          className="sm:w-auto px-6 py-5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
          style={{ backgroundColor: "transparent", color: "#64748b", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <ChevronLeft className="w-4 h-4 inline mr-1" />
          Volver al Dashboard
        </button>
      </div>
    </div>
  )
}
