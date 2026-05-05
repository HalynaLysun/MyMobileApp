import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const intentionValidator = v.union(
  v.literal("chatting"),
  v.literal("serious relationship"),
  v.literal("casual dating"),
  v.literal("friendship"),
);

export const genderValidator = v.union(
  v.literal("male"),
  v.literal("female"),
  v.literal("all"),
);

// const filtersDefinition = v.object({
//   gender: genderValidator,
//   distance: v.number(),
//   ageRange: v.array(v.number()),
//   intention: intentionValidator,
//   minHeight: v.optional(v.number()),
//   maxHeight: v.optional(v.number()),
//   verifiedOnly: v.boolean(),
//   orientation: v.optional(v.array(v.string())),
//   relationshipStatus: v.optional(v.array(v.string())),
//   wantChildren: v.optional(v.string()),
//   smoking: v.optional(v.string()),
//   alcohol: v.optional(v.string()),
//   personalityType: v.optional(v.array(v.string())),
//   religion: v.optional(v.array(v.string())),
//   zodiac: v.optional(v.array(v.string())),
//   onlyNew: v.boolean(),
// });
// type FilterFields = Infer<typeof filtersDefinition>;

export const updateFilters = mutation({
  args: {
    _id: v.id("users"),
    filters: v.optional(
      v.object({
        gender: v.optional(genderValidator),
        distance: v.optional(v.number()),
        ageRange: v.optional(v.array(v.number())),
        intention: v.optional(intentionValidator),
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
    ),
    // hasSeenWelcome: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { _id, filters } = args;
    const user = await ctx.db.get(_id);
    if (!user) throw new Error("User not found");
    await ctx.db.patch(_id, {
      filters: { ...user.filters, ...filters },
      updatedAt: Date.now(), // Оновлюємо час редагування
    });
  },
});

export const getUser = query({
  args: { _id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args._id);
  },
});

export const getRandomUsers = query({
  args: {
    currentUserId: v.id("users"),
    filters: v.object({
      gender: v.union(v.literal("male"), v.literal("female"), v.literal("all")), // "Male", "Female"
      // Наприклад: 10
      ageRange: v.array(v.number()),
      intention: v.union(
        v.literal("chatting"),
        v.literal("serious relationship"),
        v.literal("casual dating"),
        v.literal("friendship"),
      ),
      distance: v.optional(v.number()),
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
  },
  handler: async (ctx, { currentUserId }) => {
    const currentUser = await ctx.db.get(currentUserId);
    if (!currentUser || !currentUser.filters) return [];

    const { filters } = currentUser;
    const now = Date.now();
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

    return await ctx.db
      .query("users")
      .filter((q) => {
        const conditions = [
          q.neq(q.field("_id"), currentUserId),
          // Фільтр по віку (корінь)
          q.gte(q.field("age"), filters.ageRange[0]),
          q.lte(q.field("age"), filters.ageRange[1]),
        ];

        // Фільтр по статі
        if (filters.gender !== "all") {
          conditions.push(q.eq(q.field("userGender"), filters.gender));
        }

        // Фільтр по верифікації
        if (filters.verifiedOnly) {
          conditions.push(q.eq(q.field("isVerified"), true));
        }

        // Фільтр "Тільки нові" (createdAt)
        if (filters.onlyNew) {
          conditions.push(q.gt(q.field("createdAt"), now - SEVEN_DAYS_MS));
        }

        // ПРИКЛАД фільтрації по вкладеним деталям (наприклад, зріст)
        if (filters.minHeight) {
          conditions.push(q.gte(q.field("details.height"), filters.minHeight));
        }

        return q.and(...conditions);
      })
      .collect();
  },
});

export const markWelcomeAsSeen = mutation({
  args: { _id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args._id, {
      hasSeenWelcome: true,
      updatedAt: Date.now(),
    });
  },
});

export const updateProfile = mutation({
  args: {
    _id: v.id("users"),
    firstName: v.optional(v.string()),
    bio: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    filters: v.optional(v.any()),
    details: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { _id, filters, details, ...fields } = args;

    const user = await ctx.db.get(_id);
    if (!user) throw new Error("User not found");

    // Якщо ми передаємо details, зливаємо їх з існуючими
    const updatedDetails = {
      ...(user.details || {}),
      ...(details || {}),
      // Якщо intention прийшов окремо, кладемо його і в details
      // ...(fields.intention ? { intention: fields.intention } : {}),
    };

    const updatedFilters = {
      ...(user.filters || {}),
      ...(filters || {}),
      // ...(fields.intention ? { intention: fields.intention } : {}),
    };

    await ctx.db.patch(_id, {
      ...fields,
      details: updatedDetails,
      filters: updatedFilters,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
