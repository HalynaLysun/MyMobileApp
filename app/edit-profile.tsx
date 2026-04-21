import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "expo-router";
import AppButton from "@/components/AppButton";
import ScreenContainer from "@/components/ScreenContainer";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { INTENTIONS } from "@/constants/IntentionOptions";

export default function EditProfileScreen() {
  const { user, updatePreferences } = useAuth();
  const router = useRouter();
  const updateProfile = useMutation(api.users.updateProfile);

  // Стейт для редагування
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [intention, setIntention] = useState(user?.intention || "chatting");

  const handleSave = async () => {
    if (!user || !user.email) {
      alert("User data not loaded");
      return;
    }

    try {
      await updateProfile({
        firstName,
        bio,
        intention,
        email: user.email, // TypeScript підхопить типи з Convex
      });

      if (updatePreferences) {
        updatePreferences({
          intention,
        });
      }
      alert("Profile updated successfully!");
      router.back();
    } catch (error) {
      console.error("Save failed:", error);
      alert("Could not update profile.");
    }
  };

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text style={styles.headerTitle}>Edit Profile</Text>

        {/* First Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="How others will see you"
          />
        </View>

        {/* Intention Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dating Goal</Text>
          <View style={styles.intentionGrid}>
            {INTENTIONS.map((item) => (
              <TouchableOpacity
                key={item._id}
                style={[
                  styles.intentionCard,
                  intention === item._id && styles.intentionCardActive,
                ]}
                onPress={() => setIntention(item._id)}
              >
                <Ionicons
                  name={item.filterIcon}
                  size={20}
                  color={
                    intention === item._id ? Colors.primary : Colors.secondary
                  }
                />
                <Text
                  style={[
                    styles.intentionLabel,
                    intention === item._id && styles.intentionLabelActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bio */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>About Me</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            placeholder="Share something interesting about yourself..."
            multiline
            numberOfLines={5}
          />
        </View>

        <AppButton title="Save Changes" onPress={handleSave} />

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 25,
    color: Colors.textMain,
  },
  inputGroup: { marginBottom: 24 },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textMain,
    marginBottom: 10,
    marginLeft: 4,
  },
  input: {
    backgroundColor: Colors.inputBack,
    borderRadius: 15,
    padding: 16,
    fontSize: 16,
    color: Colors.textPlaceholder,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  bioInput: { height: 120, textAlignVertical: "top" },
  intentionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  intentionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: "48%", // Два елементи в ряд
  },
  intentionCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.inputBack,
  },
  intentionLabel: {
    fontSize: 13,
    color: Colors.textLight,
    marginLeft: 8,
    fontWeight: "500",
  },
  intentionLabelActive: { color: Colors.primary, fontWeight: "700" },
  cancelButton: { marginTop: 15, alignItems: "center", padding: 10 },
  cancelText: { color: Colors.textMain, fontSize: 16, fontWeight: "600" },
});
