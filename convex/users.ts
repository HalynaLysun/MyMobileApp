import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const intentionValidator = v.union(
  v.literal("chatting"),
  v.literal("serious relationship"),
  v.literal("casual dating"),
  v.literal("friendship"),
);

const genderValidator = v.union(
  v.literal("male"),
  v.literal("female"),
  v.literal("all"),
);

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
    gender: genderValidator, // "Male", "Female"
    distance: v.number(),
    ageRange: v.array(v.number()),
    intention: intentionValidator,
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
    return await ctx.db.insert("users", args);
  },
});

export const updateFilters = mutation({
  args: {
    id: v.id("users"),
    gender: genderValidator,
    distance: v.number(),
    ageRange: v.array(v.number()),
    intention: intentionValidator,
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
