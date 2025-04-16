// Also update the regeneratePillar function's prompt to match the improved approach:

// Create a detailed prompt for the OpenAI model
const prompt = (
  data: any,
  demographics: any,
  businessValues: any,
  otherPillars: any,
  existingPillars: any,
  pillarIndex: any,
) => {
  return `
Generate a new brand voice pillar for ${data.businessName}, founded in ${data.yearFounded}.

Context:
Business Description: ${data.businessDescription}
Target Demographics: ${demographics}
Core Values: ${businessValues}
Additional Info: ${data.additionalInfo || "None provided"}
Existing Pillars: ${otherPillars}

First, analyze what would complement the existing voice pillars:
1. What communication style would work well with the existing pillars?
2. What emotional response or perception would enhance the overall brand voice?

IMPORTANT GUIDELINES FOR THE NEW PILLAR:
- The pillar MUST be a SINGLE WORD adjective
- Choose a pillar that complements the existing pillars: ${otherPillars}
- The pillar should be practical and immediately applicable to content creation
- The new pillar MUST be different from the one being replaced: ${existingPillars[pillarIndex].title}
- Avoid generic, overused terms like: Consistent, Innovative, Professional, Empathetic, Authentic, Friendly, Informative, Ethical, Sustainable, Engaging, Dynamic, Trustworthy, Customer-centric, Reliable, Effective, Insightful, Quality-driven, Strategic, Visionary

For the pillar:
1. Use a SINGLE WORD adjective as the title
2. Provide 3 specific "What it means" guidelines that show exactly how to implement this pillar in content
3. List 3 "What it doesn't mean" pitfalls to avoid when applying this pillar
4. Give 1 relevant brand inspiration example with a brief explanation of how they excel at this aspect and how it relates to ${data.businessName}'s context

Format the response as a structured JSON object with this structure:
{
"id": "pillar-id",
"title": "SingleWordAdjective",
"means": ["Specific guideline 1", "Specific guideline 2", "Specific guideline 3"],
"doesntMean": ["Specific pitfall 1", "Specific pitfall 2", "Specific pitfall 3"],
"inspiration": "Brand Example – With brief explanation of how they excel at this aspect and how it relates to ${data.businessName}"
}

IMPORTANT: 
- The pillar MUST be a SINGLE WORD adjective
- The pillar should complement the existing pillars
- The pillar must be immediately useful and easy to apply to content creation
- Return ONLY the JSON object without any markdown formatting or additional text`
}
