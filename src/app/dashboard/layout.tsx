import type React from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="h-screen sticky top-0">
        <Sidebar />
      </div>
      <main className="flex-1 w-full p-3 pt-8">{children}</main>
    </div>
  )
}