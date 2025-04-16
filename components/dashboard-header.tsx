"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, Sparkles } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-xl font-bold">Brand Voice Generator</span>
        </Link>
      </div>
    </header>
  )
}
