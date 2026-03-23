import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const register = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    gender: v.string(),
    distance: v.number(),
    ageRange: v.array(v.number()),
    intention: v.string(),
  },
  handler: async (ctx, args) => {
    // Перевірка на дублікат
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existing) {
      throw new Error("Цей email вже зареєстровано");
    }

    // Записуємо все разом із часом створення
    return await ctx.db.insert("users", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const updateFilters = mutation({
  args: {
    id: v.id("users"),
    gender: v.string(),
    distance: v.number(),
    ageRange: v.array(v.number()),
    intention: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields); // Patch просто оновлює існуючі поля
  },
});
