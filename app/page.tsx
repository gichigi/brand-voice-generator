"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, MessageSquare, Check, Star, BookOpen, Wand2, FileType, Repeat } from "lucide-react"
import { useEffect, useState } from "react"
import { isOnboardingCompleted } from "@/lib/data-service"

export default function Home() {
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if onboarding is completed
    const completed = isOnboardingCompleted()
    setOnboardingComplete(completed)
    setIsLoading(false)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Brand Voice Generator</span>
          </div>
          <div className="flex items-center gap-4">
            {isLoading ? (
              <Button disabled>Loading...</Button>
            ) : onboardingComplete ? (
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <Link href="/onboarding">
                <Button>Get Started</Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Create Content They Can't Ignore
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Stop asking ChatGPT to "make it sound good." Generate killer content that's tailored to your audience
                  and sounds just like you. Every time.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 min-[400px]:flex-row">
                {isLoading ? (
                  <Button size="lg" className="gap-1.5" disabled>
                    Loading... <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : onboardingComplete ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="gap-1.5">
                      Go to Dashboard <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/onboarding">
                    <Button size="lg" className="gap-1.5">
                      Start for Free <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Link href="#how-it-works">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
                    }}
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24" id="how-it-works">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  No complicated setup. No endless tweaking. Just three straightforward steps to nail your brand voice
                  and put it to work.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold">Answer Questions</h3>
                <p className="text-center text-muted-foreground">
                  Quick questions, zero fluff. Tell us who you are and who you're talking to. Five minutes, tops.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold">Get Your Voice</h3>
                <p className="text-center text-muted-foreground">
                  We'll craft your voice blueprint—not vague adjectives, but actual guidelines you'll actually use.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold">Create Content</h3>
                <p className="text-center text-muted-foreground">
                  Push a button, get content that sounds like you wrote it (on your best writing day, after perfect
                  coffee).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Powerful Features</h2>
              <p className="text-muted-foreground md:text-lg">
                Forget generic AI tools. These features actually solve your real content problems.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-3">
              {[
                {
                  title: "Brand Voice Framework",
                  description: "Get a unique 3-pillar framework that captures your brand's personality and values.",
                  icon: Sparkles,
                },
                {
                  title: "Generate Blog Posts",
                  description: "Create compelling, on-brand content with AI assistance in minutes.",
                  icon: MessageSquare,
                },
                {
                  title: "Content Library",
                  description: "Store and organize all your generated content in one place for easy access.",
                  icon: BookOpen,
                },
                {
                  title: "Content Repurposing",
                  description: "Transform your content into different formats like social posts, emails, and more.",
                  icon: Repeat,
                  comingSoon: true,
                },
                {
                  title: "Content Fine-Tuning",
                  description: "Refine and perfect your content with advanced editing and enhancement tools.",
                  icon: Wand2,
                  comingSoon: true,
                },
                {
                  title: "Multiple Content Types",
                  description: "Generate various content formats from blog posts to social media and email campaigns.",
                  icon: FileType,
                  comingSoon: true,
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center p-6 rounded-lg border bg-background relative"
                >
                  {feature.comingSoon && (
                    <div className="absolute -top-3 right-3 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full border border-amber-200 font-medium">
                      Coming Soon
                    </div>
                  )}
                  <div className="rounded-full p-3 bg-primary/10 mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">What Our Users Say</h2>
              <p className="text-muted-foreground md:text-lg">
                Don't just take our word for it. These folks were skeptical too—until they tried it.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote:
                    "Brand Voice Generator helped us maintain a consistent brand voice across all our marketing channels. It's like having an expert copywriter on demand.",
                  author: "Sarah Johnson",
                  role: "Marketing Director",
                  company: "TechStart Inc.",
                  image: "/images/sarah-johnson.jpeg",
                },
                {
                  quote:
                    "The brand voice framework is incredibly detailed and actionable. It's transformed how our team creates content.",
                  author: "Michael Chen",
                  role: "Content Manager",
                  company: "Growth Labs",
                  image: "/images/michael-chen.jpeg",
                },
                {
                  quote:
                    "We've seen a 40% increase in engagement since using Brand Voice Generator for our social media content.",
                  author: "Emma Rodriguez",
                  role: "Social Media Manager",
                  company: "Spark Digital",
                  image: "/images/emma-rodriguez.png",
                },
              ].map((testimonial, i) => (
                <div key={i} className="flex flex-col gap-4 p-6 rounded-lg border bg-background">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.author}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="flex-1 text-muted-foreground">{testimonial.quote}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Simple, Transparent Pricing</h2>
              <p className="text-muted-foreground md:text-lg">
                No hidden fees. No surprise upgrades. Just straightforward value.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {/* Starter Plan - Active */}
              <div className="flex flex-col p-6 rounded-lg border bg-background relative">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">Starter</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">Free</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Everything you actually need, zero cost</p>
                </div>
                <ul className="flex-1 space-y-2 mb-6">
                  {[
                    "Complete brand voice framework",
                    "All content types (blog, social, etc.)",
                    "Content library access",
                    "Customizable content length",
                    "Keyword optimization",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                {isLoading ? (
                  <Button disabled>Loading...</Button>
                ) : onboardingComplete ? (
                  <Link href="/dashboard" className="w-full">
                    <Button className="w-full">Go to Dashboard</Button>
                  </Link>
                ) : (
                  <Link href="/onboarding" className="w-full">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                )}
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
                <ul className="flex-1 space-y-2 mb-6">
                  {[
                    "Everything in Starter, plus:",
                    "250 content generation",
                    "Content repurposing tools",
                    "SEO optimization features",
                    "Team collaboration (up to 3 users)",
                    "Content calendar integration",
                    "Priority support",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button disabled variant="outline">
                  Coming Soon
                </Button>
              </div>

              {/* Enterprise Plan - Disabled */}
              <div className="flex flex-col p-6 rounded-lg border bg-background/80 relative opacity-70">
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg z-10">
                  {/*<p className="font-medium text-muted-foreground">Coming Soon</p>*/}
                </div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold">Enterprise</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">Custom</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">For larger organizations</p>
                </div>
                <ul className="flex-1 space-y-2 mb-6">
                  {[
                    "Everything in Pro, plus:",
                    "Unlimited content generations",
                    "Custom brand voice templates",
                    "Advanced team management",
                    "API access for custom integrations",
                    "Multi-brand support",
                    "Dedicated account manager",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button disabled variant="outline">
                  Coming Soon
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Brand Voice Generator</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 Brand Voice Generator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
