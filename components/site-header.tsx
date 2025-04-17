"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Choir</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button>Dashboard</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
