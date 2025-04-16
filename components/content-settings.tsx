"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

interface ContentSettingsProps {
  onSettingsChange: () => void
}

export function ContentSettings({ onSettingsChange }: ContentSettingsProps) {
  const [readingAge, setReadingAge] = useState([12])
  const [wordCount, setWordCount] = useState([500])
  const [imageSuggestions, setImageSuggestions] = useState(false)
  const [includeQuotes, setIncludeQuotes] = useState(false)
  const [customInstructions, setCustomInstructions] = useState("")

  // Call onSettingsChange whenever any setting changes
  const handleSettingChange = () => {
    onSettingsChange()
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Reading Age</Label>
        <Slider
          min={8}
          max={18}
          step={1}
          value={readingAge}
          onValueChange={(value) => {
            setReadingAge(value)
            handleSettingChange()
          }}
        />
        <p className="text-sm text-muted-foreground">{readingAge} years</p>
      </div>

      <div className="space-y-2">
        <Label>Word Count</Label>
        <Slider
          min={100}
          max={1000}
          step={50}
          value={wordCount}
          onValueChange={(value) => {
            setWordCount(value)
            handleSettingChange()
          }}
        />
        <p className="text-sm text-muted-foreground">~{wordCount} words</p>
      </div>

      <div className="flex items-center justify-between">
        <Label>Image Suggestions</Label>
        <Switch
          checked={imageSuggestions}
          onCheckedChange={(checked) => {
            setImageSuggestions(checked)
            handleSettingChange()
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Include Quotes</Label>
        <Switch
          checked={includeQuotes}
          onCheckedChange={(checked) => {
            setIncludeQuotes(checked)
            handleSettingChange()
          }}
        />
      </div>

      <div className="space-y-2">
        <Label>Custom Instructions</Label>
        <Textarea
          placeholder="Add any specific instructions..."
          value={customInstructions}
          onChange={(e) => {
            setCustomInstructions(e.target.value)
            handleSettingChange()
          }}
        />
      </div>
    </div>
  )
}
