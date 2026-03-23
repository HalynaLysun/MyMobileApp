import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    password: v.string(), // Для навчання поки що так, потім додамо шифрування
    gender: v.string(), // "Male", "Female"
    distance: v.number(), // Наприклад: 10
    ageRange: v.array(v.number()),
    intention: v.string(), // Наприклад: [18, 30]
    createdAt: v.number(),
  }).index("by_email", ["email"]),
});
