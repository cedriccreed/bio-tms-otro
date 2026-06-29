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
    <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] p-4">
      <div
        className="w-full max-w-md rounded-2xl border border-[#e5e7eb] bg-white p-8 shadow-sm"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-black">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111827]">TMS</h1>
          <p className="text-sm mt-1 font-medium text-[#6b7280]">
            Sistema de Tracking Terrestre
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#6b7280]">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@biogps.cl"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-[#111827] placeholder:text-gray-400 outline-none transition-all bg-[#f9fafb] border border-[#e5e7eb]"
                onFocus={(e) => (e.target.style.borderColor = "#000000")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#6b7280]">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm text-[#111827] placeholder:text-gray-400 outline-none transition-all bg-[#f9fafb] border border-[#e5e7eb]"
                onFocus={(e) => (e.target.style.borderColor = "#000000")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs px-3 py-2 rounded-lg bg-red-50 text-[#dc2626] border border-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-all mt-1"
            style={{
              backgroundColor: loading ? "#374151" : "#000000",
              opacity: loading ? 0.8 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Verificando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div
          className="mt-6 rounded-xl p-4 cursor-pointer transition-all border border-[#e5e7eb] bg-[#f9fafb] hover:border-gray-300"
          onClick={fillDemo}
          title="Clic para autocompletar"
        >
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-3.5 h-3.5 text-[#111827]" />
            <span className="text-xs font-semibold text-[#111827]">
              Credenciales de Demo
            </span>
            <span className="ml-auto text-xs text-[#9ca3af]">clic para usar</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#9ca3af]">Usuario:</span>
              <span className="text-xs font-mono text-[#374151]">admin@tms.cl</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#9ca3af]">Contraseña:</span>
              <span className="text-xs font-mono text-[#374151]">demo2026</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs mt-6 text-[#9ca3af]">
          TMS v2.0 © 2026
        </p>
      </div>
    </div>
  )
}
