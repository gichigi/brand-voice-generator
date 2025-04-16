"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Upload, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { generateAvatarColor, getInitials } from "@/lib/avatar-utils"
import {
  getUserPreferences,
  saveUserPreferences,
  resetUserPreferences,
  type UserPreferences,
} from "@/lib/user-preferences"

// Mock user data
const userData = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  company: "Acme Inc.",
  role: "Marketing Manager",
  bio: "Marketing professional with 5+ years of experience in content creation and brand strategy.",
  profileImage: null, // null indicates no profile image
}

export default function ProfilePage() {
  const router = useRouter()
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Content settings state
  // const [autoGeneratePrompt, setAutoGeneratePrompt] = useState(true)
  // const [brandVoiceEnabled, setBrandVoiceEnabled] = useState(true)
  // const [defaultContentType, setDefaultContentType] = useState("blog-post")
  // const [defaultContentLength, setDefaultContentLength] = useState("medium")
  // const [includeImageSuggestions, setIncludeImageSuggestions] = useState(true)
  // const [includeQuotes, setIncludeQuotes] = useState(true)
  // const [readingAge, setReadingAge] = useState([12])
  // const [wordCount, setWordCount] = useState([500])

  useEffect(() => {
    const loadPreferences = async () => {
      const prefs = await getUserPreferences()
      setPreferences(prefs)
    }
    loadPreferences()
  }, [])

  // Generate avatar color based on user's name for consistency
  const avatarColor = generateAvatarColor(userData.name)
  const initials = getInitials(userData.name)

  const handleSave = async () => {
    if (!preferences) return

    setIsSaving(true)
    try {
      await saveUserPreferences(preferences)
      // Show success toast or message
    } catch (error) {
      // Show error toast or message
      console.error("Failed to save preferences:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = async () => {
    setIsLoading(true)
    try {
      const defaultPrefs = await resetUserPreferences()
      setPreferences(defaultPrefs)
      // Show success toast or message
    } catch (error) {
      // Show error toast or message
      console.error("Failed to reset preferences:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Profile Overview Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Profile Overview</CardTitle>
                <CardDescription>Your public profile information</CardDescription>
              </div>
              <Badge variant="outline" className="text-sm">
                Pro Plan
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <Avatar className="h-24 w-24">
                {userData.profileImage ? <AvatarImage src={userData.profileImage} alt={userData.name} /> : null}
                <AvatarFallback
                  style={{
                    backgroundColor: avatarColor.background,
                    color: avatarColor.foreground,
                  }}
                  className="text-2xl"
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center gap-2 md:items-start">
                <h3 className="text-xl font-semibold">{userData.name}</h3>
                <p className="text-sm text-muted-foreground">{userData.email}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 gap-1">
                    <Upload className="h-3.5 w-3.5" />
                    Upload
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8">
                    Remove
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-medium">Usage This Month</h4>
                <Progress value={65} className="h-2" />
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>65/100 content generations</span>
                  <span>65%</span>
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-medium">Subscription</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pro Plan - $29/month</span>
                  <Button size="sm" variant="outline" className="h-8">
                    Manage
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Tabs */}
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="content">Content Settings</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={userData.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue={userData.email} />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" defaultValue={userData.company} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue={userData.role} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue={userData.bio}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <Switch id="marketing-emails" defaultChecked />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Receive emails about new features, tips, and product updates
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Content Settings Tab */}
          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Generation Settings</CardTitle>
                <CardDescription>Customize how content is generated and displayed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Brand Voice Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Brand Voice</h3>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="brand-voice-enabled">Enable Brand Voice</Label>
                        <p className="text-xs text-muted-foreground">Apply your brand voice to all generated content</p>
                      </div>
                      <Switch
                        id="brand-voice-enabled"
                        checked={preferences?.brandVoiceEnabled ?? true}
                        onCheckedChange={(checked) =>
                          setPreferences((prev) => (prev ? { ...prev, brandVoiceEnabled: checked } : null))
                        }
                      />
                    </div>

                    {!preferences?.brandVoiceEnabled && (
                      <div className="rounded-md bg-amber-50 p-3 text-amber-800 flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Brand Voice Disabled</p>
                          <p className="text-xs">
                            Your content will be generated without your brand voice guidelines. This may result in
                            inconsistent messaging.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Prompt Generation Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Prompt Generation</h3>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-generate-prompt">Auto-Generate Prompt</Label>
                        <p className="text-xs text-muted-foreground">
                          Automatically generate a detailed prompt based on your content selections
                        </p>
                      </div>
                      <Switch
                        id="auto-generate-prompt"
                        checked={preferences?.autoGeneratePrompt ?? true}
                        onCheckedChange={(checked) =>
                          setPreferences((prev) => (prev ? { ...prev, autoGeneratePrompt: checked } : null))
                        }
                      />
                    </div>

                    {!preferences?.autoGeneratePrompt && (
                      <div className="rounded-md bg-muted p-3">
                        <p className="text-xs text-muted-foreground">
                          When disabled, the prompt will default to: "I want to create a [content type] with a length of
                          [content length] about [topic input]."
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Default Content Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Default Content Settings</h3>
                  <Separator />
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="default-content-type">Default Content Type</Label>
                      <Select
                        value={preferences?.defaultContentType ?? "blog-post"}
                        onValueChange={(value) =>
                          setPreferences((prev) => (prev ? { ...prev, defaultContentType: value } : null))
                        }
                      >
                        <SelectTrigger id="default-content-type">
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blog-post">Blog Post</SelectItem>
                          <SelectItem value="linkedin-post">LinkedIn Post</SelectItem>
                          <SelectItem value="email-newsletter">Email Newsletter</SelectItem>
                          <SelectItem value="twitter-post">Twitter Post</SelectItem>
                          <SelectItem value="twitter-thread">Twitter Thread</SelectItem>
                          <SelectItem value="landing-page">Landing Page</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="default-content-length">Default Content Length</Label>
                      <Select
                        value={preferences?.defaultContentLength ?? "medium"}
                        onValueChange={(value) =>
                          setPreferences((prev) => (prev ? { ...prev, defaultContentLength: value } : null))
                        }
                      >
                        <SelectTrigger id="default-content-length">
                          <SelectValue placeholder="Select content length" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Short</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="long">Long</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Content Enhancement Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Content Enhancements</h3>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="include-image-suggestions">Include Image Suggestions</Label>
                        <p className="text-xs text-muted-foreground">
                          Add text-based image suggestions to generated content
                        </p>
                      </div>
                      <Switch
                        id="include-image-suggestions"
                        checked={preferences?.includeImageSuggestions ?? true}
                        onCheckedChange={(checked) =>
                          setPreferences((prev) => (prev ? { ...prev, includeImageSuggestions: checked } : null))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="include-quotes">Include Quotes</Label>
                        <p className="text-xs text-muted-foreground">Add relevant quotes to enhance your content</p>
                      </div>
                      <Switch
                        id="include-quotes"
                        checked={preferences?.includeQuotes ?? true}
                        onCheckedChange={(checked) =>
                          setPreferences((prev) => (prev ? { ...prev, includeQuotes: checked } : null))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Reading Level and Word Count */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Content Complexity</h3>
                  <Separator />
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Reading Age</Label>
                        <span className="text-sm text-muted-foreground">{preferences?.readingAge ?? 12} years</span>
                      </div>
                      <Slider
                        min={8}
                        max={18}
                        step={1}
                        value={[preferences?.readingAge ?? 12]}
                        onValueChange={(value) =>
                          setPreferences((prev) => (prev ? { ...prev, readingAge: value[0] } : null))
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Lower values create simpler content, higher values use more complex language.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Default Word Count</Label>
                        <span className="text-sm text-muted-foreground">~{preferences?.wordCount ?? 500} words</span>
                      </div>
                      <Slider
                        min={100}
                        max={1000}
                        step={50}
                        value={[preferences?.wordCount ?? 500]}
                        onValueChange={(value) =>
                          setPreferences((prev) => (prev ? { ...prev, wordCount: value[0] } : null))
                        }
                      />
                      <p className="text-xs text-muted-foreground">Approximate length of the generated content.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleReset} disabled={isLoading}>
                  Reset to Defaults
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subscription & Billing</CardTitle>
                <CardDescription>Manage your subscription and billing information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">Pro Plan</h3>
                      <p className="text-sm text-muted-foreground">$29/month, billed monthly</p>
                    </div>
                    <Badge>Current Plan</Badge>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Next billing date</span>
                      <span>April 1, 2025</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Content generations</span>
                      <span>100/month</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Brand voice profiles</span>
                      <span>5</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">
                      Change Plan
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                      Cancel Subscription
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="mb-4 text-sm font-medium">Payment Method</h3>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-md bg-muted p-2">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 04/2026</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                      <Button variant="outline" size="sm">
                        Add New
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="mb-4 text-sm font-medium">Billing History</h3>
                  <div className="rounded-lg border">
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">March 1, 2025</p>
                        <p className="text-sm text-muted-foreground">Pro Plan - Monthly</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$29.00</p>
                        <Button variant="link" size="sm" className="h-auto p-0">
                          Download
                        </Button>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">February 1, 2025</p>
                        <p className="text-sm text-muted-foreground">Pro Plan - Monthly</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$29.00</p>
                        <Button variant="link" size="sm" className="h-auto p-0">
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
