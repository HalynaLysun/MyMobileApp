import { mutation, query } from "./_generated/server";
import { v, Infer } from "convex/values";

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

const filtersDefinition = v.object({
  gender: genderValidator,
  ageRange: v.array(v.number()),
  intention: intentionValidator,
});

type FilterFields = Infer<typeof filtersDefinition>;

export const updateFilters = mutation({
  args: {
    _id: v.id("users"),
    gender: v.optional(genderValidator),
    distance: v.optional(v.number()),
    ageRange: v.optional(v.array(v.number())),
    intention: v.optional(intentionValidator),
    hasSeenWelcome: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { _id, ...fields } = args;
    await ctx.db.patch(_id, fields); // Patch просто оновлює існуючі поля
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
    filters: filtersDefinition,
  },
  handler: async (ctx, { currentUserId, filters }) => {
    return await ctx.db
      .query("users")
      .filter((q) => {
        // 1. Початкові умови (ID та Вік)
        const conditions = [
          q.neq(q.field("_id"), currentUserId),
          q.gte(q.field("age"), filters.ageRange[0]),
          q.lte(q.field("age"), filters.ageRange[1]),
        ];

        // 2. Автоматичний цикл по всім іншим полям
        // Просто перелічи назви полів з бази, які мають збігатися
        const fieldsToFilter: (keyof FilterFields)[] = ["intention"];
        // Якщо додаси "city" в масив вище, воно запрацює саме!

        fieldsToFilter.forEach((field) => {
          const val = filters[field];
          if (val) conditions.push(q.eq(q.field(field), val));
        });

        // 3. Спеціальна умова для статі (бо там є "all")
        if (filters.gender !== "all") {
          conditions.push(q.eq(q.field("userGender"), filters.gender));
        }

        return q.and(...conditions);
      })
      .collect();
  },
});

export const markWelcomeAsSeen = mutation({
  args: { _id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args._id, { hasSeenWelcome: true });
  },
});

export const updateProfile = mutation({
  args: {
    firstName: v.optional(v.string()),
    bio: v.optional(v.string()),
    intention: v.optional(
      v.union(
        v.literal("chatting"),
        v.literal("serious relationship"),
        v.literal("casual dating"),
        v.literal("friendship"),
      ),
    ),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) throw new Error("Not authenticated");

    // const email = identity.email;
    // if (!email)
    //   throw new Error("Email is required but not provided by identity");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, args);
    return { success: true };
  },
});
