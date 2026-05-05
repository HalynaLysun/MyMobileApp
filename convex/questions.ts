import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const saveTestResults = mutation({
  args: {
    userId: v.id("users"),
    testAnswers: v.object({
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
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    await ctx.db.patch(args.userId, {
      isTestPassed: true,
      testAnswers: args.testAnswers,
      updatedAt: Date.now(), // Додаємо мітку часу оновлення

      // ЗМІНА: Оновлюємо намір у фільтрах (кого я шукаю)
      filters: {
        ...user.filters,
        intention: "serious relationship",
      },

      // ЗМІНА: Оновлюємо намір у деталях (хто я)
      details: {
        ...user.details,
        intention: "serious relationship",
      },
    });

    return await ctx.db.get(args.userId);
  },
});
