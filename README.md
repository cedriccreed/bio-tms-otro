# TMS — Sistema de Gestión de Transporte

Demo desarrollada por Bitek SpA / BioGPS Chile.

---

## Acceso a la demo

URL: (completar con link de Vercel)
Usuario: admin@tms.cl
Contraseña: demo2026

---

## Flujo de la demo

### 1. Dashboard

Al ingresar se ve el panel principal con:

- Estadísticas de operaciones activas
- Camiones en ruta
- Alertas pendientes
- Banner de alerta activa

### 2. Operaciones

Lista completa de operaciones en curso.
Desde aquí se puede:

- Ver el detalle de cada operación
- Editar la operación: cambiar vehículo, conductor y estado
- Reenviar el status al cliente
- Confirmar la entrega

### 3. Nueva Operación

Formulario para crear una operación nueva con:

- Referencia del booking
- Puerto origen y destino
- Buque y naviera
- Cliente/Shipper
- Asignación de vehículo y horarios de status

### 4. Detalle de Operación

Vista completa de una operación con:

- Datos del booking
- Estado actual del vehículo
- Historial de emails enviados al cliente
- Opción de reenviar status manualmente

### 5. Alerta de zona final

Cuando el camión llega a destino:

- El sistema genera una alerta automática
- El supervisor confirma la entrega
- Se genera el email de cierre al cliente

### 6. Vehiculos

Gestión de la flota de camiones disponibles.

### 7. Mantenimientos

Registro y seguimiento de servicios de mantenimiento:

- Tipo de servicio
- Fecha
- Vehículo asignado
- Costo
- Estado: Pendiente, En proceso, Completado

### 8. Configuracion

Gestión de clientes, contactos y puntos de referencia del recorrido.

---

## Notas para la presentacion

- Todos los datos son de demostración
- El flujo real integra GPS en tiempo real via BioGPS
- El sistema envía emails automáticos en los horarios configurados por el supervisor
- La detección de llegada a destino es automática via puntos de referencia configurables

---

Desarrollado por Cedric Lavin para Bitek SpA — Junio 2026
