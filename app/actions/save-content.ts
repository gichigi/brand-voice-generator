"use server"

import { saveContent as saveContentToStorage, updateContent as updateContentInStorage } from "@/lib/data-service"

export async function saveContent(contentData: {
  id?: string
  contentType: string
  topic: string
  content: string
  outline?: string
  htmlContent?: string
  markdownContent?: string
  keywords?: string
  customContext?: string
}) {
  try {
    if (contentData.id) {
      // Update existing content
      const result = await updateContentInStorage(contentData.id, contentData)
      return { success: result }
    } else {
      // Save new content
      const id = await saveContentToStorage(contentData)
      return { success: true, id }
    }
  } catch (error) {
    console.error("Error saving content:", error)
    return {
      success: false,
      error: "An error occurred while saving the content. Please try again.",
    }
  }
}
