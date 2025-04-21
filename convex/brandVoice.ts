// TODO: Replace this mock implementation with actual Convex query

// Mock brand voice data
const mockBrandVoice = {
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
}

export const getBrandVoice = async (ctx) => {
  // TODO: Implement actual Convex query
  return mockBrandVoice
}
