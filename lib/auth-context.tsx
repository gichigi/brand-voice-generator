"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type User = {
  id: string
  name: string
  email: string
  profileImage?: string | null
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (name: string, email: string, password: string) => Promise<boolean>
  signOut: () => void
}

const defaultUser: User = {
  id: "user_123456",
  name: "Jane Doe",
  email: "jane.doe@example.com",
  profileImage: null,
}

// Create a context with a default value that's safe for SSR
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Only run client-side code after mounting
  useEffect(() => {
    setMounted(true)

    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const signIn = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo purposes, accept any credentials
    // In a real app, you would validate against stored credentials
    const storedCredentials = localStorage.getItem("credentials")
    if (storedCredentials) {
      const credentials = JSON.parse(storedCredentials)
      const matchedUser = credentials.find((cred: any) => cred.email === email && cred.password === password)

      if (matchedUser) {
        const userData = {
          id: `user_${Date.now()}`,
          name: matchedUser.name,
          email: matchedUser.email,
          profileImage: null,
        }
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        return true
      }
      return false
    }

    // Fallback to demo user if no credentials stored
    setUser(defaultUser)
    localStorage.setItem("user", JSON.stringify(defaultUser))
    return true
  }

  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Store credentials in localStorage
    const storedCredentials = localStorage.getItem("credentials")
    const credentials = storedCredentials ? JSON.parse(storedCredentials) : []

    // Check if email already exists
    if (credentials.some((cred: any) => cred.email === email)) {
      return false
    }

    // Add new credentials
    credentials.push({ name, email, password })
    localStorage.setItem("credentials", JSON.stringify(credentials))

    // Create and store user
    const userData = {
      id: `user_${Date.now()}`,
      name,
      email,
      profileImage: null,
    }
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))

    return true
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  // Don't render children until client-side code is running
  if (!mounted) {
    return null
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
