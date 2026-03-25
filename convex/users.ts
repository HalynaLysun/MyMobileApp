import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const register = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    firstName: v.string(),
    age: v.number(),
    userGender: v.union(
      v.literal("male"),
      v.literal("female"),
      v.literal("non-binary"),
    ),
    city: v.string(), // Додаємо city
    createdAt: v.number(),
    bio: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("all")), // "Male", "Female"
    distance: v.number(),
    ageRange: v.array(v.number()),
    intention: v.union(
      v.literal("dating"),
      v.literal("friendship"),
      v.literal("chat"),
      v.literal("serious relationship"),
    ), // Наприклад: [18, 30]
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
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("all")),
    distance: v.number(),
    ageRange: v.array(v.number()),
    intention: v.union(
      v.literal("dating"),
      v.literal("friendship"),
      v.literal("chat"),
      v.literal("serious relationship"),
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields); // Patch просто оновлює існуючі поля
  },
});

export const getUser = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
