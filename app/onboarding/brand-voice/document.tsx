"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Pencil, Check } from "lucide-react"

interface BrandVoiceDocumentProps {
  businessName: string
  yearFounded: string
  businessDescription: string
  businessValues: string[]
  onSave: (content: any) => void
}

export function BrandVoiceDocument({
  businessName,
  yearFounded,
  businessDescription,
  businessValues,
  onSave,
}: BrandVoiceDocumentProps) {
  const [editing, setEditing] = useState<string | null>(null)
  const [editedContent, setEditedContent] = useState("")

  const brandVoicePillars = [
    {
      title: "Authentic Expert",
      color: "bg-blue-100 border-blue-300 text-blue-700",
      means: [
        "Use clear, authoritative language that demonstrates expertise",
        "Share real-world examples and data to support claims",
        "Maintain a balance between professional and approachable",
      ],
      doesntMean: [
        "Using unnecessary jargon or technical terminology",
        "Being condescending or overly formal",
        "Hiding limitations or overselling capabilities",
      ],
      inspiration: [
        "Stripe - Technical yet accessible documentation",
        "HubSpot - Educational content that builds trust",
      ],
    },
    {
      title: "Empathetic Guide",
      color: "bg-green-100 border-green-300 text-green-700",
      means: [
        "Acknowledge and validate user challenges",
        "Provide clear, actionable solutions",
        "Use encouraging and supportive language",
      ],
      doesntMean: [
        "Being overly emotional or informal",
        "Promising unrealistic outcomes",
        "Losing sight of professional boundaries",
      ],
      inspiration: ["Headspace - Gentle, supportive guidance", "Notion - Helpful, user-focused communication"],
    },
    {
      title: "Innovative Simplifier",
      color: "bg-purple-100 border-purple-300 text-purple-700",
      means: [
        "Break down complex concepts into digestible pieces",
        "Use metaphors and analogies to explain new ideas",
        "Focus on practical applications and benefits",
      ],
      doesntMean: [
        "Oversimplifying important details",
        "Using buzzwords or hype",
        "Ignoring the technical depth when needed",
      ],
      inspiration: ["Apple - Making complex technology feel simple", "Figma - Clear explanation of powerful features"],
    },
  ]

  const handleEdit = (section: string, content: string) => {
    setEditing(section)
    setEditedContent(content)
  }

  const handleSave = (section: string) => {
    // Save the edited content
    onSave({ [section]: editedContent })
    setEditing(null)
    setEditedContent("")
  }

  const sampleBlogPost = `
    Introducing ${businessName}: Your Partner in [Main Value Proposition]

    In today's fast-paced digital landscape, [common pain point] has become a critical challenge for businesses. At ${businessName}, we understand this firsthand. Since ${yearFounded}, we've been ${businessDescription.toLowerCase()}.

    Our approach is simple but powerful. We combine ${businessValues[0]} with ${businessValues[1]} to deliver solutions that make a real difference. Whether you're [target audience pain point] or [another pain point], we're here to help.

    Ready to transform how you [key benefit]? Let's start this journey together.
  `

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Brand Voice Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-slate max-w-none">
            <p className="text-lg">
              Founded in {yearFounded}, {businessName} {businessDescription.toLowerCase()}. Our brand voice reflects our
              core values of {businessValues.join(", ")}, while maintaining a consistent focus on delivering value to
              our audience.
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pillars" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pillars">Voice Pillars</TabsTrigger>
          <TabsTrigger value="example">Sample Content</TabsTrigger>
        </TabsList>

        <TabsContent value="pillars" className="space-y-6">
          {brandVoicePillars.map((pillar, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className={pillar.color}>{pillar.title}</Badge>
                  {editing === `pillar-${index}` ? (
                    <Button size="icon" variant="ghost" onClick={() => handleSave(`pillar-${index}`)}>
                      <Check className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(`pillar-${index}`, "")}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">What It Means</h3>
                    <ul className="space-y-2">
                      {pillar.means.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-1" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">What It Doesn't Mean</h3>
                    <ul className="space-y-2">
                      {pillar.doesntMean.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Iconic Brand Inspiration</h3>
                    <ul className="space-y-2">
                      {pillar.inspiration.map((item, i) => (
                        <li key={i} className="text-sm">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="example">
          <Card>
            <CardHeader>
              <CardTitle>Sample Blog Post</CardTitle>
            </CardHeader>
            <CardContent>
              {editing === "sample-post" ? (
                <div className="space-y-4">
                  <Textarea
                    value={editedContent || sampleBlogPost}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="min-h-[200px]"
                  />
                  <Button onClick={() => handleSave("sample-post")}>Save Changes</Button>
                </div>
              ) : (
                <div className="relative prose prose-slate max-w-none">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-0 top-0"
                    onClick={() => handleEdit("sample-post", sampleBlogPost)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <div className="space-y-4">
                    {sampleBlogPost.split("\n\n").map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
