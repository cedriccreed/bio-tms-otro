"use client"

import { useState } from "react"
import { Truck, Lock, Mail, Eye, EyeOff, Key } from "lucide-react"

interface LoginPageProps {
  onLogin: () => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    setTimeout(() => {
      if (email === "admin@tms.cl" && password === "demo2026") {
        onLogin()
      } else {
        setError("Credenciales incorrectas. Use las credenciales de demo.")
        setLoading(false)
      }
    }, 800)
  }

  const fillDemo = () => {
    setEmail("admin@tms.cl")
    setPassword("demo2026")
    setError("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: "#0a1628" }}>
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,197,94,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(34,197,94,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl border p-8 shadow-2xl"
        style={{
          backgroundColor: "#0f1f3d",
          borderColor: "rgba(255,255,255,0.08)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(34,197,94,0.08)",
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ backgroundColor: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)" }}
          >
            <Truck className="w-8 h-8" style={{ color: "#22c55e" }} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">TMS</h1>
          <p className="text-sm mt-1 font-medium" style={{ color: "#94a3b8" }}>
            Sistema de Tracking Terrestre
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: "#94a3b8" }}>
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#475569" }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@biogps.cl"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-white placeholder:text-slate-500 outline-none transition-all"
                style={{
                  backgroundColor: "#0a1628",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: "#94a3b8" }}>
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#475569" }} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm text-white placeholder:text-slate-500 outline-none transition-all"
                style={{
                  backgroundColor: "#0a1628",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "#475569" }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-all mt-1"
            style={{
              backgroundColor: loading ? "#15803d" : "#22c55e",
              color: "#0a1628",
              opacity: loading ? 0.8 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Verificando..." : "Iniciar Sesión"}
          </button>
        </form>

        {/* Demo credentials */}
        <div
          className="mt-6 rounded-xl p-4 cursor-pointer transition-all hover:border-green-500/40"
          style={{
            backgroundColor: "rgba(34,197,94,0.05)",
            border: "1px solid rgba(34,197,94,0.15)",
          }}
          onClick={fillDemo}
          title="Clic para autocompletar"
        >
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-3.5 h-3.5" style={{ color: "#22c55e" }} />
            <span className="text-xs font-semibold" style={{ color: "#22c55e" }}>
              Credenciales de Demo
            </span>
            <span className="ml-auto text-xs" style={{ color: "#475569" }}>clic para usar</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "#64748b" }}>Usuario:</span>
              <span className="text-xs font-mono" style={{ color: "#cbd5e1" }}>admin@tms.cl</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "#64748b" }}>Contraseña:</span>
              <span className="text-xs font-mono" style={{ color: "#cbd5e1" }}>demo2026</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-6" style={{ color: "#334155" }}>
          TMS v2.0 © 2026
        </p>
      </div>
    </div>
  )
}
