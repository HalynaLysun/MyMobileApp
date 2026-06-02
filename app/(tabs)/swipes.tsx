import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import ScreenContainer from "@/components/ScreenContainer";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import AppButton from "@/components/AppButton";
import { Id } from "@/convex/_generated/dataModel";

const { width } = Dimensions.get("window");

const Swipes = () => {
  const { user } = useAuth(); // Твій контекст з даними про тебе

  const [currentIndex, setCurrentIndex] = useState(0);

  const users = useQuery(
    api.users.getRandomUsers,
    user?._id ? { currentUserId: user?._id as Id<"users"> } : "skip",
  );

  const filtersString = JSON.stringify(user?.filters);

  useEffect(() => {
    // Кожного разу, коли список користувачів змінюється (наприклад, через фільтри),
    // ми повертаємося до першої картки.
    setCurrentIndex(0);
  }, [users?.length, filtersString]);

  if (users === undefined) {
    return (
      <ScreenContainer>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ marginTop: 10 }}>Searching for people...</Text>
        </View>
      </ScreenContainer>
    );
  }
  if (users.length === 0 || currentIndex >= users.length) {
    return (
      <ScreenContainer>
        <View style={styles.centered}>
          <Text style={styles.name}>No more people!</Text>
          <AppButton
            title="Refresh"
            onPress={() => setCurrentIndex(0)}
            style={{ width: 200, marginTop: 20 }}
          />
        </View>
      </ScreenContainer>
    );
  }

  const currentUser = users[currentIndex];

  if (users === undefined) return <ActivityIndicator />;
  return (
    <ScreenContainer>
      <View style={styles.centered}>
        <View style={styles.card}>
          <Image
            source={{
              uri: currentUser.photoUrl || "https://via.placeholder.com/400",
            }}
            style={styles.image}
          />
          <View style={styles.info}>
            <Text style={styles.name}>
              {currentUser.firstName}, {currentUser.age}
            </Text>
            {currentUser.city && (
              <Text style={styles.cityText}>{currentUser.city}</Text>
            )}
            <Text style={styles.bio} numberOfLines={3}>
              {currentUser.bio || "No bio yet..."}
            </Text>
          </View>
        </View>

        {/* Тимчасова кнопка, поки ми не зробили свайпи пальцем */}
        <AppButton
          title="Next Person"
          onPress={() => setCurrentIndex((prev) => prev + 1)}
          style={{ width: "80%", marginTop: 20 }}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "transparent", // Як ми обговорювали — не вплине на темну тему
  },
  card: {
    width: "100%",
    height: 550,
    maxWidth: 400,
    borderRadius: 25,
    backgroundColor: Colors.white,
    overflow: "hidden",
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
  },
  image: {
    width: "100%",
    height: "75%", // Фото займає більшу частину картки [cite: 2026-01-24]
    resizeMode: "cover",
  },
  info: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.textMain,
  },
  cityText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "600",
    marginBottom: 5,
  },
  bio: {
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 8,
    lineHeight: 22,
  },
});

export default Swipes;
