"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Mock data storage using localStorage
const getLocalStorage = (key: string, defaultValue: any = null) => {
  if (typeof window === "undefined") return defaultValue
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error)
    return defaultValue
  }
}

const setLocalStorage = (key: string, value: any) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
      return false
    }
  }
  return false
}

// Context for storage operations
const StorageContext = createContext<any>(null)

// Create a stable reference to the storage functions
const createStorageFunctions = () => ({
  // Brand voice functions
  getBrandVoice: async () => {
    return getLocalStorage("brandVoice", {
      executiveSummary: "Our brand voice is confident, innovative, and user-friendly.",
      pillars: [
        {
          id: "1",
          title: "Confidence",
          means: ["Assertive", "Knowledgeable", "Authoritative"],
          doesntMean: ["Arrogant", "Boastful", "Dismissive"],
          inspiration: "We speak with the assurance of an industry leader.",
        },
        {
          id: "2",
          title: "Innovation",
          means: ["Forward-thinking", "Creative", "Cutting-edge"],
          doesntMean: ["Reckless", "Untested", "Gimmicky"],
          inspiration: "We showcase our commitment to pushing boundaries and creating new solutions.",
        },
        {
          id: "3",
          title: "User-friendly",
          means: ["Approachable", "Clear", "Helpful"],
          doesntMean: ["Oversimplified", "Patronizing", "Vague"],
          inspiration: "We make complex concepts accessible and easy to understand for all users.",
        },
      ],
    })
  },

  saveBrandVoice: async (data: any) => {
    return setLocalStorage("brandVoice", data)
  },

  // Onboarding functions
  saveOnboardingData: async (args: any) => {
    setLocalStorage("onboardingData", args)
    setLocalStorage("onboardingCompleted", true)
    return true
  },

  getOnboardingData: async () => {
    return getLocalStorage("onboardingData")
  },

  isOnboardingCompleted: async () => {
    return getLocalStorage("onboardingCompleted", false)
  },

  // Content functions
  saveContent: async (args: any) => {
    const contentId = `content_${Date.now()}`
    const content = {
      _id: contentId,
      id: contentId,
      ...args,
      createdAt: new Date().toISOString(),
    }

    // Get existing contents or create new array
    const contents = getLocalStorage("contents", [])
    contents.unshift(content)
    setLocalStorage("contents", contents)

    return { success: true, contentId }
  },

  getUserContents: async () => {
    return getLocalStorage("contents", [])
  },

  deleteContent: async (id: string) => {
    const contents = getLocalStorage("contents", [])
    const updatedContents = contents.filter((content) => content.id !== id && content._id !== id)
    return setLocalStorage("contents", updatedContents)
  },

  updateContent: async (id: string, updates: any) => {
    const contents = getLocalStorage("contents", [])
    const updatedContents = contents.map((content) => {
      if (content.id === id || content._id === id) {
        return { ...content, ...updates, updatedAt: new Date().toISOString() }
      }
      return content
    })
    return setLocalStorage("contents", updatedContents)
  },

  getContentById: async (id: string) => {
    const contents = getLocalStorage("contents", [])
    return contents.find((content) => content.id === id || content._id === id) || null
  },
})

export function ConvexProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  // Create storage functions only once
  const [storageFunctions] = useState(createStorageFunctions)

  // Simulate initial loading
  useEffect(() => {
    let mounted = true
    const timer = setTimeout(() => {
      if (mounted) {
        setIsLoading(false)
      }
    }, 500)

    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({ ...storageFunctions, isLoading }), [storageFunctions, isLoading])

  return <StorageContext.Provider value={contextValue}>{children}</StorageContext.Provider>
}

export function useConvex() {
  const context = useContext(StorageContext)
  if (!context) {
    throw new Error("useConvex must be used within a ConvexProvider")
  }
  return context
}

// Simplified hooks that mimic Convex's API but use localStorage instead
export function useMutation(mutationName: string) {
  const storage = useConvex()
  return React.useCallback(
    async (args: any) => {
      try {
        return await storage[mutationName](args)
      } catch (error) {
        console.error(`Error in mutation ${mutationName}:`, error)
        throw error
      }
    },
    [storage, mutationName],
  )
}

export function useQuery(queryName: string, args?: any) {
  const storage = useConvex()
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  React.useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const result = await storage[queryName](args)
        if (mounted) {
          setData(result)
          setError(null)
        }
      } catch (err) {
        console.error(`Error in query ${queryName}:`, err)
        if (mounted) {
          setError(err instanceof Error ? err : new Error(String(err)))
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  }, [queryName, args, storage])

  return { data, isLoading, error }
}

export function useConvexAuth() {
  // Always return authenticated since we're removing auth
  const [isLoading, setIsLoading] = useState(true)

  React.useEffect(() => {
    let mounted = true
    // Simulate loading
    const timer = setTimeout(() => {
      if (mounted) {
        setIsLoading(false)
      }
    }, 500)

    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [])

  return {
    isAuthenticated: true,
    isLoading,
  }
}
