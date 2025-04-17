"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, MessageSquare, Check, Star, BookOpen, Wand2, FileType, Repeat } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Choir</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container flex flex-col items-center justify-center gap-4 py-24 text-center md:py-32">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="h-6 w-6 text-primary" />
            <span>Choir</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Your AI Brand Voice Generator
          </h1>
          <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
            Create consistent, on-brand content in seconds. Perfect for marketers, writers, and businesses.
          </p>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link href="/dashboard">
              <Button size="lg" className="w-full min-[400px]:w-auto">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-24 sm:py-32">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Brand Voice Analysis</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Analyze your existing content to understand and replicate your unique brand voice.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Wand2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">AI-Powered Generation</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Generate high-quality content that matches your brand voice perfectly.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <FileType className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Multiple Content Types</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Create blog posts, social media updates, emails, and more with ease.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="container py-24 sm:py-32">
          <div className="mx-auto mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Choose the plan that works best for you</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {/* Free Plan */}
            <div className="flex flex-col p-6 rounded-lg border bg-background">
              <div className="mb-4">
                <h3 className="text-xl font-bold">Free</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Perfect for trying out Choir</p>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Basic brand voice analysis</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>5 content generations per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Standard support</span>
                </li>
              </ul>
              <Link href="/dashboard" className="w-full">
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>

            {/* Pro Plan - Disabled */}
            <div className="flex flex-col p-6 rounded-lg border bg-background/80 relative opacity-70">
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg z-10">
                {/*<p className="font-medium text-muted-foreground">Coming Soon</p>*/}
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-bold">Pro</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">For professionals and small teams</p>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Advanced brand voice analysis</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Unlimited content generations</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Team collaboration</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Analytics dashboard</span>
                </li>
              </ul>
              <Button className="w-full" disabled>Coming Soon</Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
