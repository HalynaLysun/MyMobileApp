import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    password: v.string(), // TODO: Хешувати паролі перед релізом застосунку!

    firstName: v.string(),
    age: v.number(),
    userGender: v.union(
      v.literal("male"),
      v.literal("female"),
      v.literal("non-binary"),
    ), //
    city: v.string(),

    bio: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("all")), // "Male", "Female"
    distance: v.number(), // Наприклад: 10
    ageRange: v.array(v.number()),
    intention: v.union(
      v.literal("dating"),
      v.literal("friendship"),
      v.literal("chat"),
      v.literal("serious relationship"),
    ),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_email", ["email"]),
});
