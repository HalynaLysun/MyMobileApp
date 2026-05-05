import { v } from "convex/values";
import { query } from "./_generated/server";

export const getOtherUsers = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    if (!args.userId) return [];

    // Беремо всіх юзерів, крім поточного
    const users = await ctx.db.query("users").collect();

    return users.filter((user) => user._id !== args.userId);
  },
});
