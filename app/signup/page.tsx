"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Only access auth after component is mounted on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Safely access auth only on client side
  const auth = useAuth()
  const { signUp } = auth || {}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signUp) return // Safety check

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const success = await signUp(name, email, password)

      if (success) {
        toast({
          title: "Account created",
          description: "Your account has been created successfully!",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Signup failed",
          description: "This email may already be in use. Please try another.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Signup error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show a loading state until client-side code takes over
  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8">
        <div className="w-full max-w-md space-y-8 text-center">
          <LoadingSpinner />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">VoiceForge</h1>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link href="/login" className="font-medium text-primary hover:text-primary/90">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={isLoading || !signUp}>
              {isLoading ? <LoadingSpinner className="mr-2" /> : null}
              Create account
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
