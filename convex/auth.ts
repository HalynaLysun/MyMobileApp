import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { genderValidator, intentionValidator } from "./users";

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
    distance: v.number(),
    gender: genderValidator,
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
      throw new Error("This email is already registered");
    }

    const userId = await ctx.db.insert("users", {
      ...args,
      hasSeenWelcome: false,
      isTestPassed: false,
    });

    // 3. ПОВЕРТАЄМО ВЕСЬ ОБ'ЄКТ (ось тут зміна)
    return await ctx.db.get(userId);
  },
});

export const getUserForLogin = query({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .unique();

    // Перевіряємо, чи існує юзер і чи збігається пароль
    if (!user || user.password !== args.password) {
      return null;
    }

    return user;
  },
});
