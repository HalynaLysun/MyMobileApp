import { Stack } from "expo-router";
import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";

export default function RootLayout() {
  // Всередині компонента:
  const [fontsLoaded] = useFonts({
    Raleway: Raleway_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
