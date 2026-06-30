export const VEHICULOS_MOCK = [
  {
    placa: "BJRT45",
    marcaModelo: "Scania R450",
    anio: "2021",
    nMotor: "SC450-2021-001",
    nChasis: "9BSC4X2004B123456",
    polizaRc: "POL-2024-001",
    vigencia: "31/12/2026",
    genSet: "GS-001",
    paut: "PAUT-2024-CL-001",
    permisoInt: "PI-2024-001",
  },
  {
    placa: "FKWM23",
    marcaModelo: "Volvo FH500",
    anio: "2020",
    nMotor: "VL500-2020-002",
    nChasis: "9BVL4X2004B234567",
    polizaRc: "POL-2024-002",
    vigencia: "30/06/2026",
    genSet: "GS-002",
    paut: "PAUT-2024-CL-002",
    permisoInt: "PI-2024-002",
  },
  {
    placa: "GHRP67",
    marcaModelo: "Mercedes Actros 2651",
    anio: "2022",
    nMotor: "MB651-2022-003",
    nChasis: "9BMB4X2004B345678",
    polizaRc: "POL-2024-003",
    vigencia: "31/03/2027",
    genSet: "GS-003",
    paut: "PAUT-2024-CL-003",
    permisoInt: "PI-2024-003",
  },
  {
    placa: "CKND89",
    marcaModelo: "Kenworth T680",
    anio: "2019",
    nMotor: "KW680-2019-004",
    nChasis: "9BKW4X2004B456789",
    polizaRc: "POL-2024-004",
    vigencia: "28/02/2027",
    genSet: "GS-004",
    paut: "PAUT-2024-CL-004",
    permisoInt: "PI-2024-004",
  },
  {
    placa: "HLVT34",
    marcaModelo: "Scania R500",
    anio: "2023",
    nMotor: "SC500-2023-005",
    nChasis: "9BSC4X2004B567890",
    polizaRc: "POL-2024-005",
    vigencia: "31/08/2027",
    genSet: "GS-005",
    paut: "PAUT-2024-CL-005",
    permisoInt: "PI-2024-005",
  },
] as const

export const CONDUCTORES_MOCK = [
  { nombre: "Carlos Fuentes Rojas", rut: "12.345.678-9" },
  { nombre: "Pedro Muñoz Soto", rut: "13.456.789-0" },
  { nombre: "Juan Herrera Lagos", rut: "14.567.890-1" },
  { nombre: "Luis Pérez Castillo", rut: "15.678.901-2" },
  { nombre: "Mario González Vega", rut: "16.789.012-3" },
] as const

export type EstadoConductor = "Disponible" | "No disponible"

export const CONDUCTORES_INICIALES = [
  {
    id: "C001",
    nombre: "Carlos Fuentes Rojas",
    rut: "12.345.678-9",
    telefono: "+56 9 8123 4567",
    vehiculoAsignado: "BJRT45",
    estado: "Disponible" as EstadoConductor,
    activo: true,
  },
  {
    id: "C002",
    nombre: "Pedro Muñoz Soto",
    rut: "13.456.789-0",
    telefono: "+56 9 7234 5678",
    vehiculoAsignado: "FKWM23",
    estado: "Disponible" as EstadoConductor,
    activo: true,
  },
  {
    id: "C003",
    nombre: "Juan Herrera Lagos",
    rut: "14.567.890-1",
    telefono: "+56 9 6345 6789",
    vehiculoAsignado: "GHRP67",
    estado: "No disponible" as EstadoConductor,
    activo: true,
  },
  {
    id: "C004",
    nombre: "Luis Pérez Castillo",
    rut: "15.678.901-2",
    telefono: "+56 9 5456 7890",
    vehiculoAsignado: "CKND89",
    estado: "Disponible" as EstadoConductor,
    activo: true,
  },
  {
    id: "C005",
    nombre: "Mario González Vega",
    rut: "16.789.012-3",
    telefono: "+56 9 4567 8901",
    vehiculoAsignado: "HLVT34",
    estado: "Disponible" as EstadoConductor,
    activo: true,
  },
]

export const VEHICULO_PLACAS = VEHICULOS_MOCK.map((v) => v.placa)
export const CONDUCTOR_NOMBRES = CONDUCTORES_MOCK.map((c) => c.nombre)

export type EstadoOperacion = "En Ruta" | "En Puerto" | "Detenido" | "Entregado"

export type EstadoFacturacion = "En curso" | "Entregado" | "Listo para facturar" | "Facturado"

export interface Operation {
  id: string
  shipper: string
  cliente?: string
  ruta: string
  placa: string
  vehiculo: string
  conductor: string
  estado: EstadoOperacion
  status: string
  statusColor: string
  statusDot: string
  lastEmail: string
  hasConfirm: boolean
  kmRecorridos: number
  estadoFacturacion: EstadoFacturacion
  fecha?: string
  origen?: string
  destino?: string
  horaInicioCarga?: string
  horaInicioDescarga?: string
  guiaDespacho?: string
  tipoCarga?: string
}

export const OPERATIONS_MOCK = [
  {
    id: "OP-001",
    shipper: "Distribuidora Maule Sur",
    ruta: "Ruta 5 Sur — San Antonio → Linares",
    placa: "BJRT45",
    vehiculo: "BJRT45",
    conductor: "Carlos Fuentes Rojas",
    estado: "En Ruta" as const,
    status: "En ruta hacia Linares",
    statusColor: "#ca8a04",
    statusDot: "yellow",
    lastEmail: "Hoy 09:00",
    hasConfirm: false,
    kmRecorridos: 285,
    estadoFacturacion: "En curso" as const,
  },
  {
    id: "OP-002",
    shipper: "Agroexport Valparaíso",
    ruta: "Ruta 68 — San Antonio → Santiago",
    placa: "FKWM23",
    vehiculo: "FKWM23",
    conductor: "Pedro Muñoz Soto",
    estado: "En Puerto" as const,
    status: "En punto de descarga",
    statusColor: "#16a34a",
    statusDot: "green",
    lastEmail: "Hoy 09:00",
    hasConfirm: false,
    kmRecorridos: 120,
    estadoFacturacion: "En curso" as const,
  },
  {
    id: "OP-003",
    shipper: "Comercial O'Higgins",
    ruta: "Ruta 78 — San Antonio → Rancagua",
    placa: "GHRP67",
    vehiculo: "GHRP67",
    conductor: "Juan Herrera Lagos",
    estado: "Detenido" as const,
    status: "Sin señal GPS +2h",
    statusColor: "#dc2626",
    statusDot: "red",
    lastEmail: "Pendiente",
    hasConfirm: false,
    kmRecorridos: 195,
    estadoFacturacion: "En curso" as const,
  },
  {
    id: "OP-004",
    shipper: "Minera Atacama Logistics",
    ruta: "Ruta 5 Norte — Santiago → La Serena",
    placa: "CKND89",
    vehiculo: "CKND89",
    conductor: "Luis Pérez Castillo",
    estado: "En Puerto" as const,
    status: "Llegando a zona de entrega",
    statusColor: "#ea580c",
    statusDot: "orange",
    lastEmail: "Hace 30 min",
    hasConfirm: true,
    kmRecorridos: 470,
    estadoFacturacion: "En curso" as const,
  },
  {
    id: "OP-005",
    shipper: "Frigorífico Los Lagos",
    ruta: "Ruta 7 — Santiago → Puerto Montt",
    placa: "HLVT34",
    vehiculo: "HLVT34",
    conductor: "Mario González Vega",
    estado: "En Ruta" as const,
    status: "Carga confirmada en origen",
    statusColor: "#ca8a04",
    statusDot: "yellow",
    lastEmail: "Hoy 09:00",
    hasConfirm: false,
    kmRecorridos: 1020,
    estadoFacturacion: "En curso" as const,
  },
] as const

export const MANTENIMIENTOS_MOCK = [
  {
    id: "MNT-001",
    tipoServicio: "Cambio de aceite y filtros",
    fecha: "2026-06-25",
    vehiculo: "BJRT45",
    costo: 85000,
    estado: "Pendiente" as const,
  },
  {
    id: "MNT-002",
    tipoServicio: "Revisión técnica anual",
    fecha: "2026-06-22",
    vehiculo: "FKWM23",
    costo: 120000,
    estado: "En proceso" as const,
  },
  {
    id: "MNT-003",
    tipoServicio: "Cambio de neumáticos traseros",
    fecha: "2026-06-20",
    vehiculo: "GHRP67",
    costo: 480000,
    estado: "Completado" as const,
  },
  {
    id: "MNT-004",
    tipoServicio: "Revisión sistema de frenos",
    fecha: "2026-06-28",
    vehiculo: "CKND89",
    costo: 95000,
    estado: "Pendiente" as const,
  },
  {
    id: "MNT-005",
    tipoServicio: "Mantención preventiva 100.000 km",
    fecha: "2026-06-18",
    vehiculo: "HLVT34",
    costo: 650000,
    estado: "Completado" as const,
  },
]

export const VEHICULOS_FLOTA_MOCK = [
  { ...VEHICULOS_MOCK[0], operacion: "OP-001", estado: "Activo", estadoColor: "#16a34a", estadoDot: "green" },
  { ...VEHICULOS_MOCK[1], operacion: "OP-002", estado: "Activo", estadoColor: "#16a34a", estadoDot: "green" },
  { ...VEHICULOS_MOCK[2], operacion: "OP-003", estado: "Activo", estadoColor: "#16a34a", estadoDot: "green" },
  { ...VEHICULOS_MOCK[3], operacion: "OP-004", estado: "En zona final", estadoColor: "#ea580c", estadoDot: "orange" },
  { ...VEHICULOS_MOCK[4], operacion: "OP-005", estado: "Activo", estadoColor: "#16a34a", estadoDot: "green" },
]

export type EstadoSeguimiento = "En ruta" | "Detenido" | "Apagado"

export interface PosicionDemo {
  patente: string
  conductor: string
  cliente: string
  ruta: string
  lat: number
  lng: number
  velocidad: number
  rumbo: number
  estado: EstadoSeguimiento
  ultimaActualizacion: string
}

export const POSICIONES_DEMO: PosicionDemo[] = [
  {
    patente: "BJRT45",
    conductor: "Carlos Fuentes Rojas",
    cliente: "Distribuidora Maule Sur",
    ruta: "Ruta 5 Sur — San Antonio → Linares",
    lat: -34.1703,
    lng: -71.4647,
    velocidad: 85,
    rumbo: 180,
    estado: "En ruta",
    ultimaActualizacion: "Hace 2 min",
  },
  {
    patente: "FKWM23",
    conductor: "Pedro Muñoz Soto",
    cliente: "Agroexport Valparaíso",
    ruta: "Ruta 68 — San Antonio → Santiago",
    lat: -33.6241,
    lng: -71.0436,
    velocidad: 92,
    rumbo: 90,
    estado: "En ruta",
    ultimaActualizacion: "Hace 1 min",
  },
  {
    patente: "GHRP67",
    conductor: "Juan Herrera Lagos",
    cliente: "Comercial O'Higgins",
    ruta: "Ruta 78 — San Antonio → Rancagua",
    lat: -33.9533,
    lng: -70.9358,
    velocidad: 0,
    rumbo: 0,
    estado: "Detenido",
    ultimaActualizacion: "Hace 15 min",
  },
  {
    patente: "CKND89",
    conductor: "Luis Pérez Castillo",
    cliente: "Minera Atacama Logistics",
    ruta: "Ruta 5 Norte — Santiago → La Serena",
    lat: -32.4542,
    lng: -70.9876,
    velocidad: 78,
    rumbo: 0,
    estado: "En ruta",
    ultimaActualizacion: "Hace 3 min",
  },
  {
    patente: "HLVT34",
    conductor: "Mario González Vega",
    cliente: "Frigorífico Los Lagos",
    ruta: "Ruta 7 — Santiago → Puerto Montt",
    lat: -38.7359,
    lng: -72.5904,
    velocidad: 0,
    rumbo: 180,
    estado: "Apagado",
    ultimaActualizacion: "Hace 45 min",
  },
]
