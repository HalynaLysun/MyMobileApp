import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    // --- 1. СИСТЕМНІ ДАНІ (Обов'язкові для акаунта) ---
    email: v.string(),
    password: v.string(), // TODO: Хешувати паролі перед релізом застосунку!
    firstName: v.string(),
    age: v.number(),
    userGender: v.union(
      v.literal("male"),
      v.literal("female"),
      v.literal("non-binary"),
    ), //
    intention: v.optional(v.string()),
    city: v.string(),
    createdAt: v.number(),
    hasSeenWelcome: v.optional(v.boolean()),
    isTestPassed: v.optional(v.boolean()),

    // --- 2. ВІЗУАЛ ТА ОПИС (Те, що бачать першим) ---

    bio: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    isVerified: v.boolean(),

    // --- 3. ФІЛЬТРИ (Кого я шукаю / Налаштування стрічки) ---

    filters: v.object({
      gender: v.union(v.literal("male"), v.literal("female"), v.literal("all")), // "Male", "Female"
      distance: v.number(), // Наприклад: 10
      ageRange: v.array(v.number()),
      intention: v.union(
        v.literal("chatting"),
        v.literal("serious relationship"),
        v.literal("casual dating"),
        v.literal("friendship"),
      ),
      minHeight: v.optional(v.number()),
      maxHeight: v.optional(v.number()),
      verifiedOnly: v.optional(v.boolean()),
      orientation: v.optional(v.array(v.string())),
      relationshipStatus: v.optional(v.array(v.string())),
      wantChildren: v.optional(v.string()),
      smoking: v.optional(v.string()),
      alcohol: v.optional(v.string()),
      personalityType: v.optional(v.array(v.string())),
      religion: v.optional(v.array(v.string())),
      zodiac: v.optional(v.array(v.string())),
      onlyNew: v.optional(v.boolean()),
    }),

    // --- 4. ДЕТАЛІ (Мій профіль / Хто я) ---

    details: v.object({
      intention: v.union(
        v.literal("chatting"),
        v.literal("serious relationship"),
        v.literal("casual dating"),
        v.literal("friendship"),
      ),
      height: v.optional(v.number()),
      orientation: v.optional(v.string()),
      relationshipStatus: v.optional(v.string()),
      children: v.optional(v.string()),
      smoking: v.optional(v.string()),
      alcohol: v.optional(v.string()),
      religion: v.optional(v.string()),
      zodiac: v.optional(v.string()),
      job: v.optional(v.string()),
      personalityType: v.optional(v.string()),
      proudMoment: v.optional(v.string()),
      loveLanguageSend: v.optional(v.string()),
      loveLanguageReceive: v.optional(v.string()),
      languages: v.optional(v.array(v.string())),
      interests: v.optional(v.array(v.string())),
      pets: v.optional(v.array(v.string())),
    }),

    // --- 5. ПСИХОЛОГІЧНИЙ ТЕСТ ---

    testAnswers: v.optional(
      v.object({
        q1: v.array(v.string()),
        q2: v.array(v.string()),
        q3: v.array(v.string()),
        q4: v.array(v.string()),
        q5: v.array(v.string()),
        q6: v.array(v.string()),
        q7: v.array(v.string()),
        q8: v.array(v.string()),
        q9: v.array(v.string()),
        q10: v.array(v.string()),
      }),
    ),
    updatedAt: v.optional(v.number()),
  }).index("by_email", ["email"]),

  messages: defineTable({
    chatId: v.string(), // ID кімнати чату (або комбінація ID двох користувачів)
    senderId: v.string(), // ID відправника повідомлення
    text: v.string(), // Текст повідомлення
    timestamp: v.number(), // Час відправки
    isDeleted: v.boolean(), // Прапорець для м'якого видалення (Soft Delete)
    reactions: v.array(
      // Масив об'єктів для збереження емодзі
      v.object({
        userId: v.string(), // Хто поставив реакцію
        emoji: v.string(), // Який саме емодзі
      }),
    ),
  }).index("by_chatId", ["chatId"]),
});
