import type { Metadata } from "next"
import ContentGeneratorClientPage from "./ContentGeneratorClientPage"

export const metadata: Metadata = {
  title: "Create New Content",
  description: "Generate professional content using your brand voice.",
}

export default function ContentGeneratorPage() {
  return <ContentGeneratorClientPage />
}
