import { BrandVoice } from "./types"

/**
 * Default fallback brand voice to use when no custom brand voice is available
 */
export const fallbackBrandVoice: BrandVoice = {
  executiveSummary: "A balanced brand voice that combines professionalism with approachability.",
  pillars: [
    {
      id: "fallback-1",
      title: "Clear",
      means: ["Use simple language", "Avoid jargon", "Be concise"],
      doesntMean: ["Oversimplified", "Vague", "Incomplete"],
      inspiration: "We communicate complex ideas in accessible ways.",
    },
    {
      id: "fallback-2",
      title: "Helpful",
      means: ["Focus on solutions", "Anticipate needs", "Provide value"],
      doesntMean: ["Pushy", "Patronizing", "Overpromising"],
      inspiration: "We prioritize being useful over being promotional.",
    },
    {
      id: "fallback-3",
      title: "Authentic",
      means: ["Be honest", "Show personality", "Stay consistent"],
      doesntMean: ["Unprofessional", "Oversharing", "Inconsistent"],
      inspiration: "We build trust through genuine communication.",
    },
  ],
} 