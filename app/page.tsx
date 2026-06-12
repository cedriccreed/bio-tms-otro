"use client"

import { useState } from "react"
import LoginPage from "@/components/login-page"
import DashboardApp from "@/components/dashboard-app"

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />
  }

  return <DashboardApp onLogout={() => setIsLoggedIn(false)} />
}
