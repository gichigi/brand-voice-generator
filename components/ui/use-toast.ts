"use client"

import type * as React from "react"
import { navigationEvents } from "@/lib/navigation-events"

// This file is based on the Shadcn UI toast implementation
// but simplified for our needs

type ToastProps = {
  title?: string
  description?: string | React.ReactNode
  variant?: "default" | "destructive"
  duration?: number
  action?: React.ReactNode
}

export const toast = ({ title, description, variant = "default", duration = 5000, action }: ToastProps) => {
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById("toast-container")
  if (!toastContainer) {
    toastContainer = document.createElement("div")
    toastContainer.id = "toast-container"
    toastContainer.style.position = "fixed"
    toastContainer.style.bottom = "1rem"
    toastContainer.style.right = "1rem"
    toastContainer.style.zIndex = "9999"
    toastContainer.style.display = "flex"
    toastContainer.style.flexDirection = "column"
    toastContainer.style.gap = "0.5rem"
    document.body.appendChild(toastContainer)
  }

  // Create toast element
  const toastElement = document.createElement("div")
  toastElement.className = `toast ${variant === "destructive" ? "toast-destructive" : "toast-default"}`

  // Update styling to match the rest of the application
  if (variant === "destructive") {
    toastElement.style.backgroundColor = "#fef2f2" // Light red background
    toastElement.style.color = "#b91c1c" // Red text
    toastElement.style.borderColor = "#fee2e2" // Light red border
  } else {
    toastElement.style.backgroundColor = "#ffffff" // White background
    toastElement.style.color = "#1f2937" // Dark text
    toastElement.style.borderColor = "#e5e7eb" // Light gray border
  }

  toastElement.style.padding = "1rem"
  toastElement.style.borderRadius = "0.5rem" // Rounded corners
  toastElement.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" // Subtle shadow
  toastElement.style.marginBottom = "0.75rem"
  toastElement.style.width = "20rem"
  toastElement.style.maxWidth = "100%"
  toastElement.style.transition = "all 0.3s ease"
  toastElement.style.opacity = "0"
  toastElement.style.transform = "translateY(1rem)"
  toastElement.style.border = "1px solid"
  toastElement.style.cursor = "default"

  // Add title if provided
  if (title) {
    const titleElement = document.createElement("div")
    titleElement.className = "toast-title"
    titleElement.style.fontWeight = "600" // Semi-bold
    titleElement.style.marginBottom = "0.25rem"
    titleElement.style.fontSize = "0.875rem" // 14px
    titleElement.textContent = title
    toastElement.appendChild(titleElement)
  }

  // Add description if provided
  if (description) {
    const descElement = document.createElement("div")
    descElement.className = "toast-description"
    descElement.style.fontSize = "0.875rem" // 14px
    descElement.style.lineHeight = "1.25rem" // 20px

    if (typeof description === "string") {
      // Check if this is a content saved/updated notification
      if (
        (description.toLowerCase().includes("has been saved") ||
          description.toLowerCase().includes("has been updated")) &&
        !description.toLowerCase().includes("pillar") &&
        !description.toLowerCase().includes("brand voice")
      ) {
        // Create a paragraph for the description text
        descElement.textContent = description.replace(/\s+view in library/i, "")

        // Create a separate link element for "View Library"
        const linkContainer = document.createElement("div")
        linkContainer.style.marginTop = "0.5rem"

        const linkElement = document.createElement("a")
        linkElement.href = "/dashboard/history"
        linkElement.textContent = "View Library"
        linkElement.style.color = "#000000" // Black text
        linkElement.style.textDecoration = "underline"
        linkElement.style.cursor = "pointer"
        linkElement.style.fontWeight = "500" // Medium weight

        // Use our navigation events system for client-side routing
        linkElement.addEventListener("click", (e) => {
          e.preventDefault()
          navigationEvents.navigate("/dashboard/history")
        })

        linkContainer.appendChild(linkElement)

        // Add both elements to the toast
        toastElement.appendChild(descElement)
        toastElement.appendChild(linkContainer)

        // Return early since we've already added the elements
        toastContainer.appendChild(toastElement)

        // Animate in
        setTimeout(() => {
          toastElement.style.opacity = "1"
          toastElement.style.transform = "translateY(0)"
        }, 10)

        // Remove after duration
        setTimeout(() => {
          toastElement.style.opacity = "0"
          toastElement.style.transform = "translateY(1rem)"

          // Remove from DOM after animation
          setTimeout(() => {
            if (toastContainer.contains(toastElement)) {
              toastContainer.removeChild(toastElement)
            }
          }, 300)
        }, duration)

        return
      } else {
        descElement.textContent = description
      }
    } else {
      // For React nodes, we'll just use a generic message
      descElement.textContent = "Notification"
    }

    toastElement.appendChild(descElement)
  }

  // Add to container
  toastContainer.appendChild(toastElement)

  // Animate in
  setTimeout(() => {
    toastElement.style.opacity = "1"
    toastElement.style.transform = "translateY(0)"
  }, 10)

  // Remove after duration
  setTimeout(() => {
    toastElement.style.opacity = "0"
    toastElement.style.transform = "translateY(1rem)"

    // Remove from DOM after animation
    setTimeout(() => {
      if (toastContainer.contains(toastElement)) {
        toastContainer.removeChild(toastElement)
      }
    }, 300)
  }, duration)
}

// Hook for components
export const useToast = () => {
  return { toast }
}
