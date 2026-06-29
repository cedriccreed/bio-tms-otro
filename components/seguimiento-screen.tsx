"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import { MoreVertical } from "lucide-react"
import {
  POSICIONES_DEMO,
  VEHICULOS_FLOTA_MOCK,
  VEHICULOS_MOCK,
  type EstadoSeguimiento,
  type PosicionDemo,
} from "@/lib/mock-data"

const SeguimientoMap = dynamic(() => import("./seguimiento-map"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full min-h-[480px] rounded-xl flex items-center justify-center"
      style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
    >
      <p className="text-sm" style={{ color: "#9ca3af" }}>
        Cargando mapa...
      </p>
    </div>
  ),
})

interface SeguimientoScreenProps {
  onNavigate: (screen: string, opId?: string) => void
}

function estadoBadgeStyle(estado: EstadoSeguimiento): { bg: string; color: string; border: string } {
  switch (estado) {
    case "En ruta":
      return { bg: "rgba(0,0,0,0.06)", color: "#16a34a", border: "rgba(0,0,0,0.2)" }
    case "Detenido":
      return { bg: "rgba(234,179,8,0.12)", color: "#ca8a04", border: "rgba(234,179,8,0.25)" }
    case "Apagado":
      return { bg: "rgba(156,163,175,0.12)", color: "#6b7280", border: "rgba(156,163,175,0.25)" }
  }
}

function getMarcaModelo(patente: string): string {
  const vehiculo = VEHICULOS_MOCK.find((v) => v.placa === patente)
  return vehiculo?.marcaModelo ?? "—"
}

function getOperacionId(patente: string): string | undefined {
  return VEHICULOS_FLOTA_MOCK.find((v) => v.placa === patente)?.operacion
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs" style={{ color: "#9ca3af" }}>
        {label}
      </span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  )
}

export default function SeguimientoScreen({ onNavigate }: SeguimientoScreenProps) {
  const [selectedPatente, setSelectedPatente] = useState<string | null>(POSICIONES_DEMO[0]?.patente ?? null)
  const [openMenuPatente, setOpenMenuPatente] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const posiciones = POSICIONES_DEMO
  const activos = posiciones.filter((p) => p.estado !== "Apagado").length
  const selected = posiciones.find((p) => p.patente === selectedPatente) ?? null

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuPatente(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleVerDetalle = (pos: PosicionDemo) => {
    setOpenMenuPatente(null)
    const opId = getOperacionId(pos.patente)
    if (opId) onNavigate("detalle", opId)
  }

  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl font-bold text-gray-900">Seguimiento de Operaciones</h1>
          <span
            className="px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: "rgba(0,0,0,0.06)", color: "#16a34a", border: "1px solid rgba(0,0,0,0.15)" }}
          >
            {activos} vehículos activos
          </span>
        </div>
        <p className="text-sm" style={{ color: "#9ca3af" }}>
          Posiciones GPS en tiempo real (demo)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left panel */}
        <div className="lg:col-span-1 flex flex-col gap-4 min-h-0">
          <div
            className="rounded-xl overflow-hidden flex flex-col min-h-[320px] max-h-[520px] lg:max-h-none lg:flex-1"
            style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
          >
            <div className="px-4 py-3 border-b flex-shrink-0" style={{ borderColor: "#e5e7eb" }}>
              <h2 className="text-sm font-semibold text-gray-900">Flota en ruta</h2>
            </div>
            <div className="overflow-y-auto flex-1 p-3 flex flex-col gap-2">
              {posiciones.map((pos) => {
                const badge = estadoBadgeStyle(pos.estado)
                const isSelected = selectedPatente === pos.patente
                return (
                  <div
                    key={pos.patente}
                    className="relative rounded-xl p-3 cursor-pointer transition-all"
                    style={{
                      backgroundColor: isSelected ? "#f9fafb" : "#ffffff",
                      border: isSelected ? "2px solid #000000" : "1px solid #e5e7eb",
                    }}
                    onClick={() => setSelectedPatente(pos.patente)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <span className="text-sm font-mono font-bold text-gray-900">{pos.patente}</span>
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{
                            backgroundColor: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                          }}
                        >
                          {pos.estado}
                        </span>
                      </div>
                      <div className="relative flex-shrink-0" ref={openMenuPatente === pos.patente ? menuRef : undefined}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpenMenuPatente(openMenuPatente === pos.patente ? null : pos.patente)
                          }}
                          className="p-1 rounded-lg transition-all hover:opacity-80"
                          style={{ color: "#9ca3af" }}
                          aria-label="Más opciones"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {openMenuPatente === pos.patente && (
                          <div
                            className="absolute right-0 top-8 z-20 min-w-[140px] rounded-lg py-1 shadow-lg"
                            style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleVerDetalle(pos)
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-medium transition-colors hover:bg-gray-50 text-gray-900"
                            >
                              Ver detalle
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex flex-col gap-0.5">
                      <p className="text-sm text-gray-900">{pos.conductor}</p>
                      <p className="text-xs" style={{ color: "#6b7280" }}>
                        {pos.cliente}
                      </p>
                    </div>
                    <div className="mt-2 pt-2 border-t flex flex-col gap-1" style={{ borderColor: "#f3f4f6" }}>
                      <p className="text-xs" style={{ color: "#6b7280" }}>
                        {pos.ruta}
                      </p>
                      <div className="flex items-center justify-between gap-2 text-xs" style={{ color: "#9ca3af" }}>
                        <span>{pos.velocidad} km/h</span>
                        <span>{pos.ultimaActualizacion}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {selected && (
            <div
              className="rounded-xl p-4 flex-shrink-0"
              style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
            >
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Detalle del vehículo</h3>
              <div className="grid grid-cols-2 gap-3">
                <DetailRow label="Patente" value={selected.patente} />
                <DetailRow label="Modelo" value={getMarcaModelo(selected.patente)} />
                <DetailRow label="Conductor" value={selected.conductor} />
                <DetailRow label="Cliente" value={selected.cliente} />
                <DetailRow label="Ruta actual" value={selected.ruta} />
                <DetailRow label="Velocidad actual" value={`${selected.velocidad} km/h`} />
                <DetailRow label="Último update" value={selected.ultimaActualizacion} />
                <DetailRow label="Estado" value={selected.estado} />
                <div className="col-span-2">
                  <DetailRow
                    label="Coordenadas"
                    value={`${selected.lat.toFixed(4)}, ${selected.lng.toFixed(4)}`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right panel — map */}
        <div
          className="lg:col-span-2 rounded-xl overflow-hidden min-h-[480px]"
          style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
        >
          <SeguimientoMap
            posiciones={posiciones}
            selectedPatente={selectedPatente}
            onSelectPatente={setSelectedPatente}
          />
        </div>
      </div>
    </div>
  )
}
