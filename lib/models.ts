export type ModelType = "gpt" | "codex" | "dall-e"

export interface Model {
  id: string
  name: string
  description: string
  strengths?: string
  type: ModelType
}

export const types = ["gpt", "codex", "dall-e"] as const

export const models: Model[] = [
  {
    id: "text-davinci-003",
    name: "text-davinci-003",
    description:
      "Most capable GPT-3 model. Can do any task the other models can do, often with higher quality, longer output and better instruction-following. Also supports inserting completions within text.",
    type: "gpt",
    strengths: "Complex intent, cause and effect, creative generation, search, summarization for audience",
  },
  {
    id: "text-curie-001",
    name: "text-curie-001",
    description: "Very capable, but faster and lower cost than Davinci.",
    type: "gpt",
    strengths: "Language translation, complex classification, sentiment, summarization",
  },
  {
    id: "text-babbage-001",
    name: "text-babbage-001",
    description: "Capable of straightforward tasks, very fast, and lower cost.",
    type: "gpt",
    strengths: "Moderate classification, semantic search",
  },
  {
    id: "code-davinci-002",
    name: "code-davinci-002",
    description:
      "Most capable Codex model. Particularly good at translating natural language to code. In addition to completing code, also supports inserting completions within code.",
    type: "codex",
    strengths: null,
  },
  {
    id: "code-cushman-001",
    name: "code-cushman-001",
    description:
      "Almost as capable as Davinci Codex, but slightly faster. This speed advantage may make it preferable for real-time applications.",
    type: "codex",
    strengths: null,
  },
  {
    id: "dall-e",
    name: "DALL·E",
    description:
      "DALL·E is an AI system that can create realistic images and art from a description in natural language. DALL·E 2 can create more realistic images with 4x greater resolution.",
    type: "dall-e",
    strengths: null,
  },
]
