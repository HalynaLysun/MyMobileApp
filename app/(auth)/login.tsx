import { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "expo-router";
import AppButton from "@/components/AppButton";
import { Colors } from "@/constants/Colors";
import ScreenContainer from "@/components/ScreenContainer";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const userFromDb = useQuery(api.auth.getUserForLogin, {
    email: email.toLowerCase().trim(),
    password: password,
  });

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Помилка", "Заповніть всі поля");
      return;
    }

    setIsSubmitting(true);

    try {
      if (userFromDb) {
        await login({
          ...userFromDb,
          ageRange: [userFromDb.ageRange[0], userFromDb.ageRange[1]],
        });
        router.replace("/(tabs)");
      } else {
        // Якщо запит повернув null — значить дані невірні
        Alert.alert("Помилка", "Невірний email або пароль");
      }
    } catch (error) {
      Alert.alert("Помилка", "Щось пішло не так");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Log In</Text>

      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={Colors.textLight}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={Colors.textLight}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Тільки твій AppButton */}
      <AppButton
        title={isSubmitting ? "Loading..." : "Log In"}
        onPress={handleLogin}
      />

      {/* Для простого тексту-посилання краще Pressable без зайвих ефектів */}
      <Pressable
        onPress={() => router.push("/(auth)/register")}
        style={styles.footer}
      >
        <Text style={styles.footerText}>
          Don’t have an account? <Text style={styles.link}>Sign Up</Text>
        </Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  inputGroup: { marginBottom: 20 },
  input: {
    borderWidth: 1,
    color: Colors.textMain,
    borderColor: Colors.inputBorder,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: Colors.inputBack,
  },
  footer: { marginTop: 20, alignItems: "center" },
  footerText: { color: Colors.textLight },
  link: { color: Colors.linkPink, fontWeight: "bold" },
});
