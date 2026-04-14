import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/context/AuthContext";
import { DEFAULT_USER_PREFERENCES, UserProfile } from "@/types/user";
import ScreenContainer from "@/components/ScreenContainer";
import AppButton from "@/components/AppButton";
import { Colors } from "@/constants/Colors";

export default function SetupProfileScreen() {
  const { email, password } = useLocalSearchParams(); // Отримуємо дані з Кроку 1
  const router = useRouter();
  const registerUser = useMutation(api.auth.register); // Твоя мутація в Convex
  const { login } = useAuth();

  // Стейт для обов'язкових полів
  const [firstName, setFirstName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [userGender, setUserGender] = useState<
    "male" | "female" | "non-binary"
  >("male");
  const [isSaving, setIsSaving] = useState(false);

  const handleFinalRegister = async () => {
    console.log("Button pressed!");

    const cleanFirstName = firstName.trim();
    const cleanCity = city.trim();
    // 1. Валідація
    if (!cleanFirstName || !age || !cleanCity) {
      Alert.alert("Wait!", "Please fill in all fields to continue.");
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18) {
      Alert.alert("Age check", "You must be 18+ to use this app.");
      return;
    }

    try {
      setIsSaving(true);
      // 2. Формуємо повний об'єкт для бази даних
      const userData = {
        email: (email as string).trim().toLowerCase(),
        password: password as string,
        firstName: cleanFirstName,
        age: ageNum,
        userGender,
        city: cleanCity,
        ...DEFAULT_USER_PREFERENCES, // Додаємо стандартні фільтри
        createdAt: Date.now(),
      };

      // 3. Записуємо в Convex
      const fullUser = await registerUser(userData);
      if (fullUser) {
        login({
          ...fullUser,
          _id: fullUser._id, // переконайся, що мапиш _id у id, якщо твій UserProfile цього вимагає
          ageRange: [fullUser.ageRange[0], fullUser.ageRange[1]] as [
            number,
            number,
          ],
        } as UserProfile);
      }
      router.replace("/(tabs)");
    } catch (err) {
      Alert.alert(
        "Registration Failed",
        err instanceof Error ? err.message : "Unknown error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenContainer withScroll={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Almost done!</Text>
          <Text style={styles.subtitle}>
            Last Step: Choose the info about you
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            value={firstName}
            onChangeText={setFirstName}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.inputLabel}>Age</Text>
              <TextInput
                style={styles.input}
                placeholder="25"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
            <View style={{ flex: 2 }}>
              <Text style={styles.inputLabel}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="Amsterdam"
                value={city}
                onChangeText={setCity}
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>I am a:</Text>
          <View style={styles.genderContainer}>
            {(["male", "female", "non-binary"] as const).map((g) => (
              <View key={g} style={{ flex: 1, marginHorizontal: 4 }}>
                <AppButton
                  title={g.charAt(0).toUpperCase() + g.slice(1)}
                  // Кнопка стає активною (рожевою), якщо цей гендер обраний
                  isActive={userGender === g}
                  // Якщо не обраний, вона буде білою (variant="white")
                  variant="white"
                  onPress={() => setUserGender(g)}
                  // Трохи зменшимо висоту та текст, щоб три кнопки влізли в рядок
                  style={{ height: 48, marginVertical: 0 }}
                  textSize={14}
                />
              </View>
            ))}
          </View>

          <View style={{ marginTop: 20 }}>
            <AppButton
              title="Save & Start"
              loading={isSaving}
              variant="pink"
              onPress={handleFinalRegister}
            />
          </View>
        </View>
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
    color: Colors.textMain,
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
    backgroundColor: Colors.inputBack,
    borderRadius: 16,
    padding: 16,
    color: Colors.textMain,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  row: {
    flexDirection: "row",
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});
