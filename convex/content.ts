import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const saveContent = mutation({
  args: {
    contentType: v.string(),
    topic: v.string(),
    content: v.string(),
    outline: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Called saveContent without authentication present")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    const contentId = await ctx.db.insert("contents", {
      userId: user._id,
      ...args,
      createdAt: new Date().toISOString(),
    })

    return contentId
  },
})

export const getUserContents = query({
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

    const contents = await ctx.db
      .query("contents")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(100)

    return contents
  },
})
