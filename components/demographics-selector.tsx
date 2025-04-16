"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Reduced set of demographic options
const DEMOGRAPHICS = {
  // Core demographics - reduced to most common
  ageGroups: ["18-24", "25-34", "35-44", "45-54+"],
  gender: ["All Genders", "Male", "Female"],
  locations: ["Global", "North America", "Europe", "Asia-Pacific", "Latin America"],
  interests: ["Technology", "Business", "Entertainment", "Education", "Health"],

  // Business categories - reduced to most common
  businessType: [
    "B2C",
    "B2B",
    "Small Business",
    "Mid-size Business",
    "Enterprise",
    "Startups",
    "E-commerce",
    "SaaS Companies",
  ],
  businessRoles: [
    "C-Level Executives",
    "Business Owners",
    "Product Managers",
    "Developers",
    "Designers",
    "Marketing Teams",
    "Content Creators",
  ],
}

interface DemographicsSelectorProps {
  value: string[]
  onChange: (value: string[]) => void
  maxSelections?: number
}

export function DemographicsSelector({ value = [], onChange, maxSelections = 10 }: DemographicsSelectorProps) {
  const [customDemographic, setCustomDemographic] = useState("")
  const [activeTab, setActiveTab] = useState("people")

  const handleToggleDemographic = (demographic: string) => {
    if (value.includes(demographic)) {
      // Remove if already selected (deselect)
      onChange(value.filter((d) => d !== demographic))
    } else if (value.length < maxSelections) {
      // Add if not at max limit
      onChange([...value, demographic])
    }
  }

  const handleAddCustomDemographic = () => {
    if (!customDemographic.trim() || value.includes(customDemographic) || value.length >= maxSelections) return
    onChange([...value, customDemographic])
    setCustomDemographic("")
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base">
          Selected Demographics ({value.length}/{maxSelections})
        </Label>
        <div className="mt-2 flex flex-wrap gap-2 min-h-[60px] p-3 border rounded-md bg-background">
          {value.length === 0 ? (
            <div className="text-sm text-muted-foreground">No demographics selected</div>
          ) : (
            value.map((demographic, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {demographic}
                <button
                  type="button"
                  onClick={() => onChange(value.filter((d) => d !== demographic))}
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

      <Tabs defaultValue="people" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        <TabsContent value="people" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-base font-semibold text-foreground mb-3 block border-b pb-2">Age Groups</Label>
              <div className="flex flex-wrap gap-2">
                {DEMOGRAPHICS.ageGroups.map((age) => (
                  <Badge
                    key={age}
                    variant={value.includes(age) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/90 hover:text-primary-foreground"
                    onClick={() => handleToggleDemographic(age)}
                  >
                    {age}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold text-foreground mb-3 block border-b pb-2">Gender</Label>
              <div className="flex flex-wrap gap-2">
                {DEMOGRAPHICS.gender.map((item) => (
                  <Badge
                    key={item}
                    variant={value.includes(item) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/90 hover:text-primary-foreground"
                    onClick={() => handleToggleDemographic(item)}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold text-foreground mb-3 block border-b pb-2">Location</Label>
              <div className="flex flex-wrap gap-2">
                {DEMOGRAPHICS.locations.map((item) => (
                  <Badge
                    key={item}
                    variant={value.includes(item) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/90 hover:text-primary-foreground"
                    onClick={() => handleToggleDemographic(item)}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold text-foreground mb-3 block border-b pb-2">Interests</Label>
              <div className="flex flex-wrap gap-2">
                {DEMOGRAPHICS.interests.map((item) => (
                  <Badge
                    key={item}
                    variant={value.includes(item) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/90 hover:text-primary-foreground"
                    onClick={() => handleToggleDemographic(item)}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="companies" className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Business Type</Label>
            <div className="flex flex-wrap gap-2 mb-4">
              {DEMOGRAPHICS.businessType.map((item) => (
                <Badge
                  key={item}
                  variant={value.includes(item) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/90 hover:text-primary-foreground"
                  onClick={() => handleToggleDemographic(item)}
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Business Roles</Label>
            <div className="flex flex-wrap gap-2 mb-4">
              {DEMOGRAPHICS.businessRoles.map((item) => (
                <Badge
                  key={item}
                  variant={value.includes(item) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/90 hover:text-primary-foreground"
                  onClick={() => handleToggleDemographic(item)}
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="custom-demographic">Add Custom Demographic</Label>
            <div className="flex gap-2">
              <Input
                id="custom-demographic"
                placeholder="E.g., Casual mobile gamers with disposable income"
                value={customDemographic}
                onChange={(e) => setCustomDemographic(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    customDemographic.trim() &&
                    !value.includes(customDemographic) &&
                    value.length < maxSelections
                  ) {
                    e.preventDefault()
                    handleAddCustomDemographic()
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleAddCustomDemographic}
                disabled={
                  !customDemographic.trim() || value.includes(customDemographic) || value.length >= maxSelections
                }
              >
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Add any specific demographic not listed in the other tabs</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
