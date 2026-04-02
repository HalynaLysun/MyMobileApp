import { Raleway_700Bold, useFonts } from "@expo-google-fonts/raleway";
import { Stack, useRouter, useSegments } from "expo-router";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Colors } from "@/constants/Colors";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

function NavigationData() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    // Логіка перенаправлення
    if (!user && !inAuthGroup) {
      router.replace("/(auth)/welcome");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Raleway: Raleway_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        <NavigationData />
      </AuthProvider>
    </ConvexProvider>
  );
}
