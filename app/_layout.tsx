import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Це прибере верхній заголовок [cite: 2026-01-24]
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
