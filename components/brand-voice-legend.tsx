"use client"

import { Badge } from "./ui/badge"

interface BrandVoicePillar {
  id: string
  index: number
  title: string
}

interface BrandVoiceLegendProps {
  pillars: BrandVoicePillar[]
}

const PILLAR_COLORS = [
  "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
]

export function BrandVoiceLegend({ pillars }: BrandVoiceLegendProps) {
  return (
    <div className="flex gap-2">
      {pillars.map((pillar) => (
        <Badge
          key={pillar.id}
          variant="secondary"
          className={`${PILLAR_COLORS[pillar.index % 3]} font-normal`}
        >
          {pillar.title}
        </Badge>
      ))}
    </div>
  )
}
