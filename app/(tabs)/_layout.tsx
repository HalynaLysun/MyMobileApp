import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Це прибере верхній заголовок [cite: 2026-01-24]
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home", // Це назва вкладки внизу [cite: 2026-01-24]
        }}
      />
      <Tabs.Screen
        name="about" // Якщо у тебе є файл about.tsx [cite: 2026-01-24]
        options={{
          title: "About",
        }}
      />
    </Tabs>
  );
}
