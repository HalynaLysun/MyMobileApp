import { Alert, Platform, Text } from "react-native";
import { useAuth } from "@/context/AuthContext"; // Імпортуємо наш хук
import { useRouter } from "expo-router";
import AppButton from "@/components/AppButton";
import ScreenContainer from "@/components/ScreenContainer";
import UserProfileContent from "@/components/UserProfileContent";

export default function ProfileScreen() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const executeLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleLogout = async () => {
    const title = "Log Out";
    const message = "Are you sure you want to log out?";

    if (Platform.OS === "web") {
      // Стандартний алерт для браузера
      const confirmed = window.confirm(`${message}`);
      if (confirmed) {
        await executeLogout();
      }
    } else {
      // Нативний алерт для iOS/Android
      Alert.alert(title, message, [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", style: "destructive", onPress: executeLogout },
      ]);
    }
  };

  const isTestComplete = !!user?.isTestPassed;

  if (!user) {
    return (
      <ScreenContainer>
        <Text>Loading...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      {/* {user && <Text style={styles.email}>Ви залогінені як: {user.email}</Text>} */}
      <UserProfileContent user={user} />
      <AppButton
        title="Edit Profile"
        onPress={() => router.push("/edit-profile")}
      />

      <AppButton
        title={isTestComplete ? "Retake the Test" : "Take the Test"}
        onPress={
          () =>
            // {
            //   if (isTestComplete) {
            //     // Для "Retake" краще додати підтвердження, щоб не стерти дані випадково
            //     Alert.alert(
            //       "Retake Test",
            //       "This will update your current matching preferences. Continue?",
            //       [
            //         { text: "Cancel", style: "cancel" },
            //         { text: "Yes", onPress: () => router.push("/questions") },
            //       ],
            //     );
            //   } else {
            router.push("/questions")
          //   }
          // }
        }
      />
      <AppButton title="Log out" onPress={handleLogout} />
    </ScreenContainer>
  );
}
