"use client"

import { useState } from "react"
import { RefreshCw, CheckCircle, ExternalLink, MapPin, Clock, Satellite, ChevronLeft, X } from "lucide-react"

interface DetalleOperacionProps {
  operationId?: string
  onNavigate: (screen: string) => void
}

interface TabularData {
  op: string
  shipper: string
  status: string
  transporte: string
}

interface GmailEmail {
  id: number
  avatar: string
  avatarBg: string
  sender: string
  date: string
  preview: string
  type: "text" | "tabular" | "tabular-attachment"
  textContent?: string
  tabular?: TabularData
}

const timelineEvents = [
  { done: true, date: "09 Jun 09:00", text: "Email enviado: UNIDAD RUMBO A PLANTA POR VILLA REGINA" },
  { done: true, date: "09 Jun 18:00", text: "Email enviado: UNIDAD RUMBO A PLANTA POR CUTRAL CO" },
  { done: true, date: "10 Jun 09:00", text: "Email enviado: UNIDAD RUMBO A PLANTA POR POMONA" },
  { done: true, date: "10 Jun 18:00", text: "Email enviado: UNIDAD EN PLANTA" },
  { done: true, date: "11 Jun 09:00", text: "Email enviado: FULL EN PLANTA A LA ESPERA DE DOCUMENTACIÓN" },
  { done: false, date: "11 Jun 18:00", text: "Próximo envío programado" },
]

const opData = [
  { label: "POL", value: "Coronel" },
  { label: "POD", value: "New York" },
  { label: "Buque", value: "MSC Rayshmi" },
  { label: "Placa", value: "AA-BB-11" },
  { label: "Chofer", value: "Juan Pérez" },
  { label: "Contenedor", value: "MSCU1234567" },
  { label: "Naviera", value: "MSC" },
  { label: "Booking", value: "BK-98765" },
]

const gmailThread: GmailEmail[] = [
  {
    id: 1,
    avatar: "JP",
    avatarBg: "#0b8043",
    sender: "Jessica <jessica@tms.cl>",
    date: "lun, 9 jun, 09:00",
    preview: "Confirmación de booking — IBERCONSA, Puerto Coronel...",
    type: "text",
    textContent: `Estimados,
Confirmamos el booking para la operación EXM4632-25.
Cliente: IBERCONSA
POL: Coronel | POD: New York
Buque: MSC Rayshmi
Fecha consolidación: 31 oct`,
  },
  {
    id: 2,
    avatar: "BP",
    avatarBg: "#1a73e8",
    sender: "TMS <sistema@tms.cl>",
    date: "lun, 9 jun, 09:00",
    preview: "...",
    type: "tabular",
    tabular: {
      op: "EXM4632-25",
      shipper: "IBERCONSA",
      status: "UNIDAD RUMBO A PLANTA POR VILLA REGINA",
      transporte: "LOGISTICA STARB",
    },
  },
  {
    id: 3,
    avatar: "BP",
    avatarBg: "#1a73e8",
    sender: "TMS <sistema@tms.cl>",
    date: "lun, 9 jun, 18:00",
    preview: "...",
    type: "tabular",
    tabular: {
      op: "EXM4632-25",
      shipper: "IBERCONSA",
      status: "UNIDAD RUMBO A PLANTA POR CUTRAL CO",
      transporte: "LOGISTICA STARB",
    },
  },
  {
    id: 4,
    avatar: "BP",
    avatarBg: "#1a73e8",
    sender: "TMS <sistema@tms.cl>",
    date: "mar, 10 jun, 09:00",
    preview: "...",
    type: "tabular",
    tabular: {
      op: "EXM4632-25",
      shipper: "IBERCONSA",
      status: "UNIDAD RUMBO A PLANTA POR POMONA",
      transporte: "LOGISTICA STARB",
    },
  },
  {
    id: 5,
    avatar: "BP",
    avatarBg: "#1a73e8",
    sender: "TMS <sistema@tms.cl>",
    date: "mar, 10 jun, 18:00",
    preview: "...",
    type: "tabular",
    tabular: {
      op: "EXM4632-25",
      shipper: "IBERCONSA",
      status: "UNIDAD EN PLANTA",
      transporte: "LOGISTICA STARB",
    },
  },
  {
    id: 6,
    avatar: "BP",
    avatarBg: "#1a73e8",
    sender: "TMS <sistema@tms.cl>",
    date: "mié, 11 jun, 09:00",
    preview: "...",
    type: "tabular-attachment",
    tabular: {
      op: "EXM4632-25",
      shipper: "IBERCONSA",
      status: "FULL EN PLANTA A LA ESPERA DE DOCUMENTACIÓN",
      transporte: "LOGISTICA STARB",
    },
  },
]

function TabularEmailBody({ data }: { data: TabularData }) {
  return (
    <div className="mt-3 text-sm text-[#202124] leading-relaxed">
      <p className="font-medium mb-2">{data.status}</p>
      <div
        className="rounded border text-xs font-mono overflow-x-auto"
        style={{ borderColor: "#dadce0", backgroundColor: "#f8f9fa" }}
      >
        <table className="w-full border-collapse">
          <tbody>
            {[
              ["OP", data.op],
              ["SHIPPER", data.shipper],
              ["STATUS", data.status],
              ["TRANSPORTE", data.transporte],
            ].map(([label, value]) => (
              <tr key={label} style={{ borderBottom: "1px solid #e8eaed" }}>
                <td className="px-3 py-2 font-semibold text-[#5f6368] whitespace-nowrap">{label}</td>
                <td className="px-3 py-2 text-[#202124]">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function GmailThreadEmail({
  email,
  expanded,
  onToggle,
}: {
  email: GmailEmail
  expanded: boolean
  onToggle: () => void
}) {
  const senderName = email.sender.split("<")[0].trim()

  return (
    <div style={{ borderBottom: "1px solid #e8eaed" }}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-4 py-3 transition-colors hover:bg-[#f6f8fc]"
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold text-white"
            style={{ backgroundColor: email.avatarBg }}
          >
            {email.avatar}
          </div>

          {expanded ? (
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-[#202124]">{senderName}</p>
                  <p className="text-xs text-[#5f6368] mt-0.5">para mí</p>
                </div>
                <span className="text-xs text-[#5f6368] flex-shrink-0">{email.date}</span>
              </div>
            </div>
          ) : (
            <div className="flex-1 min-w-0 flex items-center gap-2 overflow-hidden">
              <span className="text-sm font-medium text-[#202124] flex-shrink-0">{senderName}</span>
              <span className="text-xs text-[#5f6368] flex-shrink-0">{email.date}</span>
              <span className="text-sm text-[#5f6368] truncate">{email.preview}</span>
            </div>
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pl-[4.25rem]">
          {email.type === "text" && email.textContent && (
            <p className="text-sm text-[#202124] whitespace-pre-line leading-relaxed">
              {email.textContent}
            </p>
          )}

          {(email.type === "tabular" || email.type === "tabular-attachment") && email.tabular && (
            <TabularEmailBody data={email.tabular} />
          )}

          {email.type === "tabular-attachment" && (
            <div className="mt-4 flex flex-col gap-3">
              <p className="text-xs text-[#5f6368]">Un archivo adjunto · Analizado por Gmail</p>
              <div
                className="rounded flex flex-col items-center justify-center gap-1"
                style={{
                  width: 200,
                  height: 120,
                  backgroundColor: "#e8eaed",
                  border: "1px solid #dadce0",
                }}
              >
                <span className="text-xs text-[#5f6368]">📍 Mapa de ubicación</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function DetalleOperacionScreen({ operationId = "EXM4632-25", onNavigate }: DetalleOperacionProps) {
  const [showGmailModal, setShowGmailModal] = useState(false)
  const [expandedEmails, setExpandedEmails] = useState<Set<number>>(new Set([5]))

  const threadSubject = `${operationId} / POL:CORONEL / POD:NEW YORK / BUQUE:MSC RAYSHMI / IBERCONSA`

  const openGmailModal = () => {
    setExpandedEmails(new Set([gmailThread.length - 1]))
    setShowGmailModal(true)
  }

  const toggleEmail = (index: number) => {
    setExpandedEmails((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-1 text-xs transition-all hover:opacity-80"
          style={{ color: "#64748b" }}
        >
          <ChevronLeft className="w-4 h-4" />
          Dashboard
        </button>
        <span style={{ color: "#334155" }}>/</span>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white">{operationId} — IBERCONSA</h1>
            <span
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: "rgba(234,179,8,0.12)", color: "#eab308", border: "1px solid rgba(234,179,8,0.25)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              EN TRÁNSITO
            </span>
          </div>
        </div>
      </div>

      {/* Operation data cards */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#475569" }}>
          Datos de la Operación
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {opData.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-xs" style={{ color: "#475569" }}>{label}</span>
              <span className="text-sm font-semibold text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content: timeline + GPS */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Timeline */}
        <div
          className="lg:col-span-3 rounded-xl p-5"
          style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h2 className="text-sm font-semibold text-white mb-5">Historial de Eventos</h2>
          <div className="relative flex flex-col gap-0">
            {/* Vertical line */}
            <div
              className="absolute left-3.5 top-3 bottom-8 w-px"
              style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
            />
            {timelineEvents.map((event, i) => (
              <div key={i} className="flex items-start gap-4 pb-5 last:pb-0 relative">
                {/* Dot */}
                <div
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center z-10"
                  style={{
                    backgroundColor: event.done ? "rgba(34,197,94,0.15)" : "rgba(59,130,246,0.12)",
                    border: `1px solid ${event.done ? "rgba(34,197,94,0.4)" : "rgba(59,130,246,0.3)"}`,
                  }}
                >
                  {event.done ? (
                    <CheckCircle className="w-3.5 h-3.5" style={{ color: "#22c55e" }} />
                  ) : (
                    <RefreshCw className="w-3 h-3 animate-spin" style={{ color: "#60a5fa" }} />
                  )}
                </div>
                <div className="flex flex-col gap-0.5 pt-0.5">
                  <span className="text-xs font-mono" style={{ color: "#475569" }}>{event.date}</span>
                  <span className="text-sm" style={{ color: event.done ? "#cbd5e1" : "#60a5fa" }}>
                    {event.text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GPS Info */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div
            className="rounded-xl p-5 flex flex-col gap-4"
            style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <h2 className="text-sm font-semibold text-white">Información GPS</h2>

            <div className="flex flex-col gap-3">
              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ backgroundColor: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(34,197,94,0.12)" }}
                >
                  <MapPin className="w-4 h-4" style={{ color: "#22c55e" }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: "#64748b" }}>Posición actual</p>
                  <p className="text-sm font-semibold text-white">Cutral Co, Neuquén</p>
                </div>
              </div>

              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(59,130,246,0.1)" }}
                >
                  <Clock className="w-4 h-4" style={{ color: "#60a5fa" }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: "#64748b" }}>Última actualización</p>
                  <p className="text-sm font-semibold text-white">hace 3 minutos</p>
                </div>
              </div>

              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(34,197,94,0.1)" }}
                >
                  <Satellite className="w-4 h-4" style={{ color: "#22c55e" }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: "#64748b" }}>Plataforma</p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-white">BioGPS</p>
                    <CheckCircle className="w-3.5 h-3.5" style={{ color: "#22c55e" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Mini map placeholder */}
            <div
              className="rounded-lg h-32 flex items-center justify-center"
              style={{ backgroundColor: "#0f1f3d", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex flex-col items-center gap-1.5">
                <MapPin className="w-5 h-5" style={{ color: "#334155" }} />
                <span className="text-xs" style={{ color: "#334155" }}>Mapa BioGPS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div
        className="rounded-xl p-4 flex flex-wrap items-center gap-3"
        style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" }}
        >
          <RefreshCw className="w-4 h-4" />
          Reenviar Status Ahora
        </button>
        <button
          onClick={() => onNavigate("alerta")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: "#22c55e", color: "#0a1628" }}
        >
          <CheckCircle className="w-4 h-4" />
          Confirmar Entrega
        </button>
        <button
          type="button"
          onClick={openGmailModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-80 ml-auto"
          style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <ExternalLink className="w-4 h-4" />
          Ver Hilo Gmail
        </button>
      </div>

      {/* Modal Hilo Gmail */}
      {showGmailModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowGmailModal(false)}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] rounded-lg flex flex-col overflow-hidden shadow-2xl"
            style={{ backgroundColor: "#ffffff" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="px-5 py-4 flex items-start justify-between gap-4 flex-shrink-0"
              style={{ borderBottom: "1px solid #e8eaed" }}
            >
              <h2 className="text-base font-normal text-[#202124] leading-snug pr-4">
                {threadSubject}
              </h2>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm text-[#5f6368]">3 de 6</span>
                <button
                  type="button"
                  onClick={() => setShowGmailModal(false)}
                  className="p-1.5 rounded-full transition-colors hover:bg-[#f1f3f4]"
                  style={{ color: "#5f6368" }}
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thread */}
            <div className="flex-1 overflow-y-auto bg-white">
              {gmailThread.map((email, index) => (
                <GmailThreadEmail
                  key={email.id}
                  email={email}
                  expanded={expandedEmails.has(index)}
                  onToggle={() => toggleEmail(index)}
                />
              ))}
            </div>

            {/* Bottom bar */}
            <div
              className="px-5 py-3 flex items-center gap-3 flex-shrink-0"
              style={{ borderTop: "1px solid #e8eaed", backgroundColor: "#ffffff" }}
            >
              <button
                type="button"
                className="px-5 py-2 rounded-full text-sm font-medium transition-colors hover:bg-[#f6f8fc]"
                style={{ color: "#1a73e8", border: "1px solid #dadce0" }}
              >
                Responder
              </button>
              <button
                type="button"
                className="px-5 py-2 rounded-full text-sm font-medium transition-colors hover:bg-[#f6f8fc]"
                style={{ color: "#1a73e8", border: "1px solid #dadce0" }}
              >
                Reenviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
