import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import ScreenContainer from "@/components/ScreenContainer";
import AppButton from "@/components/AppButton";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuth(); // Використовуємо функцію login з нашого контексту

  const registerUser = useMutation(api.users.register);

  const handleRegister = async () => {
    try {
      const newUserId = await registerUser({
        email: email,
        password: password,
        gender: "female",
        distance: 10,
        ageRange: [24, 37],
        intention: "Dating",
      });
      login({ id: newUserId, email: email });
      alert("Success! You are in the cloud ☁️");
      router.replace("/(tabs)");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Невідома помилка";
      alert("Помилка: " + message);
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ScreenContainer withScroll={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Fill in your details to get started
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="example@mail.com"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={{ marginTop: 20 }}>
            <AppButton
              title="Sign Up"
              variant="pink"
              onPress={handleRegister}
            />
          </View>
        </View>

        <AppButton
          title="Back to Welcome"
          variant="white"
          onPress={() => router.back()}
          style={{
            marginTop: 20,
            backgroundColor: "transparent",
            borderWidth: 0,
          }}
        />
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    paddingVertical: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontFamily: "Raleway",
    color: Colors.textMain, // Тепер текст темний і чіткий
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Raleway",
    color: Colors.textLight,
    marginTop: 8,
  },
  formCard: {
    backgroundColor: Colors.white,
    padding: 24,
    borderRadius: 30,
    // Тінь, щоб картка не зливалася зі світлим фоном
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  inputLabel: {
    color: Colors.textMain,
    fontSize: 13,
    marginBottom: 8,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    backgroundColor: "#F7F9FC", // Легкий відтінок сірого для поля
    borderRadius: 16,
    padding: 16,
    color: Colors.textMain,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  backButton: {
    marginTop: 25,
    alignSelf: "center",
  },
  backButtonText: {
    color: Colors.textMain,
    fontSize: 14,
    fontFamily: "Raleway",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
