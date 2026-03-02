import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import ScreenContainer from "@/components/ScreenContainer";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function FiltersScreen() {
  // Створюємо стан для вибору статі [cite: 2026-01-24]
  const [gender, setGender] = useState("woman");

  return (
    <ScreenContainer>
      <Text style={styles.header}>Find your match...</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Gender</Text>

        <View style={styles.buttonGroup}>
          {/* Кнопка "Woman" [cite: 2026-01-24] */}
          <TouchableOpacity
            style={[styles.option, gender === "woman" && styles.selectedOption]}
            onPress={() => setGender("woman")}
          >
            <MaterialCommunityIcons
              name="face-woman-shimmer"
              size={30}
              color={gender === "woman" ? Colors.white : Colors.secondary}
            />
            {/* <Text
              style={[
                styles.optionText,
                gender === "woman" && styles.selectedText,
              ]}
            >
              Woman
            </Text> */}
          </TouchableOpacity>

          {/* Кнопка "Man" [cite: 2026-01-24] */}
          <TouchableOpacity
            style={[styles.option, gender === "man" && styles.selectedOption]}
            onPress={() => setGender("man")}
          >
            <MaterialCommunityIcons
              name="face-man-shimmer"
              size={30}
              color={gender === "man" ? Colors.white : Colors.primary}
            />
            {/* <Text
              style={[
                styles.optionText,
                gender === "man" && styles.selectedText,
              ]}
            >
              Man
            </Text> */}
          </TouchableOpacity>

          {/* Кнопка "Both" [cite: 2026-01-24] */}
          <TouchableOpacity
            style={[styles.option, gender === "both" && styles.selectedOption]}
            onPress={() => setGender("both")}
          >
            <Ionicons
              name="people-outline"
              size={30}
              fontWeight="bold"
              color={gender === "both" ? Colors.white : Colors.textMain}
            />
            {/* <Text
              style={[
                styles.optionText,
                gender === "both" && styles.selectedText,
              ]}
            >
              Both
            </Text> */}
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.applyButton}>
        <Text style={styles.applyButtonText}>Save & Search</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.textMain,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 20,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    color: Colors.textMain,
    marginBottom: 15,
    fontWeight: "600",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  option: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: Colors.background, // Блакитний контур [cite: 2026-01-24]
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: Colors.primary, // Активний блакитний колір [cite: 2026-01-24]
    borderColor: Colors.primary,
  },
  optionText: {
    color: Colors.primary,
    fontWeight: "bold",
  },
  selectedText: {
    color: Colors.white,
  },
  applyButton: {
    backgroundColor: Colors.secondary, // Рожева кнопка дії [cite: 2026-01-14]
    paddingVertical: 18,
    borderRadius: 30,
    marginTop: "auto",
    marginBottom: 20,
    alignItems: "center",
  },
  applyButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
