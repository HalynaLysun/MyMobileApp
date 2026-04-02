import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "@/context/AuthContext"; // Імпортуємо наш хук
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function ProfileScreen() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    // Після логауту NavigationData в _layout.tsx
    // автоматично побачить, що user === null, і перекине на Welcome.
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профіль</Text>

      {user && <Text style={styles.email}>Ви залогінені як: {user.email}</Text>}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Вийти з аккаунту</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
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
