import { Text, StyleSheet, Alert } from "react-native";
import { useAuth } from "@/context/AuthContext"; // Імпортуємо наш хук
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import AppButton from "@/components/AppButton";
import ScreenContainer from "@/components/ScreenContainer";

export default function ProfileScreen() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      // Використовуємо replace, щоб юзер не міг повернутися назад кнопкою "Back"
      router.replace("/(auth)/login"); // Або шлях до твоєї реєстрації, наприклад "/register"
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const isTestComplete =
    !!user?.testAnswers?.q10

  return (
    <ScreenContainer>
      <Text style={styles.title}>Профіль</Text>

      {user && <Text style={styles.email}>Ви залогінені як: {user.email}</Text>}

      <AppButton title="Log out" onPress={handleLogout} />
      <AppButton
        title={isTestComplete ? "Retake the Test" : "Take the Test"}
        onPress={() =>
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
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  logoutText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 16,
  },
});
