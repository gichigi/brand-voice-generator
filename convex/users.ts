import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const getUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return null
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first()
    return user
  },
})

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Called createUser without authentication present")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first()
    if (user !== null) {
      if (user.name !== args.name || user.email !== args.email) {
        await ctx.db.patch(user._id, {
          name: args.name,
          email: args.email,
        })
      }
      return user._id
    }

    return await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      tokenIdentifier: identity.tokenIdentifier,
      onboardingCompleted: false,
    })
  },
})

export const updateOnboardingStatus = mutation({
  args: { completed: v.boolean() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Called updateOnboardingStatus without authentication present")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    await ctx.db.patch(user._id, { onboardingCompleted: args.completed })
  },
})
