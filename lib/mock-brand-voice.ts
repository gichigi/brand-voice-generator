// This is a mock implementation of the brand voice data
const mockBrandVoice = {
  executiveSummary: "Our brand voice is confident, approachable, and innovative.",
  pillars: [
    {
      id: "confident",
      title: "Confident",
      means: ["Use assertive language", "Provide clear, actionable advice", "Back statements with data or expertise"],
      doesntMean: ["Being arrogant or dismissive", "Ignoring customer concerns", "Overstating capabilities"],
      inspiration: "Apple - They confidently present their products as revolutionary.",
    },
    {
      id: "approachable",
      title: "Approachable",
      means: ["Use conversational language", "Explain complex concepts simply", "Address the reader directly"],
      doesntMean: [
        "Using slang or overly casual language",
        "Oversimplifying important details",
        "Losing professionalism",
      ],
      inspiration: "Mailchimp - Their communication style is friendly and easy to understand.",
    },
    {
      id: "innovative",
      title: "Innovative",
      means: [
        "Highlight new ideas and approaches",
        "Use forward-thinking language",
        "Encourage creative problem-solving",
      ],
      doesntMean: [
        "Dismissing traditional methods entirely",
        "Using buzzwords without substance",
        "Promoting untested ideas",
      ],
      inspiration: "Tesla - They position themselves at the forefront of automotive innovation.",
    },
  ],
}

export function getMockBrandVoice() {
  // Simulate an asynchronous API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockBrandVoice)
    }, 500) // Simulate a 500ms delay
  })
}
