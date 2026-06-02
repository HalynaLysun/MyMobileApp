import { Alert, Platform, Text, View, StyleSheet } from "react-native";
import { useAuth } from "@/context/AuthContext"; // Імпортуємо наш хук
import { useRouter } from "expo-router";
import AppButton from "@/components/AppButton";
import ScreenContainer from "@/components/ScreenContainer";
import UserProfileContent from "@/components/UserProfileContent";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

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
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>My Details</Text>

        <View style={styles.infoGrid}>
          {/* Зріст */}
          <View style={styles.infoBadge}>
            <Ionicons name="resize-outline" size={16} color={Colors.primary} />
            <Text style={styles.infoText}>
              Height: {user.details?.height ? `${user.details.height} cm` : "—"}
            </Text>
          </View>

          {/* Зодіак */}
          <View style={styles.infoBadge}>
            <Ionicons name="moon-outline" size={16} color={Colors.primary} />
            <Text style={styles.infoText}>
              Zodiac: {user.details?.zodiac || "—"}
            </Text>
          </View>

          {/* Статус куріння */}
          <View style={styles.infoBadge}>
            <Ionicons name="flame-outline" size={16} color={Colors.primary} />
            <Text style={styles.infoText}>
              Smoking:{" "}
              {user.details?.smoking === "smoker"
                ? "Smoker"
                : user.details?.smoking === "non-smoker"
                  ? "Non-smoker"
                  : "—"}
            </Text>
          </View>
        </View>
      </View>
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
            router.push("/questions?from=profile")
          //   }
          // }
        }
      />
      <AppButton title="Log out" onPress={handleLogout} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textMain,
    marginBottom: 12,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  infoBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.inputBack,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textMain,
    marginLeft: 6,
    fontWeight: "500",
  },
  buttonGroup: {
    gap: 5,
  },
});
