import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const saveOnboardingData = mutation({
  args: {
    businessName: v.string(),
    yearFounded: v.string(),
    businessDescription: v.string(),
    selectedDemographics: v.array(v.string()),
    businessValues: v.array(v.string()),
    additionalInfo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Called saveOnboardingData without authentication present")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    const existingData = await ctx.db
      .query("onboardingData")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first()

    if (existingData) {
      await ctx.db.patch(existingData._id, args)
    } else {
      await ctx.db.insert("onboardingData", { userId: user._id, ...args })
    }

    await ctx.db.patch(user._id, { onboardingCompleted: true })
  },
})

export const getOnboardingData = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return null
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first()

    if (!user) {
      return null
    }

    const onboardingData = await ctx.db
      .query("onboardingData")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first()

    return onboardingData
  },
})
