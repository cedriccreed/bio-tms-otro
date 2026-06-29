"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from "react-leaflet"
import type { EstadoSeguimiento, PosicionDemo } from "@/lib/mock-data"
import "leaflet/dist/leaflet.css"

const CHILE_CENTER: [number, number] = [-35.6751, -71.543]
const DEFAULT_ZOOM = 6

function estadoColor(estado: EstadoSeguimiento): string {
  switch (estado) {
    case "En ruta":
      return "#16a34a"
    case "Detenido":
      return "#ca8a04"
    case "Apagado":
      return "#6b7280"
  }
}

function createVehicleIcon(color: string, rumbo: number): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
        <div style="
          position:absolute;
          top:2px;
          left:50%;
          width:0;
          height:0;
          margin-left:-6px;
          border-left:6px solid transparent;
          border-right:6px solid transparent;
          border-bottom:10px solid ${color};
          transform:rotate(${rumbo}deg);
          transform-origin:center 18px;
          filter:drop-shadow(0 1px 1px rgba(0,0,0,0.25));
        "></div>
        <div style="
          width:26px;
          height:26px;
          border-radius:50%;
          background:${color};
          border:2px solid #ffffff;
          box-shadow:0 2px 6px rgba(0,0,0,0.25);
        "></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })
}

function MapController({
  selectedPatente,
  posiciones,
}: {
  selectedPatente: string | null
  posiciones: PosicionDemo[]
}) {
  const map = useMap()

  useEffect(() => {
    if (!selectedPatente) {
      map.flyTo(CHILE_CENTER, DEFAULT_ZOOM, { duration: 0.8 })
      return
    }
    const selected = posiciones.find((p) => p.patente === selectedPatente)
    if (selected) {
      map.flyTo([selected.lat, selected.lng], 9, { duration: 0.8 })
    }
  }, [selectedPatente, posiciones, map])

  return null
}

function VehicleMarker({
  pos,
  isSelected,
  onSelect,
}: {
  pos: PosicionDemo
  isSelected: boolean
  onSelect: () => void
}) {
  const markerRef = useRef<L.Marker>(null)
  const color = estadoColor(pos.estado)

  useEffect(() => {
    if (isSelected) {
      markerRef.current?.openPopup()
    }
  }, [isSelected])

  return (
    <Marker
      ref={markerRef}
      position={[pos.lat, pos.lng]}
      icon={createVehicleIcon(color, pos.rumbo)}
      eventHandlers={{ click: onSelect }}
    >
      <Tooltip direction="top" offset={[0, -12]} opacity={0.95}>
        <span className="text-xs font-mono font-semibold">{pos.patente}</span>
      </Tooltip>
      <Popup>
        <div className="text-sm flex flex-col gap-1 min-w-[180px]">
          <p className="font-mono font-bold">{pos.patente}</p>
          <p>{pos.conductor}</p>
          <p className="text-gray-600">{pos.cliente}</p>
          <p className="text-xs text-gray-500">{pos.ruta}</p>
          <p className="text-xs">
            <strong>Velocidad:</strong> {pos.velocidad} km/h
          </p>
          <p className="text-xs">
            <strong>Estado:</strong> {pos.estado}
          </p>
        </div>
      </Popup>
    </Marker>
  )
}

interface SeguimientoMapProps {
  posiciones: PosicionDemo[]
  selectedPatente: string | null
  onSelectPatente: (patente: string) => void
}

export default function SeguimientoMap({
  posiciones,
  selectedPatente,
  onSelectPatente,
}: SeguimientoMapProps) {
  return (
    <MapContainer
      center={CHILE_CENTER}
      zoom={DEFAULT_ZOOM}
      className="w-full h-full rounded-xl"
      style={{ minHeight: 480, backgroundColor: "#f9fafb" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController selectedPatente={selectedPatente} posiciones={posiciones} />
      {posiciones.map((pos) => (
        <VehicleMarker
          key={pos.patente}
          pos={pos}
          isSelected={selectedPatente === pos.patente}
          onSelect={() => onSelectPatente(pos.patente)}
        />
      ))}
    </MapContainer>
  )
}
