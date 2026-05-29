import { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/context/AuthContext";
import ScreenContainer from "@/components/ScreenContainer";
import AppButton from "@/components/AppButton";
import { Colors } from "@/constants/Colors";
import calculateMatchPercentage from "@/utils/matchsLogic";
import { TestAnswersMap } from "@/types/user";
import { Doc } from "@/convex/_generated/dataModel";
import { useRouter } from "expo-router";

type MatchItem = Doc<"users"> & {
  matchPercent: number;
};

type GenderFilter = "all" | "male" | "female";

export default function MatchesScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");

  // Отримуємо всіх користувачів, крім поточного
  const allUsers = useQuery(api.matchs.getOtherUsers, { userId: user?._id });

  // Розраховуємо матчі та сортуємо їх
  const processedMatches = useMemo(() => {
    if (!allUsers || !user) return [];

    // Ми беремо те, що повернув Convex, і просто додаємо matchPercent
    return allUsers
      .map((otherUser): MatchItem => {
        const matchPercent = calculateMatchPercentage(
          user.testAnswers as TestAnswersMap,
          otherUser.testAnswers as TestAnswersMap,
        );

        return {
          ...otherUser,
          matchPercent,
        };
      })
      .sort((a: MatchItem, b: MatchItem) => b.matchPercent - a.matchPercent);
  }, [allUsers, user]);

  // // Розділяємо на "високі" та "низькі" матчі
  // const highMatches = processedMatches.filter(
  //   (m: MatchItem) => m.matchPercent >= 50,
  // );
  // const lowMatches = processedMatches.filter(
  //   (m: MatchItem) => m.matchPercent < 50,
  // );

  const displayData = useMemo(() => {
    return processedMatches.filter(
      (otherUser: MatchItem & { userGender?: string }) => {
        // 1. Фільтр за статтю (якщо обрано не "all" і стать не збігається — ховаємо)
        if (genderFilter !== "all" && otherUser.userGender !== genderFilter) {
          return false;
        }

        // 2. Фільтр за відсотками сумісності (ховаємо низькі матчі, якщо не натиснуто "Show All")
        if (!showAll && otherUser.matchPercent < 50) {
          return false;
        }

        return true;
      },
    );
  }, [processedMatches, showAll, genderFilter]);

  const lowMatchesCount = useMemo(() => {
    return processedMatches.filter(
      (otherUser: MatchItem & { userGender?: string }) => {
        if (genderFilter !== "all" && otherUser.userGender !== genderFilter)
          return false;
        return otherUser.matchPercent < 50;
      },
    ).length;
  }, [processedMatches, genderFilter]);

  const handleUserPress = (otherUserId: string) => {
    if (!user?._id) {
      alert("Error: You must be logged in to chat.");
      return;
    }

    const chatId = [user._id, otherUserId].sort().join("_");
    router.push(`/chat/${chatId}`);
  };

  const renderUserCard = ({ item }: { item: MatchItem }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => handleUserPress(item._id)}
    >
      <Image
        source={{
          uri:
            item.photoUrl ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.firstName}`,
        }}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.name}>
          {item.firstName}, {item.age}
        </Text>
        <Text style={styles.city}>{item.city}</Text>
        <View style={styles.matchBadge}>
          <Text style={styles.matchText}>{item.matchPercent}% Match</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer withScroll={false}>
      <FlatList
        data={displayData}
        keyExtractor={(item) => item._id}
        renderItem={renderUserCard}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Your Matches</Text>
            <Text style={styles.subtitle}>
              {showAll ? "Showing all users" : "Top matches for you"}
            </Text>
            <View style={styles.filterContainer}>
              <View style={styles.filterButtonWrapper}>
                <AppButton
                  title="All"
                  variant={genderFilter === "all" ? "pink" : "white"} // 👈 Якщо обрано — рожева, ні — контурна
                  onPress={() => setGenderFilter("all")}
                />
              </View>

              <View style={styles.filterButtonWrapper}>
                <AppButton
                  title="Men"
                  variant={genderFilter === "male" ? "pink" : "white"}
                  onPress={() => setGenderFilter("male")}
                />
              </View>

              <View style={styles.filterButtonWrapper}>
                <AppButton
                  title="Women"
                  variant={genderFilter === "female" ? "pink" : "white"}
                  onPress={() => setGenderFilter("female")}
                />
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No good matches found for this filter.
          </Text>
        }
        ListFooterComponent={
          !showAll && lowMatchesCount > 0 ? (
            <View style={styles.footer}>
              <Text style={styles.footerNote}>
                There are {lowMatchesCount} more users with lower match rates.
              </Text>
              <AppButton
                title="Show All Users"
                variant="pink"
                onPress={() => setShowAll(true)}
              />
            </View>
          ) : null
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: Colors.textMain },
  subtitle: { fontSize: 16, color: Colors.textLight },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8, // Невеликий відступ між кнопками
    marginTop: 5,
  },
  // Обгортка для кожної кнопки, щоб вони ділили екран порівну
  filterButtonWrapper: {
    flex: 1,
  },
  list: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    // Тінь для карток
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f0f0",
  },
  info: { marginLeft: 15, flex: 1 },
  name: { fontSize: 20, fontWeight: "bold", color: Colors.textMain },
  city: { fontSize: 14, color: Colors.textLight, marginBottom: 5 },
  matchBadge: {
    backgroundColor: Colors.inputBack,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  matchText: { color: Colors.linkPink, fontWeight: "bold", fontSize: 14 },
  emptyText: { textAlign: "center", marginTop: 50, color: Colors.textLight },
  footer: { marginTop: 20, alignItems: "center" },
  footerNote: { marginBottom: 15, color: Colors.textLight, fontSize: 14 },
});
