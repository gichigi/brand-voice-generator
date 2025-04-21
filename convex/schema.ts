import { defineSchema, defineTable } from "convex/schema"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(),
    onboardingCompleted: v.boolean(),
  }).index("by_token", ["tokenIdentifier"]),

  brandVoices: defineTable({
    userId: v.id("users"),
    executiveSummary: v.string(),
    pillars: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        means: v.array(v.string()),
        doesntMean: v.array(v.string()),
        inspiration: v.string(),
      }),
    ),
  }).index("by_user", ["userId"]),

  onboardingData: defineTable({
    userId: v.id("users"),
    businessName: v.string(),
    yearFounded: v.string(),
    businessDescription: v.string(),
    selectedDemographics: v.array(v.string()),
    businessValues: v.array(v.string()),
    additionalInfo: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  contents: defineTable({
    userId: v.id("users"),
    contentType: v.string(),
    topic: v.string(),
    content: v.string(),
    outline: v.optional(v.string()),
    createdAt: v.string(),
  }).index("by_user", ["userId"]),
})
