import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ConvexProvider } from "@/lib/convex-provider"
import { AuthProvider } from "@/lib/auth-context"
import { NavigationHandler } from "@/components/navigation-handler"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Choir | Harmonizing Your Brand Voice",
  description:
    "Create content that resonates with your audience. Choir helps you find your unique brand voice and compose compelling content that sings.",
  keywords: "brand voice, content creation, AI writing, brand consistency, marketing content",
  openGraph: {
    title: "Choir | Harmonizing Your Brand Voice",
    description:
      "Create content that resonates with your audience. Choir helps you find your unique brand voice and compose compelling content that sings.",
    type: "website",
    locale: "en_US",
    url: "https://choirapp.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Choir | Harmonizing Your Brand Voice",
    description:
      "Create content that resonates with your audience. Choir helps you find your unique brand voice and compose compelling content that sings.",
  },
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
            <NavigationHandler />
            {children}
            <Toaster />
          </AuthProvider>
        </ConvexProvider>
      </body>
    </html>
  )
}
