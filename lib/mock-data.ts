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

export type TipoEntidad = "Vehiculo" | "Conductor"
export type EstadoDocumento = "Vigente" | "Por vencer" | "Vencido"

export interface DocumentoCentral {
  id: string
  tipoEntidad: TipoEntidad
  entidadId: string
  entidadNombre: string
  tipoDocumento: string
  fechaInicio: string
  fechaFin: string
  fechaUltimoControl: string | null
  fechaProximoControl: string | null
  archivoNombre: string | null
}

export function calcularEstadoDocumento(fechaFin: string): EstadoDocumento {
  const hoy = new Date()
  const vencimiento = new Date(fechaFin)
  const diasRestantes = Math.ceil(
    (vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
  )
  if (diasRestantes < 0) return "Vencido"
  if (diasRestantes <= 30) return "Por vencer"
  return "Vigente"
}

export interface ConductorFlota {
  id: string
  nombre: string
  rut: string
  telefono: string
  vehiculoAsignado: string
  estado: EstadoConductor
  activo: boolean
}

export const CONDUCTORES_INICIALES: ConductorFlota[] = [
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

export interface CambioOperacion {
  id: string
  fecha: string
  campo: "Vehículo" | "Conductor" | "Estado" | "Facturación"
  valorAnterior: string
  valorNuevo: string
}

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
  // kmRecorridos: calculado automáticamente por GPS
  // desde inicio hasta fin de operación, no estimado
  kmRecorridos: number
  estadoFacturacion: EstadoFacturacion
  fecha?: string
  origen?: string
  destino?: string
  horaInicioCarga?: string
  horaInicioDescarga?: string
  guiaDespacho?: string
  tipoCarga?: string
  historialCambios?: CambioOperacion[]
}

export const OPERATIONS_MOCK: Operation[] = [
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
    historialCambios: [],
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
    historialCambios: [],
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
    historialCambios: [],
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
    historialCambios: [],
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
    historialCambios: [],
  },
]

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

export type EstadoVehiculo = "Activo" | "Inactivo"

export interface VehiculoFlota {
  id: string
  placa: string
  marca: string
  modelo: string
  anio: string
  vin: string
  estado: EstadoVehiculo
  operacionAsociada: string | null
}

export const VEHICULOS_FLOTA_MOCK: VehiculoFlota[] = [
  {
    id: "V001",
    placa: "BJRT45",
    marca: "Scania",
    modelo: "R450",
    anio: "2021",
    vin: "9BSC4X2004B123456",
    estado: "Activo",
    operacionAsociada: null,
  },
  {
    id: "V002",
    placa: "FKWM23",
    marca: "Volvo",
    modelo: "FH500",
    anio: "2020",
    vin: "9BVL4X2004B234567",
    estado: "Activo",
    operacionAsociada: null,
  },
  {
    id: "V003",
    placa: "GHRP67",
    marca: "Mercedes",
    modelo: "Actros 2651",
    anio: "2022",
    vin: "9BMB4X2004B345678",
    estado: "Activo",
    operacionAsociada: null,
  },
  {
    id: "V004",
    placa: "CKND89",
    marca: "Kenworth",
    modelo: "T680",
    anio: "2019",
    vin: "9BKW4X2004B456789",
    estado: "Activo",
    operacionAsociada: null,
  },
  {
    id: "V005",
    placa: "HLVT34",
    marca: "Scania",
    modelo: "R500",
    anio: "2023",
    vin: "9BSC4X2004B567890",
    estado: "Activo",
    operacionAsociada: null,
  },
]

export const DOCUMENTOS_MOCK: DocumentoCentral[] = [
  {
    id: "DOC-001",
    tipoEntidad: "Vehiculo",
    entidadId: "BJRT45",
    entidadNombre: "BJRT45",
    tipoDocumento: "Permiso de circulación",
    fechaInicio: "2026-03-15",
    fechaFin: "2027-03-15",
    fechaUltimoControl: "2026-03-15",
    fechaProximoControl: "2027-03-15",
    archivoNombre: "permiso_bjrt45.pdf",
  },
  {
    id: "DOC-002",
    tipoEntidad: "Vehiculo",
    entidadId: "BJRT45",
    entidadNombre: "BJRT45",
    tipoDocumento: "Revisión técnica",
    fechaInicio: "2026-01-10",
    fechaFin: "2026-07-10",
    fechaUltimoControl: "2026-01-10",
    fechaProximoControl: "2026-07-10",
    archivoNombre: "revision_bjrt45.pdf",
  },
  {
    id: "DOC-003",
    tipoEntidad: "Vehiculo",
    entidadId: "FKWM23",
    entidadNombre: "FKWM23",
    tipoDocumento: "Seguro obligatorio SOAP",
    fechaInicio: "2025-07-05",
    fechaFin: "2026-07-05",
    fechaUltimoControl: null,
    fechaProximoControl: null,
    archivoNombre: "soap_fkwm23.pdf",
  },
  {
    id: "DOC-004",
    tipoEntidad: "Vehiculo",
    entidadId: "GHRP67",
    entidadNombre: "GHRP67",
    tipoDocumento: "Revisión técnica",
    fechaInicio: "2025-09-30",
    fechaFin: "2026-09-30",
    fechaUltimoControl: "2025-09-30",
    fechaProximoControl: "2026-09-30",
    archivoNombre: "revision_ghrp67.pdf",
  },
  {
    id: "DOC-005",
    tipoEntidad: "Vehiculo",
    entidadId: "CKND89",
    entidadNombre: "CKND89",
    tipoDocumento: "Permiso de circulación",
    fechaInicio: "2025-07-02",
    fechaFin: "2026-07-02",
    fechaUltimoControl: null,
    fechaProximoControl: null,
    archivoNombre: "permiso_cknd89.pdf",
  },
  {
    id: "DOC-006",
    tipoEntidad: "Conductor",
    entidadId: "C001",
    entidadNombre: "Carlos Fuentes Rojas",
    tipoDocumento: "Licencia clase A4",
    fechaInicio: "2021-09-15",
    fechaFin: "2026-09-15",
    fechaUltimoControl: null,
    fechaProximoControl: null,
    archivoNombre: "licencia_c001.pdf",
  },
  {
    id: "DOC-007",
    tipoEntidad: "Conductor",
    entidadId: "C002",
    entidadNombre: "Pedro Muñoz Soto",
    tipoDocumento: "Licencia clase A4",
    fechaInicio: "2021-07-08",
    fechaFin: "2026-07-08",
    fechaUltimoControl: null,
    fechaProximoControl: null,
    archivoNombre: "licencia_c002.pdf",
  },
  {
    id: "DOC-008",
    tipoEntidad: "Conductor",
    entidadId: "C003",
    entidadNombre: "Juan Herrera Lagos",
    tipoDocumento: "Certificado de antecedentes",
    fechaInicio: "2025-08-14",
    fechaFin: "2026-08-14",
    fechaUltimoControl: null,
    fechaProximoControl: null,
    archivoNombre: "antecedentes_c003.pdf",
  },
  {
    id: "DOC-009",
    tipoEntidad: "Conductor",
    entidadId: "C004",
    entidadNombre: "Luis Pérez Castillo",
    tipoDocumento: "Licencia clase A4",
    fechaInicio: "2021-07-25",
    fechaFin: "2026-07-25",
    fechaUltimoControl: null,
    fechaProximoControl: null,
    archivoNombre: "licencia_c004.pdf",
  },
  {
    id: "DOC-010",
    tipoEntidad: "Vehiculo",
    entidadId: "HLVT34",
    entidadNombre: "HLVT34",
    tipoDocumento: "Seguro obligatorio SOAP",
    fechaInicio: "2025-08-08",
    fechaFin: "2026-08-08",
    fechaUltimoControl: null,
    fechaProximoControl: null,
    archivoNombre: "soap_hlvt34.pdf",
  },
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

export interface CompraCombustible {
  id: string
  fecha: string
  vehiculo: string
  litros: number
  precioLitro: number
  costoTotal: number
  kilometraje: number
  estacion: string
}

export const COMBUSTIBLE_MOCK: CompraCombustible[] = [
  {
    id: "COMB-001",
    fecha: "2026-06-20",
    vehiculo: "BJRT45",
    litros: 180,
    precioLitro: 980,
    costoTotal: 176400,
    kilometraje: 145200,
    estacion: "Copec San Antonio",
  },
  {
    id: "COMB-002",
    fecha: "2026-06-21",
    vehiculo: "FKWM23",
    litros: 165,
    precioLitro: 975,
    costoTotal: 160875,
    kilometraje: 98400,
    estacion: "Shell Talca",
  },
  {
    id: "COMB-003",
    fecha: "2026-06-22",
    vehiculo: "GHRP67",
    litros: 195,
    precioLitro: 982,
    costoTotal: 191490,
    kilometraje: 210500,
    estacion: "Copec Rancagua",
  },
  {
    id: "COMB-004",
    fecha: "2026-06-23",
    vehiculo: "CKND89",
    litros: 210,
    precioLitro: 978,
    costoTotal: 205380,
    kilometraje: 178300,
    estacion: "Petrobras La Serena",
  },
  {
    id: "COMB-005",
    fecha: "2026-06-24",
    vehiculo: "HLVT34",
    litros: 175,
    precioLitro: 985,
    costoTotal: 172375,
    kilometraje: 256800,
    estacion: "Copec Santiago",
  },
  {
    id: "COMB-006",
    fecha: "2026-06-25",
    vehiculo: "BJRT45",
    litros: 170,
    precioLitro: 990,
    costoTotal: 168300,
    kilometraje: 145800,
    estacion: "Copec San Antonio",
  },
]

export function calcularCostoCombustiblePorOperacion(
  placa: string,
  kmRecorridos: number
): number {
  const comprasVehiculo = COMBUSTIBLE_MOCK.filter((c) => c.vehiculo === placa)
  if (comprasVehiculo.length === 0 || kmRecorridos === 0) return 0

  const totalLitros = comprasVehiculo.reduce((sum, c) => sum + c.litros, 0)
  const totalCosto = comprasVehiculo.reduce((sum, c) => sum + c.costoTotal, 0)
  const costoPromedioPorLitro = totalCosto / totalLitros

  const litrosEstimados = kmRecorridos / 2.8
  return Math.round(litrosEstimados * costoPromedioPorLitro)
}

export function calcularCostoPorKm(placa: string): number {
  const comprasVehiculo = COMBUSTIBLE_MOCK.filter((c) => c.vehiculo === placa)
  if (comprasVehiculo.length === 0) return 0

  const totalLitros = comprasVehiculo.reduce((sum, c) => sum + c.litros, 0)
  const totalCosto = comprasVehiculo.reduce((sum, c) => sum + c.costoTotal, 0)
  const costoPromedioPorLitro = totalCosto / totalLitros
  const consumoPromedio = 2.8

  return Math.round(costoPromedioPorLitro / consumoPromedio)
}
