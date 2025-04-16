// Content related types
export interface ContentItem {
  id: string
  contentType: string
  topic: string
  content: string
  outline?: string
  htmlContent?: string
  keywords?: string
  wordCount?: number
  createdAt: string
  updatedAt?: string
}

// Brand voice related types
export interface BrandVoice {
  executiveSummary: string
  pillars: BrandVoicePillar[]
}

export interface BrandVoicePillar {
  id: string
  title: string
  means: string[]
  doesntMean: string[]
  inspiration: string
  description?: string
  color?: string
  index?: number
}

// Brand voice highlight related types
export interface BrandVoiceHighlight {
  id: string
  text: string
  pillarIndex: number
  explanation: string
  pillarId?: string
  pillarTitle?: string
  pillarDescription?: string
}

// For UI components
export interface BrandVoiceLegendPillar {
  id: string
  index: number
  title: string
  description?: string
  color?: string
} 