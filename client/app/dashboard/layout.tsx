import React from 'react'
import { DashboardShell } from "@/components/dashboards/dashboard-shell";

const Layout = ({ children }: {children: React.ReactNode}) => {
  return (
    <DashboardShell>
      {children}
    </DashboardShell>
  )
}

export default Layout