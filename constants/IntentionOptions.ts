import { Colors } from "./Colors";
// import { ComponentProps } from "react";
// import { Ionicons } from "@expo/vector-icons";

// type IconName = ComponentProps<typeof Ionicons>["name"];

export const INTENTIONS = [
  {
    _id: "serious relationship",
    label: "Serious relationship",
    profileIcon: "heart-circle", // Красива для профілю
    filterIcon: "heart",
    color: Colors.secondary,
  },
  {
    _id: "casual dating",
    label: "Casual dating",
    profileIcon: "wine-sharp", // Більш стилізована
    filterIcon: "wine",
    color: Colors.secondary,
  },
  {
    _id: "chatting",
    label: "Just chatting",
    profileIcon: "chatbubble-ellipses-sharp", // Деталізована
    filterIcon: "chatbubbles",
    color: Colors.secondary,
  },
  {
    _id: "friendship",
    label: "Friendship",
    profileIcon: "people-circle-sharp", // Красива
    filterIcon: "people",
    color: Colors.secondary,
  },
] as const;

// Тип для використання в пропсах та стейтах
export type IntentionId = (typeof INTENTIONS)[number]["_id"];
