import { mutation, query } from "./_generated/server";
import { v, Infer } from "convex/values";

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

const filtersDefinition = v.object({
  gender: genderValidator,
  ageRange: v.array(v.number()),
  intention: intentionValidator,
});

type FilterFields = Infer<typeof filtersDefinition>;

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
    });

    // 3. ПОВЕРТАЄМО ВЕСЬ ОБ'ЄКТ (ось тут зміна)
    return await ctx.db.get(userId);
  },
});

export const updateFilters = mutation({
  args: {
    id: v.id("users"),
    gender: v.optional(genderValidator),
    distance: v.optional(v.number()),
    ageRange: v.optional(v.array(v.number())),
    intention: v.optional(intentionValidator),
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
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { hasSeenWelcome: true });
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
