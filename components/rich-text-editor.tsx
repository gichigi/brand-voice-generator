"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, LinkIcon, Quote } from "lucide-react"

interface RichTextEditorProps {
  initialContent: string
  onChange: (content: string) => void
  className?: string
  onWordCountChange?: (count: number) => void
}

export function RichTextEditor({ initialContent, onChange, className = "", onWordCountChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const lastSavedContentRef = useRef(initialContent)

  // Initialize editor with content
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent || ""
      lastSavedContentRef.current = initialContent || ""

      // Update initial word count
      if (onWordCountChange) {
        const wordCount = countWords(initialContent || "")
        onWordCountChange(wordCount)
      }
    }
  }, [initialContent, onWordCountChange])

  // Count words in HTML content
  const countWords = (htmlContent: string): number => {
    // Create a temporary div to extract text from HTML
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = htmlContent
    const text = tempDiv.textContent || tempDiv.innerText || ""

    // Count words by splitting on whitespace and filtering out empty strings
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
    return words.length
  }

  // Handle content changes
  const handleInput = () => {
    if (editorRef.current) {
      const currentContent = editorRef.current.innerHTML
      const hasChanged = currentContent !== lastSavedContentRef.current
      setIsDirty(hasChanged)

      // Update word count on input for real-time feedback
      if (onWordCountChange) {
        const wordCount = countWords(currentContent)
        onWordCountChange(wordCount)
      }
    }
  }

  // Format commands
  const execCommand = (command: string, value = "") => {
    document.execCommand(command, false, value)
    handleInput()
    editorRef.current?.focus()
  }

  // Formatting functions
  const formatBold = () => execCommand("bold")
  const formatItalic = () => execCommand("italic")
  const formatUnorderedList = () => execCommand("insertUnorderedList")
  const formatOrderedList = () => execCommand("insertOrderedList")
  const formatH1 = () => execCommand("formatBlock", "<h1>")
  const formatH2 = () => execCommand("formatBlock", "<h2>")
  const formatQuote = () => execCommand("formatBlock", "<blockquote>")

  const formatLink = () => {
    const selection = window.getSelection()
    if (selection && selection.toString()) {
      const url = prompt("Enter the URL:", "https://")
      if (url) {
        execCommand("createLink", url)
      }
    } else {
      alert("Please select some text first")
    }
  }

  // This function is called when the parent component wants to save
  // We need to expose this to the parent
  const saveContent = () => {
    if (editorRef.current) {
      const currentContent = editorRef.current.innerHTML
      onChange(currentContent)
      lastSavedContentRef.current = currentContent
      setIsDirty(false)

      // Update word count on save
      if (onWordCountChange) {
        const wordCount = countWords(currentContent)
        onWordCountChange(wordCount)
      }

      return currentContent
    }
    return null
  }

  // This function is called when the parent component wants to cancel
  // We need to expose this to the parent
  const cancelEdit = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = lastSavedContentRef.current
      setIsDirty(false)

      // Reset word count on cancel
      if (onWordCountChange) {
        const wordCount = countWords(lastSavedContentRef.current)
        onWordCountChange(wordCount)
      }
    }
  }

  // Expose methods to parent component
  useEffect(() => {
    // Attach the methods to the component instance
    const instance = editorRef.current
    if (instance) {
      // @ts-ignore - Adding custom properties to DOM element
      instance.saveContent = saveContent
      // @ts-ignore - Adding custom properties to DOM element
      instance.cancelEdit = cancelEdit
    }
  }, [])

  return (
    <div className={`space-y-2 ${className}`}>
      <TooltipProvider>
        <div className="flex flex-wrap items-center gap-1 p-1 border rounded-md bg-slate-50 dark:bg-slate-800">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={formatBold} className="h-8 w-8 p-0">
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={formatItalic} className="h-8 w-8 p-0">
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={formatH1} className="h-8 w-8 p-0">
                <Heading1 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Heading 1</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={formatH2} className="h-8 w-8 p-0">
                <Heading2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Heading 2</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={formatUnorderedList} className="h-8 w-8 p-0">
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bullet List</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={formatOrderedList} className="h-8 w-8 p-0">
                <ListOrdered className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Numbered List</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={formatQuote} className="h-8 w-8 p-0">
                <Quote className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Quote</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={formatLink} className="h-8 w-8 p-0">
                <LinkIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Link</TooltipContent>
          </Tooltip>

          <div className="ml-auto flex"></div>
        </div>
      </TooltipProvider>

      <div
        ref={editorRef}
        contentEditable
        className={`min-h-[500px] p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent overflow-auto prose prose-slate dark:prose-invert max-w-none ${
          isFocused ? "ring-2 ring-primary" : ""
        }`}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  )
}
