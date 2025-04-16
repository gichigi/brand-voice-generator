"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { PlusCircle } from "lucide-react"

export default function ContentGeneratorPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Create Content</h1>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Generate New Content</CardTitle>
          <CardDescription>Create professional content using your brand voice</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/dashboard/content/new")} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Content
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
