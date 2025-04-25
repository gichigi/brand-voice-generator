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
          Your Selected Demographics ({value.length}/{maxSelections})
        </Label>
        <div className="mt-2 flex flex-wrap gap-2 min-h-[60px] p-3 border rounded-md bg-gray-50">
          {value.length === 0 ? (
            <div className="text-base text-muted-foreground py-1 px-2">No demographics selected</div>
          ) : (
            value.map((demographic, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1.5 text-base">
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
              <Label className="text-base font-medium text-foreground mb-3 block pb-2">Age Groups</Label>
              <div className="flex flex-wrap gap-2">
                {DEMOGRAPHICS.ageGroups.map((age) => (
                  <button
                    key={age}
                    type="button"
                    disabled={isMaxReached && !value.includes(age)}
                    className={`px-4 py-2 text-base font-normal rounded-lg border ${
                      value.includes(age)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
                    } ${isMaxReached && !value.includes(age) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    onClick={() => handleToggleDemographic(age)}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium text-foreground mb-3 block pb-2">Gender</Label>
              <div className="flex flex-wrap gap-2">
                {DEMOGRAPHICS.gender.map((item) => (
                  <button
                    key={item}
                    type="button"
                    disabled={isMaxReached && !value.includes(item)}
                    className={`px-4 py-2 text-base font-normal rounded-lg border ${
                      value.includes(item)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
                    } ${isMaxReached && !value.includes(item) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    onClick={() => handleToggleDemographic(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium text-foreground mb-3 block pb-2">Location</Label>
              <div className="flex flex-wrap gap-2">
                {DEMOGRAPHICS.locations.map((item) => (
                  <button
                    key={item}
                    type="button"
                    disabled={isMaxReached && !value.includes(item)}
                    className={`px-4 py-2 text-base font-normal rounded-lg border ${
                      value.includes(item)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
                    } ${isMaxReached && !value.includes(item) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    onClick={() => handleToggleDemographic(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium text-foreground mb-3 block pb-2">Interests</Label>
              <div className="flex flex-wrap gap-2">
                {DEMOGRAPHICS.interests.map((item) => (
                  <button
                    key={item}
                    type="button"
                    disabled={isMaxReached && !value.includes(item)}
                    className={`px-4 py-2 text-base font-normal rounded-lg border ${
                      value.includes(item)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
                    } ${isMaxReached && !value.includes(item) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    onClick={() => handleToggleDemographic(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="companies" className="space-y-4">
          <div>
            <Label className="text-base font-medium mb-2 block">Business Type</Label>
            <div className="flex flex-wrap gap-2 mb-4">
              {DEMOGRAPHICS.businessType.map((item) => (
                <button
                  key={item}
                  type="button"
                  disabled={isMaxReached && !value.includes(item)}
                  className={`px-4 py-2 text-base font-normal rounded-lg border ${
                    value.includes(item)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
                  } ${isMaxReached && !value.includes(item) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  onClick={() => handleToggleDemographic(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium mb-2 block">Business Roles</Label>
            <div className="flex flex-wrap gap-2 mb-4">
              {DEMOGRAPHICS.businessRoles.map((item) => (
                <button
                  key={item}
                  type="button"
                  disabled={isMaxReached && !value.includes(item)}
                  className={`px-4 py-2 text-base font-normal rounded-lg border ${
                    value.includes(item)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
                  } ${isMaxReached && !value.includes(item) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  onClick={() => handleToggleDemographic(item)}
                >
                  {item}
                </button>
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
                disabled={isMaxReached}
              />
              <Button
                type="button"
                variant="outline"
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
