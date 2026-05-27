import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import AppButton from "@/components/AppButton";
import ScreenContainer from "@/components/ScreenContainer";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { INTENTIONS } from "@/constants/IntentionOptions";
import * as ImagePicker from "expo-image-picker";

export default function EditProfileScreen() {
  const { user, updatePreferences, updateUserProfile, isSaving } = useAuth();
  const router = useRouter();

  // Стейт для редагування
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [intention, setIntention] = useState(
    user?.details?.intention || "chatting",
  );
  const [height, setHeight] = useState(
    user?.details?.height ? user.details.height.toString() : "",
  );
  const [zodiac, setZodiac] = useState(user?.details?.zodiac || "");
  const [photoUrl, setPhotoUrl] = useState<string | null>(
    user?.photoUrl || null,
  );

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("We need access to your gallery to change the photo.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhotoUrl(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!user?._id) {
      alert("User data not loaded");
      return;
    }

    try {
      const profileDetails = {
        ...(height ? { height: parseInt(height) } : {}),
        zodiac: zodiac || "",
        intention: intention,
        // Сюди в майбутньому просто допишеш smoking: "no" і т.д.
        // І тобі НЕ треба буде міняти users.ts!
      };
      await updateUserProfile({
        _id: user._id,
        firstName,
        bio,
        photoUrl: photoUrl || undefined,
        details: profileDetails,

        // TypeScript підхопить типи з Convex
      });

      await updatePreferences({
        intention,
      });

      alert("Profile updated successfully!");
      router.back();
    } catch (error) {
      console.error("Save failed:", error);
      alert(
        `Could not update profile: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text style={styles.headerTitle}>Edit Profile</Text>

        <View style={styles.photoSection}>
          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.8}
            style={styles.avatarWrapper}
          >
            {photoUrl ? (
              <Image source={{ uri: photoUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.placeholderAvatar]}>
                <Ionicons name="camera" size={32} color={Colors.secondary} />
              </View>
            )}
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={14} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={styles.photoHint}>Tap to change profile picture</Text>
        </View>

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

        <View style={styles.rowInputs}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              placeholder="175"
              keyboardType="numeric"
            />
          </View>
          <View style={{ width: 15 }} />
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Zodiac</Text>
            <TextInput
              style={styles.input}
              value={zodiac}
              onChangeText={setZodiac}
              placeholder="Leo"
            />
          </View>
        </View>

        <AppButton
          title="Save Changes"
          onPress={handleSave}
          loading={isSaving}
        />

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
  photoSection: { alignItems: "center", marginBottom: 30 },
  avatarWrapper: { position: "relative" },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  placeholderAvatar: {
    backgroundColor: Colors.inputBack,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  editBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: Colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  photoHint: {
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 8,
    fontWeight: "500",
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
  rowInputs: { flexDirection: "row" },
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
