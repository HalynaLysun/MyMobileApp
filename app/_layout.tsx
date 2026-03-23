import { Raleway_700Bold, useFonts } from "@expo-google-fonts/raleway";
import { Stack } from "expo-router";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { AuthProvider } from "@/context/AuthContext";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Raleway: Raleway_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)/register" />
        </Stack>
      </AuthProvider>
    </ConvexProvider>
  );
}
