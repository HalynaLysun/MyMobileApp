import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Опис структури повідомлення для типізації
export interface Message {
  _id: Id<"messages">;
  _creationTime: number;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: number;
  isDeleted: boolean;
  reactions: { userId: string; emoji: string }[];
}

// 1. Отримання повідомлень для конкретного діалогу
export const getMessages = query({
  args: { chatId: v.string() },
  handler: async (ctx, args): Promise<Message[]> => {
    const result = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("chatId"), args.chatId))
      .order("desc") // Свіжі повідомлення знизу для FlatList
      .take(100);

    return result as Message[];
  },
});

// 2. Відправка повідомлення
export const sendMessage = mutation({
  args: {
    chatId: v.string(),
    senderId: v.string(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      chatId: args.chatId,
      senderId: args.senderId,
      text: args.text,
      timestamp: Date.now(),
      reactions: [],
      isDeleted: false,
    });
  },
});

// 3. Додавання або зміна реакції
export const toggleReaction = mutation({
  args: {
    messageId: v.id("messages"),
    userId: v.string(),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) return;

    let reactions = message.reactions || [];
    const existingIndex = reactions.findIndex((r) => r.userId === args.userId);

    if (existingIndex > -1) {
      if (reactions[existingIndex].emoji === args.emoji) {
        reactions = reactions.filter((r) => r.userId !== args.userId);
      } else {
        reactions[existingIndex].emoji = args.emoji;
      }
    } else {
      reactions.push({ userId: args.userId, emoji: args.emoji });
    }

    await ctx.db.patch(args.messageId, { reactions });
  },
});

// 4. Видалення повідомлення (Soft delete)
export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message || message.senderId !== args.userId) {
      throw new Error("Unauthorized to delete this message");
    }

    await ctx.db.patch(args.messageId, {
      text: "This message was deleted",
      isDeleted: true,
      reactions: [], // Очищуємо реакції
    });
  },
});
