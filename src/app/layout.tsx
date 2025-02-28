import { Inter } from "next/font/google"
import "./globals.css"
import type React from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import AuthProvider from "@/context/AuthProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Spendly",
  description: "Manage your finances smarter with AI-driven insights and budgeting tools.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={`${inter.className} overflow-x-hidden`}>
            <Navbar />
            {children}
            <Footer />
        </body>
      </AuthProvider>
    </html>
  )
}