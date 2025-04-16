"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon, Sparkles, Sun, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Check for system preference or stored preference
    const stored = localStorage.getItem("theme")
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const initialTheme = stored || systemPreference

    setTheme(initialTheme as "light" | "dark")
    document.documentElement.classList.toggle("dark", initialTheme === "dark")

    // Cleanup function to prevent memory leaks
    return () => {
      // No cleanup needed for this effect
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark")
    localStorage.setItem("theme", newTheme)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background z-50 sticky top-0">
        <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2 font-bold text-lg sm:text-xl">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="truncate">Brand Voice Generator</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Desktop navigation - centered */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            <Link href="/dashboard" className="text-sm font-medium text-primary">
              Dashboard
            </Link>
            <Link href="/dashboard/content/new" className="text-sm font-medium">
              Create New Content
            </Link>
            <Link href="/dashboard/history" className="text-sm font-medium">
              Library
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme}>
              <span className="sr-only">Toggle theme</span>
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b">
            <nav className="flex flex-col py-3 px-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium py-2 px-2 hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/content/new"
                className="text-sm font-medium py-2 px-2 hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Create New Content
              </Link>
              <Link
                href="/dashboard/history"
                className="text-sm font-medium py-2 px-2 hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Library
              </Link>
            </nav>
          </div>
        )}
      </header>
      <div className="flex flex-1 w-full p-0 overflow-auto">{children}</div>
    </div>
  )
}
