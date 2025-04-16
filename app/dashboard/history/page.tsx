"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FileText, Plus, Search, Copy, Pencil, Trash2, Calendar, Clock, Tag, ArrowUpDown, Loader2 } from "lucide-react"
import { getContents, deleteContent, type ContentItem } from "@/lib/data-service"
import { toast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default function ContentLibrary() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [filteredItems, setFilteredItems] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortField, setSortField] = useState<"date" | "title">("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  // Load content items on mount
  useEffect(() => {
    loadContentItems()
  }, [])

  // Filter and sort items when search query or sort settings change
  useEffect(() => {
    let items = [...contentItems]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      items = items.filter(
        (item) =>
          item.topic.toLowerCase().includes(query) || (item.keywords && item.keywords.toLowerCase().includes(query)),
      )
    }

    // Apply sorting
    items = sortItems(items, sortField, sortDirection)

    setFilteredItems(items)
  }, [searchQuery, contentItems, sortField, sortDirection])

  const loadContentItems = () => {
    setIsLoading(true)
    try {
      // Use a more efficient approach with requestAnimationFrame
      requestAnimationFrame(() => {
        const items = getContents()
        setContentItems(items)

        // Defer sorting to the next frame to improve perceived performance
        requestAnimationFrame(() => {
          // Apply initial sort (newest first)
          setFilteredItems(sortItems(items, "date", "desc"))
          setIsLoading(false)
        })
      })
    } catch (error) {
      console.error("Error loading content:", error)
      toast({
        title: "Error",
        description: "Failed to load your content library",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const sortItems = (items: ContentItem[], field: "date" | "title", direction: "asc" | "desc") => {
    return [...items].sort((a, b) => {
      if (field === "date") {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return direction === "asc" ? dateA - dateB : dateB - dateA
      } else {
        // Sort by title/topic
        const titleA = a.topic.toLowerCase()
        const titleB = b.topic.toLowerCase()
        return direction === "asc" ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA)
      }
    })
  }

  const handleSort = (field: "date" | "title") => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field and default to descending
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const handleCopyContent = (item: ContentItem) => {
    try {
      // Create a temporary element to parse the HTML
      const tempElement = document.createElement("div")
      tempElement.innerHTML = item.htmlContent || item.content

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
        variant: "destructive",
      })
    }
  }

  const handleEditContent = (id: string) => {
    router.push(`/dashboard/content/new?id=${id}`)
  }

  const handleDeleteContent = async (id: string) => {
    try {
      const success = deleteContent(id)
      if (success) {
        // Remove from state
        const updatedItems = contentItems.filter((item) => item.id !== id)
        setContentItems(updatedItems)
        setFilteredItems(
          sortItems(
            updatedItems.filter((item) =>
              searchQuery ? item.topic.toLowerCase().includes(searchQuery.toLowerCase()) : true,
            ),
            sortField,
            sortDirection,
          ),
        )

        toast({
          title: "Deleted",
          description: "Content removed from your library",
        })
      } else {
        throw new Error("Failed to delete content")
      }
    } catch (error) {
      console.error("Error deleting content:", error)
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      })
    } finally {
      setItemToDelete(null)
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (e) {
      return "Unknown date"
    }
  }

  // Format time for display
  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "h:mm a")
    } catch (e) {
      return ""
    }
  }

  // Get content type display name
  const getContentTypeDisplay = (contentType: string) => {
    if (contentType.includes("blog-post")) {
      return "Blog Post"
    }
    if (contentType.includes("linkedin-post")) {
      return "LinkedIn Post"
    }
    if (contentType.includes("social-media")) {
      return "Social Media"
    }
    if (contentType.includes("email")) {
      return "Email"
    }
    return contentType
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-900 dark:text-indigo-300">Content Library</h1>
          <Button onClick={() => router.push("/dashboard/content/new")} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            New Content
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search library..."
            className="max-w-sm bg-white dark:bg-slate-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort: {sortField === "date" ? "Date" : "Title"} (
                {sortDirection === "asc" ? "Oldest first" : "Newest first"})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort("date")}>
                Date (Newest first) {sortField === "date" && sortDirection === "desc" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("date")}>
                Date (Oldest first) {sortField === "date" && sortDirection === "asc" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("title")}>
                Title (A-Z) {sortField === "title" && sortDirection === "asc" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("title")}>
                Title (Z-A) {sortField === "title" && sortDirection === "desc" && "✓"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <Card key={item.id} className="cursor-pointer hover:bg-muted/50 transition-colors border shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">{item.topic}</h2>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleCopyContent(item)}>
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditContent(item.id)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <AlertDialog
                          open={itemToDelete === item.id}
                          onOpenChange={(open) => !open && setItemToDelete(null)}
                        >
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setItemToDelete(item.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this content from your library.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteContent(item.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(item.createdAt)}</span>
                      </div>
                      {item.keywords && (
                        <div className="flex items-center gap-1">
                          <Tag className="h-4 w-4" />
                          <span>{item.keywords}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {getContentTypeDisplay(item.contentType)}
                      </Badge>
                      {item.wordCount && (
                        <Badge variant="outline" className="text-xs">
                          {item.wordCount} words
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-medium mb-2">
                {searchQuery ? "No matching content found" : "Your library is empty"}
              </h2>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? `Try a different search term or clear your search` : "Content you save will appear here"}
              </p>
              <Button onClick={() => router.push("/dashboard/content/new")} className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Create New Content
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
