import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import ScreenContainer from "@/components/ScreenContainer";
import AppButton from "@/components/AppButton";
import { Colors } from "@/constants/Colors";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <View style={styles.content}>
        {/* Місце для логотипу або ілюстрації */}
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>❤️</Text>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Find your perfect match</Text>
          <Text style={styles.subtitle}>
            Join our community and find someone special today.
          </Text>
        </View>

        <AppButton
          title="Create Account"
          variant="pink"
          onPress={() => router.push("/register")}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.inputBack,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 50,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  title: {
    fontFamily: "Raleway",
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.textMain,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: "Raleway",
    fontSize: 16,
    color: Colors.textLight,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
