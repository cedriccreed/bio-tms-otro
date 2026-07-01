"use client"

import { useEffect, useState } from "react"
import { Eye, EyeOff } from "lucide-react"

type Tab = "perfil" | "seguridad" | "preferencias"

function Toggle({
  value,
  onChange,
  label,
}: {
  value: boolean
  onChange: (value: boolean) => void
  label: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm text-gray-900">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={label}
        onClick={() => onChange(!value)}
        style={{
          width: "44px",
          height: "24px",
          borderRadius: "9999px",
          backgroundColor: value ? "#111827" : "#e5e7eb",
          position: "relative",
          border: "none",
          cursor: "pointer",
          transition: "background-color 0.2s",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "2px",
            left: value ? "22px" : "2px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: "white",
            transition: "left 0.2s",
          }}
        />
      </button>
    </div>
  )
}

function TextField({
  label,
  type = "text",
  value,
  onChange,
  disabled,
  hint,
}: {
  label: string
  type?: string
  value: string
  onChange?: (value: string) => void
  disabled?: boolean
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: "#6b7280" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="px-3 py-2.5 rounded-lg text-sm text-gray-900 outline-none transition-all disabled:cursor-not-allowed"
        style={{
          backgroundColor: disabled ? "#f3f4f6" : "#f9fafb",
          border: "1px solid #e5e7eb",
          color: disabled ? "#9ca3af" : "#111827",
        }}
        onFocus={(e) => {
          if (!disabled) e.target.style.borderColor = "#000000"
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#e5e7eb"
        }}
      />
      {hint && (
        <p className="text-xs" style={{ color: "#9ca3af" }}>
          {hint}
        </p>
      )}
    </div>
  )
}

function PasswordField({
  label,
  value,
  onChange,
  error,
  show,
  onToggleShow,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  show: boolean
  onToggleShow: () => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: "#6b7280" }}>
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2.5 pr-10 rounded-lg text-sm text-gray-900 outline-none transition-all"
          style={{ backgroundColor: "#f9fafb", border: `1px solid ${error ? "#dc2626" : "#e5e7eb"}` }}
          onFocus={(e) => {
            if (!error) e.target.style.borderColor = "#000000"
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? "#dc2626" : "#e5e7eb"
          }}
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded transition-all hover:opacity-80"
          style={{ color: "#9ca3af" }}
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && (
        <p className="text-xs" style={{ color: "#dc2626" }}>
          {error}
        </p>
      )}
    </div>
  )
}

function SuccessMessage({ message }: { message: string }) {
  return (
    <div
      className="px-4 py-3 rounded-lg text-sm font-medium"
      style={{ backgroundColor: "rgba(22,163,74,0.08)", color: "#16a34a", border: "1px solid rgba(22,163,74,0.2)" }}
    >
      {message}
    </div>
  )
}

export default function ConfiguracionScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("perfil")

  const [userData, setUserData] = useState({
    nombre: "Alejandro Pérez",
    email: "alejandro@tms.cl",
    telefono: "+56 9 8765 4321",
    cargo: "Supervisor",
    fotoInicial: "AP",
    ultimoAcceso: "Hoy, 08:32 hrs",
  })

  const [perfilForm, setPerfilForm] = useState({
    nombre: userData.nombre,
    email: userData.email,
    telefono: userData.telefono,
  })
  const [perfilSuccess, setPerfilSuccess] = useState(false)

  const [passwordForm, setPasswordForm] = useState({
    actual: "",
    nueva: "",
    confirmar: "",
  })
  const [passwordErrors, setPasswordErrors] = useState({
    actual: "",
    nueva: "",
    confirmar: "",
    general: "",
  })
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [showActual, setShowActual] = useState(false)
  const [showNueva, setShowNueva] = useState(false)
  const [showConfirmar, setShowConfirmar] = useState(false)

  const [preferencias, setPreferencias] = useState({
    alertasDocumentos: true,
    notificacionesOperaciones: true,
    alertasMantenimiento: true,
  })
  const [preferenciasSuccess, setPreferenciasSuccess] = useState(false)

  useEffect(() => {
    if (!perfilSuccess) return
    const timer = setTimeout(() => setPerfilSuccess(false), 3000)
    return () => clearTimeout(timer)
  }, [perfilSuccess])

  useEffect(() => {
    if (!passwordSuccess) return
    const timer = setTimeout(() => setPasswordSuccess(false), 3000)
    return () => clearTimeout(timer)
  }, [passwordSuccess])

  useEffect(() => {
    if (!preferenciasSuccess) return
    const timer = setTimeout(() => setPreferenciasSuccess(false), 3000)
    return () => clearTimeout(timer)
  }, [preferenciasSuccess])

  const tabs: { id: Tab; label: string }[] = [
    { id: "perfil", label: "Mi perfil" },
    { id: "seguridad", label: "Seguridad" },
    { id: "preferencias", label: "Preferencias" },
  ]

  const handleSavePerfil = () => {
    setUserData((prev) => ({
      ...prev,
      nombre: perfilForm.nombre.trim(),
      email: perfilForm.email.trim(),
      telefono: perfilForm.telefono.trim(),
    }))
    setPerfilSuccess(true)
  }

  const handleChangePassword = () => {
    const errors = { actual: "", nueva: "", confirmar: "", general: "" }

    if (!passwordForm.actual.trim()) {
      errors.actual = "Ingresa tu contraseña actual"
    }
    if (passwordForm.nueva.length < 8) {
      errors.nueva = "La contraseña debe tener al menos 8 caracteres"
    }
    if (passwordForm.confirmar !== passwordForm.nueva) {
      errors.confirmar = "Las contraseñas no coinciden"
    }

    setPasswordErrors(errors)

    if (errors.actual || errors.nueva || errors.confirmar) {
      setPasswordSuccess(false)
      return
    }

    setPasswordForm({ actual: "", nueva: "", confirmar: "" })
    setPasswordErrors({ actual: "", nueva: "", confirmar: "", general: "" })
    setPasswordSuccess(true)
  }

  const handleSavePreferencias = () => {
    setPreferenciasSuccess(true)
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Configuración</h1>
        <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>
          Perfil de usuario, seguridad y preferencias del sistema
        </p>
      </div>

      <div className="flex gap-6 border-b" style={{ borderColor: "#e5e7eb" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className="pb-3 text-sm font-medium transition-all"
            style={{
              color: activeTab === tab.id ? "#111827" : "#9ca3af",
              borderBottom: activeTab === tab.id ? "2px solid #000000" : "2px solid transparent",
              marginBottom: "-1px",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
      >
        {activeTab === "perfil" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-3 pb-2">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold text-white"
                style={{ backgroundColor: "#000000" }}
              >
                {userData.fotoInicial}
              </div>
              <button
                type="button"
                onClick={() => alert("Funcionalidad disponible en versión completa")}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                style={{
                  backgroundColor: "transparent",
                  color: "#111827",
                  border: "1px solid #111827",
                }}
              >
                Cambiar foto
              </button>
              <p className="text-xs" style={{ color: "#9ca3af" }}>
                JPG, PNG. Máximo 2MB
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <TextField
                label="Nombre completo"
                value={perfilForm.nombre}
                onChange={(nombre) => setPerfilForm((f) => ({ ...f, nombre }))}
              />
              <TextField
                label="Correo electrónico"
                type="email"
                value={perfilForm.email}
                onChange={(email) => setPerfilForm((f) => ({ ...f, email }))}
              />
              <TextField
                label="Teléfono"
                value={perfilForm.telefono}
                onChange={(telefono) => setPerfilForm((f) => ({ ...f, telefono }))}
              />
              <TextField
                label="Cargo / Rol"
                value={userData.cargo}
                disabled
                hint="El rol es asignado por el administrador"
              />
            </div>

            {perfilSuccess && <SuccessMessage message="Perfil actualizado correctamente" />}

            <button
              type="button"
              onClick={handleSavePerfil}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 text-white"
              style={{ backgroundColor: "#000000", color: "#ffffff" }}
            >
              Guardar cambios
            </button>
          </div>
        )}

        {activeTab === "seguridad" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <PasswordField
                label="Contraseña actual"
                value={passwordForm.actual}
                onChange={(actual) => setPasswordForm((f) => ({ ...f, actual }))}
                error={passwordErrors.actual}
                show={showActual}
                onToggleShow={() => setShowActual((s) => !s)}
              />
              <PasswordField
                label="Nueva contraseña"
                value={passwordForm.nueva}
                onChange={(nueva) => setPasswordForm((f) => ({ ...f, nueva }))}
                error={passwordErrors.nueva}
                show={showNueva}
                onToggleShow={() => setShowNueva((s) => !s)}
              />
              <PasswordField
                label="Confirmar nueva contraseña"
                value={passwordForm.confirmar}
                onChange={(confirmar) => setPasswordForm((f) => ({ ...f, confirmar }))}
                error={passwordErrors.confirmar}
                show={showConfirmar}
                onToggleShow={() => setShowConfirmar((s) => !s)}
              />
            </div>

            {passwordSuccess && <SuccessMessage message="Contraseña actualizada correctamente" />}

            <button
              type="button"
              onClick={handleChangePassword}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 text-white"
              style={{ backgroundColor: "#000000", color: "#ffffff" }}
            >
              Cambiar contraseña
            </button>

            <div
              className="rounded-xl p-4 flex flex-col gap-2 mt-2"
              style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
            >
              <p className="text-sm font-medium text-gray-900">
                Último acceso: {userData.ultimoAcceso}
              </p>
              <p className="text-sm" style={{ color: "#6b7280" }}>
                Dispositivo: Chrome — Windows
              </p>
              <p className="text-sm" style={{ color: "#6b7280" }}>
                IP: 190.160.xxx.xxx
              </p>
            </div>
          </div>
        )}

        {activeTab === "preferencias" && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Notificaciones</h3>
              <div className="flex flex-col divide-y" style={{ borderColor: "#f3f4f6" }}>
                <Toggle
                  label="Alertas de documentos por vencer"
                  value={preferencias.alertasDocumentos}
                  onChange={(alertasDocumentos) =>
                    setPreferencias((p) => ({ ...p, alertasDocumentos }))
                  }
                />
                <Toggle
                  label="Notificaciones de operaciones"
                  value={preferencias.notificacionesOperaciones}
                  onChange={(notificacionesOperaciones) =>
                    setPreferencias((p) => ({ ...p, notificacionesOperaciones }))
                  }
                />
                <Toggle
                  label="Alertas de mantenimiento pendiente"
                  value={preferencias.alertasMantenimiento}
                  onChange={(alertasMantenimiento) =>
                    setPreferencias((p) => ({ ...p, alertasMantenimiento }))
                  }
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Visualización</h3>
              <div className="flex flex-col gap-4">
                <TextField label="Zona horaria" value="América/Santiago" disabled />
                <TextField label="Formato de fecha" value="DD/MM/YYYY" disabled />
              </div>
            </div>

            {preferenciasSuccess && <SuccessMessage message="Preferencias guardadas correctamente" />}

            <button
              type="button"
              onClick={handleSavePreferencias}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 text-white"
              style={{ backgroundColor: "#000000", color: "#ffffff" }}
            >
              Guardar preferencias
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
