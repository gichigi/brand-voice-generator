"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { analyzeWebsite } from "@/app/actions/analyze-website"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface WebsiteAnalyzerProps {
  description: string
  onDescriptionChange: (value: string) => void
}

export function WebsiteAnalyzer({ description, onDescriptionChange }: WebsiteAnalyzerProps) {
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleAnalyzeWebsite = async () => {
    if (!websiteUrl || isAnalyzing) return

    setIsAnalyzing(true)
    setAnalysisError(null)

    try {
      const result = await analyzeWebsite(websiteUrl)

      if (result.error) {
        setAnalysisError(result.error)
        toast({
          title: "Analysis failed",
          description: result.error,
          variant: "destructive",
        })
      } else if (result.description) {
        onDescriptionChange(result.description)
        toast({
          title: "Analysis complete",
          description: "We've generated a description based on your website.",
        })
      } else {
        setAnalysisError("We couldn't analyze your website. Please try again or enter your description manually.")
        toast({
          title: "Analysis failed",
          description: "We couldn't analyze your website. Please try again or enter your description manually.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error analyzing website:", error)
      setAnalysisError("An error occurred while analyzing your website.")
      toast({
        title: "Analysis failed",
        description: "An error occurred while analyzing your website.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAnalyzeWebsite()
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-muted p-4 rounded-md">
        <h3 className="font-medium mb-2">Paste your site to generate a description.</h3>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="apple.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button onClick={handleAnalyzeWebsite} disabled={!websiteUrl || isAnalyzing} variant="outline">
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate"
            )}
          </Button>
        </div>

        {analysisError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{analysisError}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
