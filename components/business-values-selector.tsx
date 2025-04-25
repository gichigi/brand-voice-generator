"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

// Common business values
const BUSINESS_VALUES = [
  "Innovation",
  "Quality",
  "Customer Focus",
  "Integrity",
  "Collaboration",
  "Accessibility",
  "Sustainability",
  "Diversity",
  "Transparency",
  "Excellence",
  "Creativity",
  "Trust",
]

interface BusinessValuesSelectorProps {
  value: string[]
  onChange: (value: string[]) => void
  maxSelections?: number
}

export function BusinessValuesSelector({ value = [], onChange, maxSelections = 5 }: BusinessValuesSelectorProps) {
  const [customValue, setCustomValue] = useState("")

  const handleToggleValue = (businessValue: string) => {
    if (value.includes(businessValue)) {
      // Remove if already selected (deselect)
      onChange(value.filter((v) => v !== businessValue))
    } else if (value.length < maxSelections) {
      // Add if not at max limit
      onChange([...value, businessValue])
    }
  }

  const handleAddCustomValue = () => {
    if (!customValue.trim() || value.includes(customValue) || value.length >= maxSelections) return
    onChange([...value, customValue])
    setCustomValue("")
  }

  const isMaxReached = value.length >= maxSelections

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9 16H15M12 12V19M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Your Selected Values ({value.length}/{maxSelections})
        </Label>
        <div className="mt-2 flex flex-wrap gap-2 min-h-[60px] p-3 border rounded-md bg-gray-50">
          {value.length === 0 ? (
            <div className="text-base text-muted-foreground py-1 px-2">No values selected</div>
          ) : (
            value.map((businessValue, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1.5 text-base">
                {businessValue}
                <button
                  type="button"
                  onClick={() => onChange(value.filter((v) => v !== businessValue))}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </button>
              </Badge>
            ))
          )}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium text-foreground mb-3 block pb-2">Common Business Values</Label>
        <div className="flex flex-wrap gap-2 mb-4">
          {BUSINESS_VALUES.map((businessValue) => (
            <button
              key={businessValue}
              type="button"
              disabled={isMaxReached && !value.includes(businessValue)}
              className={`px-4 py-2 text-base font-normal rounded-lg border ${
                value.includes(businessValue)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
              } ${isMaxReached && !value.includes(businessValue) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              onClick={() => handleToggleValue(businessValue)}
            >
              {businessValue}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="custom-value">Add Custom Value</Label>
        <div className="flex gap-2">
          <Input
            id="custom-value"
            placeholder="E.g., Playfulness"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                customValue.trim() &&
                !value.includes(customValue) &&
                value.length < maxSelections
              ) {
                e.preventDefault()
                handleAddCustomValue()
              }
            }}
            className="flex-1"
            disabled={isMaxReached}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddCustomValue}
            disabled={!customValue.trim() || value.includes(customValue) || value.length >= maxSelections}
          >
            Add
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Add any specific values not listed above</p>
      </div>
    </div>
  )
}
