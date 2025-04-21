// Mock data for initial implementation
// In Phase 2, this will be replaced with actual analysis from OpenAI
export function mockAnalyzeContent(content: string, pillars: any[]): any[] {
  if (!content || !pillars || pillars.length === 0) {
    return []
  }

  // This is a simplified mock implementation
  // It randomly highlights some sentences based on keywords from pillars
  const highlights = []
  const sentences = content.split(/(?<=[.!?])\s+/)

  sentences.forEach((sentence, index) => {
    const sentenceStart = content.indexOf(sentence)
    const sentenceEnd = sentenceStart + sentence.length

    // Randomly assign some sentences to pillars based on keywords
    pillars.forEach((pillar, pillarIndex) => {
      const keywords = pillar.means || []

      if (keywords.some((keyword) => sentence.toLowerCase().includes(keyword.toLowerCase())) || Math.random() < 0.2) {
        // 20% chance to highlight for demo purposes

        highlights.push({
          text: sentence,
          pillarIndex,
          startIndex: sentenceStart,
          endIndex: sentenceEnd,
        })
      }
    })
  })

  return highlights
}

// Toggle state management
export function getHighlightToggleState(): boolean {
  if (typeof window === "undefined") return true

  const state = localStorage.getItem("showBrandVoiceHighlights")
  return state === null ? true : state === "true"
}

export function setHighlightToggleState(state: boolean): void {
  if (typeof window === "undefined") return

  localStorage.setItem("showBrandVoiceHighlights", String(state))
}
