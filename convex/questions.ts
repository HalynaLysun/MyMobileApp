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
    await ctx.db.patch(args.userId, {
      isTestPassed: true,
      testAnswers: args.testAnswers,
      // Можна також оновити намір на "serious relationship",
      // бо тест відкриває саме цю можливість
      intention: "serious relationship",
    });
    return await ctx.db.get(args.userId);
  },
});
