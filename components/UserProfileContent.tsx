import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { UserProfile } from "@/types/user";
import { INTENTIONS } from "@/constants/IntentionOptions";

interface UserProfileContentProps {
  user: UserProfile | null; // Тепер ми використовуємо твій глобальний тип
}

export default function UserProfileContent({ user }: UserProfileContentProps) {
  // const isSerious = user?.intention === "serious relationship";

  const intentionData =
    INTENTIONS.find((i) => i._id === user?.intention) || INTENTIONS[2]; // дефолт chatting

  return (
    <View style={styles.container}>
      {/* Avatar & Basic Info */}
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstName || user?.email}`,
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.firstName || "New Member"}</Text>

        {user?.isTestPassed && (
          <View style={styles.verifiedBadge}>
            <Ionicons
              name="shield-checkmark"
              size={18}
              color={Colors.primary}
            />
            <Text style={styles.verifiedText}>Trust Score: High</Text>
          </View>
        )}
      </View>

      {/* Goal / Intention Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Dating Goal</Text>
        <View style={styles.row}>
          <Ionicons
            name={intentionData.profileIcon}
            size={22}
            color={intentionData.color}
          />
          <Text style={styles.cardValue}>{intentionData.label}</Text>
        </View>
      </View>

      {/* About Me Section */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>About Me</Text>
        <Text style={styles.bioText}>
          {user?.bio ||
            "No bio added yet. Tell people something interesting about yourself!"}
        </Text>
      </View>

      {/* Languages (якщо є в схемі)
      {user?.languages && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Languages</Text>
          <View style={styles.tagContainer}>
            {user.languages.map((lang, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{lang}</Text>
              </View>
            ))}
          </View>
        </View>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  avatarContainer: { alignItems: "center", marginBottom: 30, marginTop: 10 },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: Colors.inputBack,
    borderWidth: 4,
    borderColor: Colors.white,
  },
  name: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: 12,
    color: Colors.textMain,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    backgroundColor: Colors.inputBack,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: "700",
    marginLeft: 4,
  },
  card: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  cardLabel: {
    fontSize: 12,
    color: Colors.textLight,
    textTransform: "uppercase",
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.textMain,
    marginLeft: 10,
  },
  bioText: { fontSize: 15, lineHeight: 22, color: Colors.textLight },
  row: { flexDirection: "row", alignItems: "center" },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 5,
  },
  tag: {
    backgroundColor: Colors.inputBack,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  tagText: { fontSize: 14, color: Colors.textMain, fontWeight: "500" },
});
