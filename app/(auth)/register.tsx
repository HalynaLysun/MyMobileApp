import { useState } from "react";
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

export default function RegisterScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleNextStep = () => {
    // Валідація заповнення полів
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    router.push({
      pathname: "/setupProfile",
      params: { email, password },
    });
  };

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
            autoFocus={true}
            placeholder="example@mail.com"
            placeholderTextColor={Colors.textPlaceholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={Colors.textPlaceholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCorrect={false}
          />

          <View style={{ marginTop: 20 }}>
            <AppButton
              title="Sign Up"
              variant="pink"
              onPress={handleNextStep}
            />

            <AppButton
              title="Already have an account? Log In"
              variant="white"
              onPress={() => {
                console.log("Go to Login");
                router.push("/login");
              }}
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
    backgroundColor: Colors.inputBack, // Легкий відтінок сірого для поля
    borderRadius: 16,
    padding: 16,
    color: Colors.textMain,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.inputBorder, // Світло-сірий для обводки
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
