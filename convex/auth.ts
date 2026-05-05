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
    onlyNew: v.optional(v.boolean()),
    verifiedOnly: v.optional(v.boolean()),
    minHeight: v.optional(v.float64()),
    maxHeight: v.optional(v.float64()),
    smoking: v.optional(v.string()),
    alcohol: v.optional(v.string()),
    wantChildren: v.optional(v.string()),
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
      // КОРІНЬ: Сюди пишемо тільки загальні дані (згідно зі schema.ts)
      email: args.email,
      password: args.password,
      firstName: args.firstName,
      age: args.age,
      userGender: args.userGender,
      city: args.city,
      createdAt: args.createdAt,
      bio: args.bio,
      photoUrl: args.photoUrl,
      isVerified: false, // Нове поле зі схеми (дефолтно false)
      hasSeenWelcome: false,
      isTestPassed: false,

      // ЗМІНА: Групуємо дані у вкладений об'єкт filters
      filters: {
        gender: args.gender,
        distance: args.distance,
        ageRange: args.ageRange,
        intention: args.intention,
        verifiedOnly: false, // Додаємо обов'язкове поле зі схеми
        onlyNew: false, // Додаємо обов'язкове поле зі схеми
        minHeight: args.minHeight,
        maxHeight: args.maxHeight,
        smoking: args.smoking,
        alcohol: args.alcohol,
        wantChildren: args.wantChildren,
      },

      // ЗМІНА: Створюємо вкладений об'єкт details (анкета)
      details: {
        intention: args.intention,
      },
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
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    // Перевіряємо, чи існує юзер і чи збігається пароль
    if (!user || user.password !== args.password) {
      return null;
    }

    return user;
  },
});
