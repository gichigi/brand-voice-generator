"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText, MessageSquare, Mail, Twitter } from "lucide-react"
import { getUserPreferences, saveUserPreferences } from "@/lib/user-preferences"
import { useState, useEffect } from "react"

// Content types with their popularity ranking and appropriate length options
const CONTENT_TYPES = [
  {
    value: "blog-post",
    label: "Blog Post",
    popularity: 10,
    lengthLabel: "Length",
    lengthOptions: [
      { value: "short", label: "Short (~500 words)" },
      { value: "medium", label: "Medium (~1000 words)" },
      { value: "long", label: "Long (~1500 words)" },
    ],
    placeholder: "E.g., '5 Ways to Improve Customer Experience'",
  },
  {
    value: "linkedin-post",
    label: "LinkedIn Post",
    popularity: 9,
    lengthLabel: "Length",
    lengthOptions: [
      { value: "short", label: "Short (~100 words)" },
      { value: "medium", label: "Medium (~200 words)" },
      { value: "long", label: "Long (~300 words)" },
    ],
    placeholder: "E.g., 'Announcing our new sustainability initiative'",
  },
  {
    value: "email-newsletter",
    label: "Email Newsletter",
    popularity: 8,
    lengthLabel: "Length",
    lengthOptions: [
      { value: "short", label: "Short (~300 words)" },
      { value: "medium", label: "Medium (~500 words)" },
      { value: "long", label: "Long (~800 words)" },
    ],
    placeholder: "E.g., 'Monthly industry updates and tips'",
  },
  {
    value: "twitter-post",
    label: "Twitter Post",
    popularity: 7,
    lengthLabel: "Length",
    lengthOptions: [
      { value: "short", label: "Short (1-2 sentences)" },
      { value: "medium", label: "Medium (2-3 sentences)" },
      { value: "long", label: "Long (3-4 sentences)" },
    ],
    placeholder: "E.g., 'Product launch announcement'",
  },
  {
    value: "twitter-thread",
    label: "Twitter Thread",
    popularity: 6,
    lengthLabel: "Number of Tweets",
    lengthOptions: [
      { value: "3-tweets", label: "3 Tweets" },
      { value: "5-tweets", label: "5 Tweets" },
      { value: "7-tweets", label: "7 Tweets" },
      { value: "10-tweets", label: "10 Tweets" },
    ],
    placeholder: "E.g., 'Thread explaining our product roadmap'",
  },
  {
    value: "landing-page",
    label: "Landing Page",
    popularity: 5,
    lengthLabel: "Sections",
    lengthOptions: [
      { value: "minimal", label: "Minimal (3 sections)" },
      { value: "standard", label: "Standard (5 sections)" },
      { value: "comprehensive", label: "Comprehensive (7+ sections)" },
    ],
    placeholder: "E.g., 'SaaS product landing page for project management tool'",
  },
  {
    value: "video-script",
    label: "Video Script",
    popularity: 4,
    lengthLabel: "Duration",
    lengthOptions: [
      { value: "30-seconds", label: "30 Seconds" },
      { value: "1-minute", label: "1 Minute" },
      { value: "2-minutes", label: "2 Minutes" },
      { value: "5-minutes", label: "5 Minutes" },
    ],
    placeholder: "E.g., 'Product demo for our new feature'",
  },
  {
    value: "product-copy",
    label: "Product Copy",
    popularity: 3,
    lengthLabel: "Length",
    lengthOptions: [
      { value: "short", label: "Short (50-100 words)" },
      { value: "medium", label: "Medium (100-200 words)" },
      { value: "long", label: "Long (200-300 words)" },
    ],
    placeholder: "E.g., 'Description for our premium subscription plan'",
  },
  {
    value: "faqs",
    label: "FAQs",
    popularity: 2,
    lengthLabel: "Number of Questions",
    lengthOptions: [
      { value: "5-questions", label: "5 Questions" },
      { value: "10-questions", label: "10 Questions" },
      { value: "15-questions", label: "15 Questions" },
    ],
    placeholder: "E.g., 'Common questions about our return policy'",
  },
]

// Sort content types by popularity
const SORTED_CONTENT_TYPES = [...CONTENT_TYPES].sort((a, b) => b.popularity - a.popularity)

const contentTypes = [
  { id: "blog-post", name: "Blog Post", icon: FileText },
  { id: "social-media", name: "Social Media Post", icon: MessageSquare },
  { id: "email", name: "Email", icon: Mail },
  { id: "tweet", name: "Tweet", icon: Twitter },
]

interface ContentTypeSelectorProps {
  className?: string
  onGenerate: (data: { contentType: string; contentLength: string; topic: string; generateOutline: boolean }) => void
  onSelect: (type: string) => void
}

interface UserPreferences {
  defaultContentType: string
  defaultContentLength: string
}

export function ContentTypeSelector({ className, onGenerate, onSelect }: ContentTypeSelectorProps) {
  const [contentType, setContentType] = useState(SORTED_CONTENT_TYPES[0].value)
  const [contentLength, setContentLength] = useState(SORTED_CONTENT_TYPES[0].lengthOptions[1].value)
  const [topic, setTopic] = useState("")
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [generateOutline, setGenerateOutline] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const loadPreferences = async () => {
      const prefs = await getUserPreferences()
      setPreferences(prefs)
      if (prefs) {
        setContentType(prefs.defaultContentType)
        setContentLength(prefs.defaultContentLength)
      }
    }
    loadPreferences()
  }, [])

  const selectedContentType = CONTENT_TYPES.find((type) => type.value === contentType)

  const handleContinue = async () => {
    if (!topic) return

    setIsGenerating(true)

    if (preferences) {
      const updatedPrefs = {
        ...preferences,
        defaultContentType: contentType,
        defaultContentLength: contentLength,
      }
      await saveUserPreferences(updatedPrefs)
    }

    onGenerate({ contentType, contentLength, topic, generateOutline })
    setIsGenerating(false)
  }

  return (
    <div className={`${className} w-full`}>
      <h2 className="text-2xl font-semibold mb-4">Select Content Type</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {contentTypes.map((type) => (
          <Card
            key={type.id}
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => onSelect(type.id)}
          >
            <CardContent className="flex flex-col items-center justify-center p-6">
              <type.icon className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-lg font-medium text-center">{type.name}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
