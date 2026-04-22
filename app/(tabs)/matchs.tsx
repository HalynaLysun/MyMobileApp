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

type MatchItem = Doc<"users"> & {
  matchPercent: number;
};

export default function MatchesScreen() {
  const { user } = useAuth();
  const [showAll, setShowAll] = useState(false);

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

  // Розділяємо на "високі" та "низькі" матчі
  const highMatches = processedMatches.filter(
    (m: MatchItem) => m.matchPercent >= 50,
  );
  const lowMatches = processedMatches.filter(
    (m: MatchItem) => m.matchPercent < 50,
  );

  const displayData = showAll ? processedMatches : highMatches;

  const renderUserCard = ({ item }: { item: MatchItem }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.9}>
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
      <View style={styles.header}>
        <Text style={styles.title}>Your Matches</Text>
        <Text style={styles.subtitle}>
          {showAll ? "Showing all users" : "Top matches for you"}
        </Text>
      </View>

      <FlatList
        data={displayData}
        keyExtractor={(item) => item._id}
        renderItem={renderUserCard}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No matches found yet.</Text>
        }
        ListFooterComponent={
          !showAll && lowMatches.length > 0 ? (
            <View style={styles.footer}>
              <Text style={styles.footerNote}>
                There are {lowMatches.length} more users with lower match rates.
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
  list: { paddingBottom: 40 },
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
