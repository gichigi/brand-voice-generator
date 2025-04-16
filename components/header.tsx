import { Sparkles } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="bg-background border-b border-border p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>Brand Voice Generator</span>
        </Link>
      </div>
    </header>
  )
}
