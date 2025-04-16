import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ConvexProvider } from "@/lib/convex-provider"
import { AuthProvider } from "@/lib/auth-context"
// Import the NavigationHandler
import { NavigationHandler } from "@/components/navigation-handler"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Brand Voice Generator",
  description: "Generate a consistent brand voice and compelling content for your business",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexProvider>
          <AuthProvider>
            {/* Add NavigationHandler here */}
            <NavigationHandler />
            {children}
            <Toaster />
          </AuthProvider>
        </ConvexProvider>
      </body>
    </html>
  )
}


import './globals.css'