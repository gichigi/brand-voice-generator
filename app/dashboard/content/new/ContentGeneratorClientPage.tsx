"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { generateContent } from "@/app/actions/generate-content"
import { HighlightedContent } from "@/components/highlighted-content"
import { applyHighlightsToHtml } from "@/lib/brand-voice-highlight"
import { BrandVoiceHighlight } from "@/lib/types"

interface ContentTypeOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface ContentLengthOption {
  value: string;
  label: string;
}

// Create basic utilities needed (simplified versions)
function cleanHtmlContent(htmlContent: string): string {
  // Basic content cleaning
  if (htmlContent.includes("<body")) {
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch && bodyMatch[1]) return bodyMatch[1].trim();
  }
  return htmlContent.trim();
}

function countWordsInHtml(html: string): number {
  if (typeof document === 'undefined') return 0;
  const tempElement = document.createElement("div");
  tempElement.innerHTML = html;
  const text = tempElement.textContent || tempElement.innerText || "";
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

const blogLengthOptions: ContentLengthOption[] = [
  { value: 'short', label: 'Short (300-400 words)' },
  { value: 'medium', label: 'Medium (400-500 words)' },
  { value: 'long', label: 'Long (500-600 words)' },
];

const linkedinLengthOptions: ContentLengthOption[] = [
  { value: 'short', label: 'Short (80-120 words)' },
  { value: 'medium', label: 'Medium (150-250 words)' },
  { value: 'long', label: 'Long (250-350 words)' },
];

export default function ContentGeneratorClientPage() {
  // Basic state variables for form
  const [topic, setTopic] = useState("")
  const [contentType, setContentType] = useState("blog-post")
  const [contentLength, setContentLength] = useState("medium")
  const [contentOutline, setContentOutline] = useState("")
  
  // State for content generation
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [wordCount, setWordCount] = useState(0)
  
  // Debug state (keep this to help with debugging)
  const [debugInfo, setDebugInfo] = useState<string>("No action taken yet")
  const [showRawHtml, setShowRawHtml] = useState(false)
  
  // Add state for highlighting
  const [brandVoiceDataForHighlighting, setBrandVoiceDataForHighlighting] = useState<any>(null)
  const [highlights, setHighlights] = useState<any[]>([])
  
  // Add effect to load brand voice data on mount
  useEffect(() => {
    // Try to load brand voice data from localStorage on component mount
    try {
      const storedBrandVoice = localStorage.getItem("generatedBrandVoice");
      if (storedBrandVoice) {
        const brandVoiceData = JSON.parse(storedBrandVoice);
        setBrandVoiceDataForHighlighting(brandVoiceData);
        console.log("[ContentGenerator] Loaded brand voice data from localStorage on init");
      } else {
        console.log("[ContentGenerator] No brand voice data found in localStorage on init");
      }
    } catch (error) {
      console.error("[ContentGenerator] Error fetching brand voice data on init:", error);
    }
  }, []);
  
  // Handle content generation
  const handleGenerateContent = async () => {
    if (!topic) {
      setDebugInfo("Error: Topic is required");
      return;
    }
    
    setDebugInfo(`Generating content about "${topic}" (${contentType}, ${contentLength})...`);
    setIsGeneratingContent(true);
    
    // Fetch brand voice data from localStorage - we still need this for the legend
    let brandVoiceData = null;
    try {
      const storedBrandVoice = localStorage.getItem("generatedBrandVoice");
      if (storedBrandVoice) {
        brandVoiceData = JSON.parse(storedBrandVoice);
        setBrandVoiceDataForHighlighting(brandVoiceData);
        console.log("[ContentGenerator] Found brand voice data in localStorage");
      } else {
        console.log("[ContentGenerator] No brand voice data found in localStorage");
      }
    } catch (error) {
      console.error("[ContentGenerator] Error fetching brand voice data:", error);
    }
    
    try {
      // Simple prompt without lots of conditions - brand voice now included in generateContent
      const contentPrompt = `
        Create a ${contentLength} ${contentType === "blog-post" ? "blog post" : "LinkedIn post"} about "${topic}".
        ${contentOutline ? `Key points to include:\n${contentOutline}` : ""}
        
        ${contentType === "linkedin-post" ? `
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
        ` : `
        Important formatting instructions:
        1. Use semantic HTML tags for structure (<h1>, <h2>, <p>, <ul>, etc.)
        2. Keep paragraphs concise
        3. Make the content engaging and visually appealing
        `}
      `;
      
      console.log("[ContentGenerator] Calling generateContent with prompt");
      
      const result = await generateContent(contentPrompt, contentType, topic, contentLength);
      
      if (result.success) {
        // Clean and process the content
        let content = cleanHtmlContent(result.data);
        
        // For LinkedIn posts, wrap in simple HTML to enable highlighting
        if (contentType === "linkedin-post") {
          // Split by double line breaks first (preserves intentional paragraph breaks)
          const paragraphs = content.split(/\n\s*\n/).filter(para => para.trim() !== '');
          
          // Process each paragraph
          content = paragraphs.map(paragraph => {
            // If paragraph starts with emoji
            if (/^\p{Emoji}/u.test(paragraph.trim())) {
              return `<p class="linkedin-emphasis">${paragraph}</p>`;
            } 
            // Single sentence paragraphs (rough detection)
            else if (!paragraph.includes('. ') && paragraph.trim().length < 100) {
              return `<p class="linkedin-highlight">${paragraph}</p>`;
            }
            else {
              return `<p>${paragraph}</p>`;
            }
          }).join('\n');
        }
        
        // Count words in the generated content
        const count = countWordsInHtml(content);
        setWordCount(count);
        
        // Apply brand voice highlights if we have brand voice data
        if (brandVoiceData && brandVoiceData.pillars && brandVoiceData.pillars.length > 0) {
          setDebugInfo("Content generated, analyzing for brand voice elements...");
          
          try {
            // Call the analyze-brand-voice API
            console.log("[ContentGenerator] Calling analyze-brand-voice API with content and brand voice data");
            
            const analyzeResponse = await fetch("/api/analyze-brand-voice", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                content: content, // Send the cleaned HTML content
                brandVoice: brandVoiceData // Send the brand voice data
              }),
            });
            
            if (analyzeResponse.ok) {
              const { highlights } = await analyzeResponse.json();
              
              console.log(`[ContentGenerator] Received ${highlights.length} highlights from analyze-brand-voice API`);
              
              if (highlights && highlights.length > 0) {
                // Store the highlights
                setHighlights(highlights);
                
                // Apply the highlights to the content directly using the imported function
                const highlightedContent = applyHighlightsToHtml(content, highlights);
                
                console.log(`[ContentGenerator] Applied ${highlights.length} highlights to content`);
                
                // Update the content with the highlighted version
                setGeneratedContent(highlightedContent);
                
                // Update debug info
                setDebugInfo(`Generated ${count} words with ${highlights.length} brand voice elements identified and highlighted.`);
              } else {
                console.log("[ContentGenerator] No highlights found in content");
                setGeneratedContent(content);
                setDebugInfo(`Generated ${count} words. No brand voice elements identified.`);
              }
            } else {
              console.error("[ContentGenerator] Error analyzing brand voice:", analyzeResponse.statusText);
              setGeneratedContent(content);
              setDebugInfo(`Generated ${count} words. Could not analyze for brand voice elements.`);
            }
            
          } catch (error) {
            console.error("[ContentGenerator] Error applying brand voice highlights:", error);
            setGeneratedContent(content);
            setDebugInfo(`Generated ${count} words. Error applying brand voice highlights: ${error.message}`);
          }
        } else {
          // No brand voice data, just set the content
          setGeneratedContent(content);
          setDebugInfo(`Generated ${count} words. No brand voice data available for highlighting.`);
        }
      } else {
        setDebugInfo(`Error: ${result.error || "Failed to generate content"}`);
      }
    } catch (error) {
      console.error("Error generating content:", error);
      setDebugInfo(`Error: ${error.message || "An unexpected error occurred"}`);
    } finally {
      setIsGeneratingContent(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* VERIFICATION: Layout changes are applied - 1/3 and 2/3 width */}
      <h1 className="text-3xl font-bold mb-6">Create New Content</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Panel - 1/3 width */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Content Details</CardTitle>
            <CardDescription>Provide information about the content you want to create</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {/* Content Type */}
              <div className="space-y-2">
                <Label htmlFor="content-type">Content Type</Label>
                <Select
                  value={contentType}
                  onValueChange={setContentType}
                >
                  <SelectTrigger id="content-type">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog-post">Blog Post</SelectItem>
                    <SelectItem value="linkedin-post">LinkedIn Post</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Topic */}
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="E.g., Benefits of content marketing"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              
              {/* Length */}
              <div className="space-y-2">
                <Label htmlFor="content-length">Length</Label>
                <Select value={contentLength} onValueChange={setContentLength}>
                  <SelectTrigger id="content-length">
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentType === "blog-post" ? (
                      blogLengthOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))
                    ) : (
                      linkedinLengthOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Outline */}
              <div className="space-y-2">
                <Label htmlFor="content-outline">Add a few key points (optional)</Label>
                <Textarea
                  id="content-outline"
                  placeholder="E.g., Include a section on benefits, mention a case study"
                  value={contentOutline}
                  onChange={(e) => setContentOutline(e.target.value)}
                  className="min-h-[60px]"
                />
              </div>
              
              {/* Debug Toggle */}
              <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-500">Debug Mode</span>
                <button 
                  onClick={() => setShowRawHtml(!showRawHtml)}
                  className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  {showRawHtml ? "Hide Raw HTML" : "Show Raw HTML"}
                </button>
              </div>
              
              {/* Generate Button */}
              <Button 
                onClick={handleGenerateContent} 
                disabled={isGeneratingContent || !topic}
                className="w-full mt-4"
              >
                {isGeneratingContent ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  `Generate ${contentType === "linkedin-post" ? "LinkedIn Post" : "Blog Post"}`
                )}
              </Button>
              
              {/* Debug Info - Make smaller and less prominent */}
              {debugInfo && (
                <div className="p-2 border-t border-gray-100 mt-4 text-xs text-gray-500 font-mono">
                  {debugInfo}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Output Panel - 2/3 width */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Generated Content</CardTitle>
              <CardDescription>
                Your generated content will appear here
              </CardDescription>
            </div>
            {wordCount > 0 && (
              <div className="bg-slate-100 dark:bg-slate-800 text-sm px-3 py-1.5 rounded-md">
                {wordCount} words
              </div>
            )}
          </CardHeader>
          <CardContent>
            {isGeneratingContent ? (
              <div className="flex items-center justify-center h-[400px]">
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Generating your content...</p>
                </div>
              </div>
            ) : (
              generatedContent ? (
                showRawHtml ? (
                  <div className="min-h-[400px] border rounded-md p-6 bg-slate-950 text-slate-200 overflow-auto font-mono text-xs">
                    <pre>{generatedContent}</pre>
                  </div>
                ) : (
                  <HighlightedContent
                    content={generatedContent}
                    highlights={highlights}
                    brandVoice={brandVoiceDataForHighlighting}
                    className={`min-h-[400px] border rounded-md p-6 bg-white dark:bg-slate-900 dark:text-slate-100 overflow-auto font-inter ${contentType === "linkedin-post" ? "linkedin-post" : ""}`}
                    showLegend={true}
                  />
                )
              ) : (
                <div className="min-h-[400px] border rounded-md p-6 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                  <p className="text-muted-foreground">Your generated content will appear here.</p>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
