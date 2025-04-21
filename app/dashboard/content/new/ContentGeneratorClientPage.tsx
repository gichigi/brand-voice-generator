"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Save, Copy, Loader2, ChevronUp, Plus, Link2, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { saveContent, getContent, updateContent } from "@/lib/data-service"
// Import the RichTextEditor component
import { RichTextEditor } from "@/components/rich-text-editor"
// Import the server action
import { generateContent } from "@/app/actions/generate-content"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Add these imports at the top of the file
import { BrandVoicePillars } from "@/components/brand-voice-pillars"
import { HighlightedContent } from "@/components/highlighted-content"
import { getHighlightToggleState, setHighlightToggleState } from "@/lib/highlight-utils"
import { Switch } from "@/components/ui/switch"
import { analyzeBrandVoiceAlignment, type HighlightSegment } from "@/app/actions/analyze-brand-voice-alignment"

// Add this near the top of the file, after the imports
// Define the consistent fallback brand voice with more distinctive pillars
const FALLBACK_BRAND_VOICE = {
  executiveSummary: "Our brand voice is vibrant, empathetic, and action-oriented.",
  pillars: [
    {
      id: "fallback-1",
      title: "Vibrant",
      means: ["Use colorful language", "Create vivid imagery", "Energize the reader"],
      doesntMean: ["Overly casual", "Unprofessional", "Exaggerated"],
      inspiration: "We bring ideas to life with dynamic, colorful expression.",
    },
    {
      id: "fallback-2",
      title: "Empathetic",
      means: ["Acknowledge feelings", "Show understanding", "Connect personally"],
      doesntMean: ["Overly emotional", "Presumptuous", "Insincere"],
      inspiration: "We genuinely understand and address our audience's needs and concerns.",
    },
    {
      id: "fallback-3",
      title: "Action-Oriented",
      means: ["Use strong verbs", "Provide clear next steps", "Inspire movement"],
      doesntMean: ["Demanding", "Pushy", "Unrealistic"],
      inspiration: "We motivate readers to take meaningful action through powerful calls to action.",
    },
  ],
}

export default function ContentGeneratorClientPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const contentId = searchParams.get("id")
  const editorRef = useRef(null)
  const outlineTextareaRef = useRef<HTMLTextAreaElement>(null)
  const businessDescriptionRef = useRef<HTMLTextAreaElement>(null)
  const customContextRef = useRef<HTMLTextAreaElement>(null)

  const [topic, setTopic] = useState("")
  const [contentLength, setContentLength] = useState("short")
  const [keywords, setKeywords] = useState("")
  const [customContext, setCustomContext] = useState("")
  const [referenceUrl, setReferenceUrl] = useState("")
  const [isProcessingUrl, setIsProcessingUrl] = useState(false)
  const [referenceUrlProcessed, setReferenceUrlProcessed] = useState(false)
  const [referenceUrlError, setReferenceUrlError] = useState("")
  const [showContextField, setShowContextField] = useState(false)
  const [contentOutline, setContentOutline] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [markdownContent, setMarkdownContent] = useState("")
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [contentType, setContentType] = useState("blog-post")
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)
  const [brandVoicePillars, setBrandVoicePillars] = useState<string[]>([])
  const [currentPillarIndex, setCurrentPillarIndex] = useState(0)
  const [showPillarBadge, setShowPillarBadge] = useState(false)

  // Add these state variables in the component, after the existing state declarations
  const [contentHighlights, setContentHighlights] = useState<HighlightSegment[]>([])
  const [showHighlights, setShowHighlights] = useState(getHighlightToggleState())
  const [isAnalyzingContent, setIsAnalyzingContent] = useState(false)
  const [brandVoiceData, setBrandVoiceData] = useState<any>(null)
  const [activePillars, setActivePillars] = useState<number[]>([])
  const [highlightedHtml, setHighlightedHtml] = useState<string>("")

  // Content generation loading messages
  const loadingMessages = [
    "Crafting your content with your brand voice...",
    "Tailoring the message to your audience...",
    "Applying your unique style and tone...",
    "Structuring content for maximum impact...",
    "Refining language to match your brand identity...",
    "Ensuring content aligns with your business values...",
  ]

  // Auto-resize textarea function
  const autoResizeTextarea = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto"

    // Set the height to match the content (add a small buffer to prevent scrollbar flicker)
    textarea.style.height = `${textarea.scrollHeight + 2}px`
  }

  // Handle content outline change with auto-resize
  const handleContentOutlineChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContentOutline(e.target.value)
    autoResizeTextarea(e.target)
  }

  // Handle custom context change with auto-resize
  const handleCustomContextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomContext(e.target.value)
    autoResizeTextarea(e.target)
  }

  // Add a clear inputs function
  const clearAllInputs = () => {
    setTopic("")
    setContentLength("short")
    setKeywords("")
    setCustomContext("")
    setReferenceUrl("")
    setReferenceUrlProcessed(false)
    setReferenceUrlError("")
    setShowContextField(false)
    setContentOutline("")
    setGeneratedContent("")
    setMarkdownContent("")
    setWordCount(0)
    setContentHighlights([])
    toast({
      title: "Inputs cleared",
      description: "All form fields have been reset.",
    })
  }

  // Check for content type in URL parameters
  useEffect(() => {
    const typeParam = searchParams.get("type")
    if (typeParam && ["blog-post", "linkedin-post"].includes(typeParam)) {
      setContentType(typeParam)

      // We're no longer changing the default length based on content type
      // since we want to always use "short" as the default
    }
  }, [searchParams])

  // Auto-resize the textareas when content changes
  useEffect(() => {
    if (outlineTextareaRef.current) {
      autoResizeTextarea(outlineTextareaRef.current)
    }
    if (customContextRef.current) {
      autoResizeTextarea(customContextRef.current)
    }
  }, [contentOutline, customContext])

  // Load brand voice data
  useEffect(() => {
    try {
      const storedBrandVoice = localStorage.getItem("generatedBrandVoice")
      if (storedBrandVoice) {
        const brandVoice = JSON.parse(storedBrandVoice)
        setBrandVoiceData(brandVoice)

        if (brandVoice.pillars && Array.isArray(brandVoice.pillars)) {
          const pillars = brandVoice.pillars.map((pillar) => pillar.title)
          setBrandVoicePillars(pillars)

          // Initialize all pillars as active
          setActivePillars(brandVoice.pillars.map((_, index) => index))
        }
      } else {
        // Create and store a fallback brand voice if none exists
        setBrandVoiceData(FALLBACK_BRAND_VOICE)
        localStorage.setItem("generatedBrandVoice", JSON.stringify(FALLBACK_BRAND_VOICE))

        const pillars = FALLBACK_BRAND_VOICE.pillars.map((pillar) => pillar.title)
        setBrandVoicePillars(pillars)

        // Initialize all pillars as active
        setActivePillars(FALLBACK_BRAND_VOICE.pillars.map((_, index) => index))
      }
    } catch (error) {
      console.error("Error loading brand voice data:", error)
    }
  }, [])

  // Cycle through loading messages
  useEffect(() => {
    if (!isGeneratingContent) return

    const messageInterval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 3000)

    return () => clearInterval(messageInterval)
  }, [isGeneratingContent, loadingMessages.length])

  // Cycle through brand voice pillars
  useEffect(() => {
    if (!isGeneratingContent || brandVoicePillars.length === 0) return

    // Show pillar badge after initial delay
    const initialDelay = setTimeout(() => {
      setShowPillarBadge(true)
    }, 1500)

    // Cycle through pillars
    const pillarInterval = setInterval(() => {
      setCurrentPillarIndex((prev) => (prev + 1) % brandVoicePillars.length)
    }, 2000)

    return () => {
      clearTimeout(initialDelay)
      clearInterval(pillarInterval)
      setShowPillarBadge(false)
    }
  }, [isGeneratingContent, brandVoicePillars])

  // Load content if editing an existing item
  useEffect(() => {
    if (contentId) {
      setIsLoading(true)
      try {
        const content = getContent(contentId)
        if (content) {
          setTopic(content.topic || "")

          // Extract content type and length from the contentType field
          if (content.contentType) {
            if (content.contentType.includes("linkedin-post")) {
              setContentType("linkedin-post")
            } else {
              setContentType("blog-post")
            }

            setContentLength(
              content.contentType.includes("short")
                ? "short"
                : content.contentType.includes("long")
                  ? "long"
                  : "medium",
            )
          }

          setGeneratedContent(content.htmlContent || content.content || "")
          setMarkdownContent(content.markdownContent || "")

          // Extract keywords and context if available
          if (content.keywords) {
            setKeywords(content.keywords)
          }
          if (content.customContext) {
            setCustomContext(content.customContext)
            setShowContextField(true)
          }

          if (content.referenceUrl) {
            setReferenceUrl(content.referenceUrl)
            setShowContextField(true)
          }

          if (content.contentOutline) {
            setContentOutline(content.contentOutline)
          }

          // Load highlights if available
          if (content.highlights) {
            setContentHighlights(content.highlights)
          }

          // Calculate word count
          if (content.htmlContent) {
            setWordCount(countWordsInHtml(content.htmlContent))
          }
        }
      } catch (error) {
        console.error("Error loading content:", error)
        toast({
          title: "Error",
          description: "Failed to load content",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }, [contentId])

  // Function to clean HTML content
  function cleanHtmlContent(htmlContent) {
    // Extract just the body content if it's a full HTML document
    if (htmlContent.includes("<!DOCTYPE html>") || htmlContent.includes("<html")) {
      const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
      if (bodyMatch && bodyMatch[1]) {
        return bodyMatch[1].trim()
      }
    }

    // Remove any code block formatting that might be present
    if (htmlContent.startsWith("```html\n") || htmlContent.startsWith("```\n")) {
      return htmlContent
        .replace(/^```html\n/, "")
        .replace(/^```\n/, "")
        .replace(/```$/, "")
        .trim()
    }

    return htmlContent
  }

  // Function to count words in HTML content
  function countWordsInHtml(html) {
    // Create a temporary element
    const tempElement = document.createElement("div")
    tempElement.innerHTML = html

    // Get the text content
    const text = tempElement.textContent || tempElement.innerText

    // Count words (split by whitespace and filter out empty strings)
    return text.split(/\s+/).filter((word) => word.length > 0).length
  }

  // Function to convert HTML to Markdown
  function htmlToMarkdown(html) {
    // This is a placeholder - in a real app, you'd use a library like turndown
    // For now, we'll just return the HTML as is
    return html
  }

  // Function to convert Markdown to HTML
  function markdownToHtml(markdown) {
    // This is a placeholder - in a real app, you'd use a library like marked
    // For now, we'll just return the markdown as is
    return markdown
  }

  // Validate URL format
  const isValidUrl = (url: string): boolean => {
    try {
      // Add protocol if missing
      let formattedUrl = url.trim()
      if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
        formattedUrl = "https://" + formattedUrl
      }

      new URL(formattedUrl)
      return true
    } catch (e) {
      return false
    }
  }

  // Then update the analyzeContent function to use this fallback
  const analyzeContent = async (content: string) => {
    if (!content) {
      console.log("❌ Cannot analyze content: missing content")
      return []
    }

    console.log("🚀 Starting content analysis")

    // Get brand voice data - with fallback handling
    let brandVoiceData = null
    try {
      const storedBrandVoice = localStorage.getItem("generatedBrandVoice")
      if (storedBrandVoice) {
        brandVoiceData = JSON.parse(storedBrandVoice)
        console.log("✅ Loaded brand voice data:", brandVoiceData.executiveSummary)
      } else {
        console.log("⚠️ No brand voice data found in localStorage, using fallback")
        // Use the consistent fallback brand voice
        brandVoiceData = FALLBACK_BRAND_VOICE
        // Store it for future use
        localStorage.setItem("generatedBrandVoice", JSON.stringify(FALLBACK_BRAND_VOICE))
      }
    } catch (error) {
      console.error("❌ Error loading brand voice data:", error)
      // Use the consistent fallback brand voice
      brandVoiceData = FALLBACK_BRAND_VOICE
      // Store it for future use
      localStorage.setItem("generatedBrandVoice", JSON.stringify(FALLBACK_BRAND_VOICE))
    }

    if (!brandVoiceData || !brandVoiceData.pillars) {
      console.log("❌ No valid brand voice data available")
      return []
    }

    console.log(
      "🚀 Starting content analysis with brand voice pillars:",
      brandVoiceData.pillars.map((p) => p.title).join(", "),
    )

    setIsAnalyzingContent(true)

    try {
      const result = await analyzeBrandVoiceAlignment(content, brandVoiceData.pillars)

      console.log(
        "✅ Analysis result:",
        JSON.stringify(
          {
            success: result.success,
            highlightsCount: result?.highlights?.length || 0,
            hasHighlightedHtml: !!result.highlightedHtml,
            debugInfo: result.debugInfo,
          },
          null,
          2,
        ),
      )

      if (result.success) {
        if (result.highlights) {
          setContentHighlights(result.highlights)
          console.log("✅ Set content highlights:", result.highlights.length)
        }
        if (result.highlightedHtml) {
          setHighlightedHtml(result.highlightedHtml)
          console.log("✅ Set highlighted HTML, length:", result.highlightedHtml.length)
          console.log("🔍 Highlighted HTML sample:", result.highlightedHtml.substring(0, 200) + "...")
        }
        return result.highlights || []
      } else {
        console.error("❌ Analysis failed:", result.error)
        toast({
          title: "Analysis Issue",
          description: "We couldn't fully analyze your content for brand voice alignment.",
          variant: "destructive",
        })
        return []
      }
    } catch (error) {
      console.error("❌ Error analyzing content:", error)
      toast({
        title: "Analysis Error",
        description: "An error occurred while analyzing your content.",
        variant: "destructive",
      })
      return []
    } finally {
      setIsAnalyzingContent(false)
    }
  }

  // Handle manual refresh of highlights
  const handleRefreshHighlights = async () => {
    if (!generatedContent) {
      toast({
        title: "No content",
        description: "Please generate content before analyzing",
        variant: "destructive",
      })
      return
    }

    const highlights = await analyzeContent(generatedContent)

    if (highlights.length > 0) {
      toast({
        title: "Analysis Complete",
        description: `Found ${highlights.length} brand voice elements in your content.`,
      })
    } else {
      toast({
        title: "Analysis Complete",
        description: "No brand voice elements were identified. Try adding more content.",
      })
    }
  }

  // Add this function to handle content generation with debug logs
  const handleGenerateContent = async () => {
    if (!topic) {
      toast({
        title: "Topic required",
        description: "Please enter a topic for your content",
        variant: "destructive",
      })
      return
    }

    console.log("🚀 Starting content generation for topic:", topic)

    // Reset states
    setIsGeneratingContent(true)
    setWordCount(0)
    setReferenceUrlProcessed(false)
    setReferenceUrlError("")
    setLoadingMessageIndex(0)
    setCurrentPillarIndex(0)
    setShowPillarBadge(false)
    setContentHighlights([])
    setHighlightedHtml("") // Reset highlighted HTML

    // Validate reference URL if provided
    if (referenceUrl && !isValidUrl(referenceUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL or leave the field empty",
        variant: "destructive",
      })
      setIsGeneratingContent(false)
      return
    }

    // Fetch brand voice data from localStorage
    let brandVoiceData = null
    try {
      const storedBrandVoice = localStorage.getItem("generatedBrandVoice")
      if (storedBrandVoice) {
        brandVoiceData = JSON.parse(storedBrandVoice)
        console.log("✅ Loaded brand voice data:", brandVoiceData.executiveSummary)
        console.log("✅ Brand voice pillars:", brandVoiceData.pillars.map((p) => p.title).join(", "))
      } else {
        console.log("⚠️ No brand voice data found in localStorage")
      }
    } catch (error) {
      console.error("❌ Error fetching brand voice data:", error)
    }

    // Fetch business information from localStorage
    let businessInfo = null
    try {
      const storedBusinessInfo = localStorage.getItem("brandVoiceData")
      if (storedBusinessInfo) {
        businessInfo = JSON.parse(storedBusinessInfo)
        console.log("✅ Loaded business info:", businessInfo.businessName)
      } else {
        console.log("⚠️ No business info found in localStorage")
      }
    } catch (error) {
      console.error("❌ Error fetching business info:", error)
    }

    // Create a more detailed prompt that incorporates brand voice and business info
    // Adjust the prompt based on content type
    let contentPrompt = ""

    if (contentType === "linkedin-post") {
      contentPrompt = `
Create a ${contentLength} LinkedIn post about "${topic}".
${
  contentOutline
    ? `Key points to include:
${contentOutline}`
    : ""
}
${keywords ? `Include these keywords naturally: ${keywords}` : ""}
${customContext ? `Professional Context: ${customContext}` : ""}

IMPORTANT LINKEDIN POST GUIDELINES:
1. Keep the post professional and engaging
2. Focus on clarity and readability
3. DO NOT include hashtags
4. Include a brief call-to-action at the end
5. Maintain a professional tone suitable for LinkedIn
6. Keep the post to approximately ${contentLength === "short" ? "100" : contentLength === "medium" ? "200" : "300"} words

LINKEDIN-SPECIFIC FORMATTING INSTRUCTIONS:
1. Use very short paragraphs (1-3 sentences maximum)
2. Include double line breaks between paragraphs
3. Add 1-2 relevant emojis strategically (beginning of paragraphs or to highlight key points)
4. Include occasional single-sentence paragraphs for emphasis
5. Start with a strong, attention-grabbing first line
6. End with a clear call-to-action or thought-provoking question
`
    } else {
      // Original blog post prompt
      contentPrompt = `
Create a ${contentLength} blog post about "${topic}".
${
  contentOutline
    ? `Key points to include:
${contentOutline}`
    : ""
}
${keywords ? `Include these keywords naturally: ${keywords}` : ""}
${customContext ? `Additional context: ${customContext}` : ""}

Important formatting instructions:
1. Return ONLY the HTML content for the blog post - do not include <!DOCTYPE>, <html>, <head>, or <body> tags
2. Use semantic HTML tags for structure (<h1>, <h2>, <p>, <ul>, <ol>, etc.)
3. Keep paragraphs concise (3-4 sentences max)
4. Use bullet points or numbered lists where appropriate
5. Include subheadings to break up content
6. Do not include any CSS or styling in the HTML
7. Make the content engaging and visually appealing
8. Do not wrap the response in code blocks or markdown formatting
`
    }

    console.log("🔍 Content prompt created, length:", contentPrompt.length)

    try {
      // Show URL processing indicator if a reference URL is provided
      if (referenceUrl) {
        setIsProcessingUrl(true)
        toast({
          title: "Getting info from web",
          description: "We're analyzing the content from the website you provided...",
        })
      }

      console.log("🚀 Calling generateContent server action")

      // Call the server action with the reference URL, brand voice, and business info
      const result = await generateContent(
        contentPrompt,
        contentType,
        topic,
        contentLength,
        referenceUrl,
        brandVoiceData,
        businessInfo,
      )

      console.log("✅ Content generation completed, success:", result.success)

      // Update reference URL processing status
      if (referenceUrl) {
        setIsProcessingUrl(false)
        setReferenceUrlProcessed(!!result.referenceProcessed)

        if (result.referenceError) {
          setReferenceUrlError(result.referenceError)
          toast({
            title: "Couldn't get web info",
            description:
              "We couldn't access that website, but we're still generating content based on your other inputs.",
          })
        } else if (result.referenceProcessed) {
          toast({
            title: "Web info added",
            description: "Information from the website has been included in your content.",
          })
        }
      }

      if (result.success) {
        // Clean and process the content
        let content = ""

        if (contentType === "linkedin-post") {
          // For LinkedIn posts, preserve line breaks but don't use HTML
          content = result.data.trim()

          // Wrap in a stylized div
          content = `
     <div class="prose prose-slate dark:prose-invert max-w-none space-y-4 font-inter linkedin-post">
       ${content
         .split("\n\n")
         .map((paragraph) => `<p>${paragraph}</p>`)
         .join("")}
     </div>
     `
        } else {
          // For blog posts, use the existing HTML cleaning
          content = cleanHtmlContent(result.data)

          // Wrap in a div with proper styling
          content = `
     <div class="prose prose-slate dark:prose-invert max-w-none space-y-6 font-inter">
       ${content}
     </div>
     `
        }

        console.log("✅ Content processed, length:", content.length)
        console.log("🔍 Content sample:", content.substring(0, 200) + "...")

        // Count words in the generated content
        const count = countWordsInHtml(content)
        setWordCount(count)
        console.log("✅ Word count:", count)

        // Convert HTML to Markdown for editing
        const markdown = htmlToMarkdown(content)
        setMarkdownContent(markdown)

        setGeneratedContent(content)
        setIsEditing(false) // Start with viewing mode instead of editing

        // Analyze the content for brand voice alignment
        console.log("🚀 Starting brand voice analysis")
        const analysisResult = await analyzeContent(content)
        console.log("✅ Brand voice analysis completed, highlights:", analysisResult.length)

        // Force a re-render to ensure highlights are displayed
        setTimeout(() => {
          console.log("🔄 Forcing re-render to ensure highlights are displayed")
          setShowHighlights((prev) => {
            // Toggle twice to force a re-render
            setShowHighlights(!prev)
            return prev
          })
        }, 500)
      } else {
        console.error("❌ Content generation failed:", result.error)
        toast({
          title: "Error",
          description: result.error || "Failed to generate content",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("❌ Error generating content:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while generating content",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingContent(false)
      setIsProcessingUrl(false)
    }
  }

  // Update the handleSave function to include highlights
  const handleSave = async () => {
    if (!generatedContent) {
      toast({
        title: "No content",
        description: "Please generate content before saving",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // Get brand voice and business info references
      let brandVoiceId = null
      let businessInfoId = null

      try {
        const storedBrandVoice = localStorage.getItem("generatedBrandVoice")
        if (storedBrandVoice) {
          const brandVoice = JSON.parse(storedBrandVoice)
          brandVoiceId = brandVoice.id || "default"
        }

        const storedBusinessInfo = localStorage.getItem("brandVoiceData")
        if (storedBusinessInfo) {
          const businessInfo = JSON.parse(storedBusinessInfo)
          businessInfoId = businessInfo.businessName
            ? businessInfo.businessName.replace(/\s+/g, "-").toLowerCase()
            : "default"
        }
      } catch (error) {
        console.error("Error retrieving references:", error)
      }

      const contentData = {
        contentType: contentType + "-" + contentLength,
        topic,
        content: generatedContent,
        htmlContent: generatedContent,
        markdownContent,
        keywords,
        customContext,
        referenceUrl,
        contentOutline,
        wordCount,
        brandVoiceId,
        businessInfoId,
        highlights: contentHighlights, // Save the highlights
        createdAt: new Date().toISOString(),
      }

      if (contentId) {
        // Update existing content
        const updated = updateContent(contentId, contentData)
        if (updated) {
          toast({
            title: "Content Updated",
            description: "Your content has been updated.",
          })
        } else {
          throw new Error("Failed to update content")
        }
      } else {
        // Save new content
        const result = saveContent(contentData)
        if (result.success) {
          toast({
            title: "Content Saved",
            description: "Your content has been saved to your library.",
          })
        } else {
          throw new Error(result.error || "Failed to save content")
        }
      }
    } catch (error) {
      console.error("Error saving content:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save content",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle copying content
  const handleCopy = () => {
    try {
      // Create a temporary element to parse the HTML
      const tempElement = document.createElement("div")

      // Clean the HTML content before parsing
      const cleanedContent = cleanHtmlContent(generatedContent)
      tempElement.innerHTML = cleanedContent

      // Get the text content
      const textContent = tempElement.textContent || tempElement.innerText

      // Copy to clipboard
      navigator.clipboard.writeText(textContent)

      toast({
        title: "Copied",
        description: "Content copied to clipboard",
      })
    } catch (error) {
      console.error("Error copying content:", error)
      toast({
        title: "Error",
        description: "Failed to copy content",
      })
    }
  }

  // Handle saving edited content
  const handleSaveEdit = async () => {
    try {
      // Get the current content from the editor
      const editorDiv = document.querySelector('[contenteditable="true"]')
      if (editorDiv) {
        const updatedContent = editorDiv.innerHTML
        setGeneratedContent(updatedContent)

        // Recalculate word count
        const count = countWordsInHtml(updatedContent)
        setWordCount(count)

        setIsEditing(false)

        // Re-analyze the content for brand voice alignment
        await analyzeContent(updatedContent)

        toast({
          title: "Content updated",
          description: "Your edits have been applied and brand voice analysis updated",
        })
      }
    } catch (error) {
      console.error("Error saving edits:", error)
      toast({
        title: "Error",
        description: "Failed to save edits",
      })
    }
  }

  // Insert markdown formatting at cursor position or around selected text
  const insertMarkdown = (prefix, suffix = "") => {
    const textarea = document.getElementById("markdown-editor") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value

    const beforeSelection = text.substring(0, start)
    const selection = text.substring(start, end)
    const afterSelection = text.substring(end)

    // If text is selected, wrap it with formatting
    // If no text is selected, insert formatting at cursor position
    const newText = selection
      ? `${beforeSelection}${prefix}${selection}${suffix}${afterSelection}`
      : `${beforeSelection}${prefix}${suffix}${afterSelection}`

    setMarkdownContent(newText)

    // Set cursor position after the operation
    setTimeout(() => {
      textarea.focus()
      if (selection) {
        // If text was selected, place cursor after the formatted text
        textarea.setSelectionRange(start + prefix.length, end + prefix.length)
      } else {
        // If no text was selected, place cursor between prefix and suffix
        const newCursorPos = start + prefix.length
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      }
    }, 0)
  }

  // Formatting functions
  const addHeading = () => insertMarkdown("## ", "\n")
  const addBold = () => insertMarkdown("**", "**")
  const addItalic = () => insertMarkdown("*", "*")
  const addLink = () => insertMarkdown("[Link text](", ")")
  const addBulletList = () => {
    const textarea = document.getElementById("markdown-editor") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const text = textarea.value
    const beforeCursor = text.substring(0, start)

    // Check if we're at the beginning of a line
    const isStartOfLine = start === 0 || beforeCursor.endsWith("\n")

    if (isStartOfLine) {
      insertMarkdown("- ", "")
    } else {
      insertMarkdown("\n- ", "")
    }
  }

  // Get content type display name
  const getContentTypeDisplayName = () => {
    switch (contentType) {
      case "linkedin-post":
        return "LinkedIn Post"
      case "blog-post":
        return "Blog Post"
      default:
        return "Content"
    }
  }

  // Get generate button text
  const getGenerateButtonText = () => {
    if (isGeneratingContent) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      )
    }

    return `Generate ${getContentTypeDisplayName()}`
  }

  // Get pillar badge color
  const getPillarBadgeColor = (index: number) => {
    const colors = [
      "bg-blue-100 text-blue-700 border-blue-200",
      "bg-green-100 text-green-700 border-green-200",
      "bg-purple-100 text-purple-700 border-purple-200",
      "bg-amber-100 text-amber-700 border-amber-200",
      "bg-rose-100 text-rose-700 border-rose-200",
    ]
    return colors[index % colors.length]
  }

  // Add this useEffect to load the highlight toggle state
  useEffect(() => {
    setShowHighlights(getHighlightToggleState())
  }, [])

  // Add this function to handle the highlight toggle
  const handleToggleHighlights = (checked: boolean) => {
    setShowHighlights(checked)
    setHighlightToggleState(checked)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">{contentId ? "Edit Content" : "Create New Content"}</h1>

        {/* Add a hidden debug button that's only visible in development */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Content Details</CardTitle>
            <CardDescription>Provide information about the content you want to create</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content-type">Content Type</Label>
                <Select
                  id="content-type"
                  value={contentType}
                  onValueChange={(value) => {
                    setContentType(value)
                    // Update content length options based on type
                    if (value === "linkedin-post") {
                      setContentLength("medium") // Default to medium for LinkedIn
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog-post">Blog Post</SelectItem>
                    <SelectItem value="linkedin-post">LinkedIn Post</SelectItem>
                    <SelectItem value="email-newsletter" disabled>
                      Email Newsletter (Coming Soon)
                    </SelectItem>
                    <SelectItem value="twitter-post" disabled>
                      Twitter Post (Coming Soon)
                    </SelectItem>
                    <SelectItem value="product-description" disabled>
                      Product Description (Coming Soon)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder={
                    contentType === "linkedin-post"
                      ? "E.g., Our new product launch"
                      : "E.g., Benefits of content marketing"
                  }
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              {/* Length selector - restored */}
              <div className="space-y-2">
                <Label htmlFor="content-length">Length</Label>
                <Select value={contentLength} onValueChange={setContentLength}>
                  <SelectTrigger id="content-length">
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentType === "linkedin-post" ? (
                      <>
                        <SelectItem value="short">Short (~100 words)</SelectItem>
                        <SelectItem value="medium">Medium (~200 words)</SelectItem>
                        <SelectItem value="long">Long (~300 words)</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="short">Short (300-400 words)</SelectItem>
                        <SelectItem value="medium">Medium (400-500 words)</SelectItem>
                        <SelectItem value="long">Long (500-600 words)</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content-outline">Add a few key points</Label>
                <Textarea
                  id="content-outline"
                  ref={outlineTextareaRef}
                  placeholder={
                    contentType === "linkedin-post"
                      ? "E.g., Mention our new partnership, include recent statistics"
                      : "E.g., Include a section on benefits, mention our recent case study"
                  }
                  value={contentOutline}
                  onChange={handleContentOutlineChange}
                  className="min-h-[120px] resize-y overflow-hidden" // Increased height from 60px to 120px
                  rows={4} // Increased from 2 to 4 rows
                />
                <p className="text-xs text-muted-foreground">Even rough ideas help improve results</p>
              </div>

              <div className="space-y-4">
                <button
                  type="button"
                  className="flex items-center justify-between w-full text-sm font-medium border-b pb-2 hover:text-foreground focus:outline-none"
                  onClick={() => setShowContextField(!showContextField)}
                  aria-expanded={showContextField}
                  aria-controls="advanced-options-content"
                >
                  <span>Advanced Options</span>
                  <span className="text-muted-foreground">
                    {showContextField ? <ChevronUp className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>

                {showContextField && (
                  <div id="advanced-options-content" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="keywords">Keywords (optional)</Label>
                      <Input
                        id="keywords"
                        placeholder="E.g., SEO, marketing, strategy"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Separate keywords with commas</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reference-url">Add info from web (optional)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="reference-url"
                          placeholder="E.g., https://example.com/article"
                          value={referenceUrl}
                          onChange={(e) => {
                            setReferenceUrl(e.target.value)
                            // Reset processing states when URL changes
                            setReferenceUrlProcessed(false)
                            setReferenceUrlError("")
                          }}
                          className={referenceUrlError ? "border-red-500" : ""}
                        />
                        {isProcessingUrl && <Loader2 className="h-4 w-4 animate-spin mt-3" />}
                        {referenceUrlProcessed && !referenceUrlError && (
                          <div className="text-green-500 flex items-center mt-2">
                            <Link2 className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      {referenceUrlError ? (
                        <p className="text-xs text-muted-foreground">
                          We couldn't access this website: {referenceUrlError}. Content will still be generated without
                          it.
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Add a website URL to include facts and information from that page
                        </p>
                      )}
                      {referenceUrlProcessed && !referenceUrlError && (
                        <Alert className="mt-2 py-2">
                          <Link2 className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            Website information has been processed and will be included in your content.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="custom-context">
                        {contentType === "linkedin-post" ? "Professional Context" : "Additional Context"}
                      </Label>
                      <Textarea
                        id="custom-context"
                        ref={customContextRef}
                        placeholder={
                          contentType === "linkedin-post"
                            ? "E.g., we're sharing this achievement with our professional network, highlight our company values"
                            : "E.g., add more about your business, include a call to action, add a customer quote, etc."
                        }
                        value={customContext}
                        onChange={handleCustomContextChange}
                        className="min-h-[80px] resize-y"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2 justify-end">
                  <Button onClick={handleGenerateContent} disabled={isGeneratingContent || !topic} className="flex-1">
                    {getGenerateButtonText()}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearAllInputs}
                    disabled={isGeneratingContent}
                    className="whitespace-nowrap"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Panel */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Generated Content</CardTitle>
              <CardDescription>
                {isEditing
                  ? "Edit your content using rich text formatting"
                  : `Your generated ${contentType === "linkedin-post" ? "LinkedIn post" : "content"} will appear here`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {wordCount > 0 && (
                <div className="bg-slate-100 dark:bg-slate-800 text-sm px-3 py-1.5 rounded-md flex items-center h-9">
                  {wordCount} words
                </div>
              )}
              {generatedContent && !isEditing && (
                <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                  Edit Content
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isGeneratingContent ? (
              <div className="flex flex-col items-center justify-center space-y-4 min-h-[500px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-center text-muted-foreground">
                  {loadingMessages[loadingMessageIndex]}
                  <br />
                  This may take a moment...
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  {/* Use the BrandVoicePillars without the compact prop for now */}
                  <BrandVoicePillars className="flex-1" compact={true} />
                  {generatedContent && (
                    <div className="flex items-center gap-2">
                      <Switch id="highlight-toggle" checked={showHighlights} onCheckedChange={handleToggleHighlights} />
                      <label htmlFor="highlight-toggle" className="text-sm cursor-pointer">
                        Show highlights
                      </label>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <RichTextEditor
                      initialContent={generatedContent}
                      onChange={(content) => {
                        // This will only be called when explicitly saving
                        setGeneratedContent(content)

                        // Update word count
                        const count = countWordsInHtml(content)
                        setWordCount(count)
                      }}
                      className="min-h-[500px]"
                      onWordCountChange={setWordCount}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveEdit}>Save Changes</Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative min-h-[500px]">
                    <HighlightedContent
                      content={generatedContent}
                      highlights={contentHighlights}
                      highlightedHtml={highlightedHtml}
                      showHighlights={showHighlights}
                      className="min-h-[500px] border rounded-md p-6 bg-white dark:bg-slate-900 dark:text-slate-100 overflow-auto font-inter"
                    />

                    {/* Add highlight stats and refresh button */}
                    {generatedContent && contentHighlights.length > 0 && showHighlights && (
                      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                        <div>Found {contentHighlights.length} brand voice elements in your content</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRefreshHighlights}
                          disabled={isAnalyzingContent}
                          className="flex items-center gap-1"
                        >
                          {isAnalyzingContent ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3 w-3" />
                          )}
                          Refresh Analysis
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {generatedContent && !isEditing && (
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save to Library
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
