import AppButton from "@/components/AppButton";
import ScreenContainer from "@/components/ScreenContainer";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { IconDefinition, library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useRouter } from "expo-router";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { DEFAULT_USER_PREFERENCES, Intention } from "@/types/user";
import WelcomeModal from "@/components/WelcomeModal";

const iconList = Object.values(fas) as IconDefinition[];

library.add(...iconList);

export default function FiltersScreen() {
  const { user, updatePreferences } = useAuth();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { gender, distance, ageRange, intention } =
    user || DEFAULT_USER_PREFERENCES;
  const [closedLocally, setClosedLocally] = useState(false);

  // const { newUser } = useLocalSearchParams();

  const update = useMutation(api.users.updateFilters);

  const handleSave = async () => {
    if (!user) {
      alert("Error: User not found");
      return;
    }
    setIsSaving(true);
    try {
      await update({
        id: user?.id,
        gender: user.gender,
        distance: user.distance,
        ageRange: user.ageRange,
        intention: user.intention,
      });
    } catch (error) {
      alert("Error saving settings");
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Запит виконається ТІЛЬКИ якщо user та user.id існують
  const userData = useQuery(
    api.users.getUser,
    user?.id ? { id: user.id } : "skip",
  );

  const isModalVisible =
    userData && userData.hasSeenWelcome === false && !closedLocally;

  useEffect(() => {
    // 2. Якщо дані прийшли з бази — записуємо їх у наш локальний стан (state)
    if (userData && !isLoaded) {
      updatePreferences({
        gender: userData.gender,
        distance: userData.distance,
        ageRange: [userData.ageRange[0], userData.ageRange[1]],
        intention: userData.intention,
      });
    }
    setIsLoaded(true);
  }, [userData, isLoaded, updatePreferences]);

  return (
    <ScreenContainer withScroll={true}>
      <Text style={styles.headerTitle}>Find your match...</Text>

      {/* Картка з використанням Glassmorphism ефекту */}
      <View style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderRow}>
            <AppButton
              title="Male"
              variant="white"
              isActive={gender === "male"}
              onPress={() => updatePreferences({ gender: "male" })}
              style={styles.flexButton}
              icon={
                <Text style={{ fontSize: 20 }}>♂️</Text>
                // <Ionicons
                //   name="male"
                //   size={18}
                //   color={gender === "male" ? Colors.white : Colors.primary}
                // />
              }
              textSize={14}
            />

            <AppButton
              title="Female"
              variant="white"
              isActive={gender === "female"}
              onPress={() => updatePreferences({ gender: "female" })}
              style={[styles.flexButton, { marginHorizontal: 6 }]}
              icon={
                <Text style={{ fontSize: 20 }}>♀️</Text>
                // <Ionicons
                //   name="female"
                //   size={18}
                //   color={gender === "female" ? Colors.white : Colors.secondary}
                // />
              }
              textSize={14}
            />

            <AppButton
              title="All"
              variant="white"
              isActive={gender === "all"}
              onPress={() => updatePreferences({ gender: "all" })}
              style={styles.flexButton}
              icon={
                <Text style={{ fontSize: 20 }}>⚧️</Text>
                // <FontAwesomeIcon
                //   icon={["fas", "users"]}
                //   color={gender === "all" ? Colors.white : "#2140ed"}
                // />

                // <Ionicons
                //   name="people-outline"
                //   size={22}
                //   color={gender === "all" ? Colors.white : Colors.textLight}
                // />
              }
              textSize={14}
            />
          </View>
        </View>

        {/* Секція для вибору дистанції з слайдером [cite: 2026-01-24] */}
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text style={styles.sectionLabel}>Distance</Text>
            <Text style={styles.valueText}>{distance} km</Text>
          </View>

          <View style={styles.sliderWrapper}>
            <MultiSlider
              values={[distance]} // Очікує масив
              sliderLength={250} // Підбери ширину під свій екран
              onValuesChange={(v) => updatePreferences({ distance: v[0] })}
              min={10}
              max={100}
              step={1}
              // Стилізація лінії (Track)
              trackStyle={{ height: 8, borderRadius: 3 }}
              selectedStyle={{ backgroundColor: Colors.secondary }} // Заповнена частина
              unselectedStyle={{ backgroundColor: Colors.inputBorder }} // Порожня частина
              // Стилізація твого кружечка (Marker)
              customMarker={() => <View style={styles.customMarkerStyle} />}
            />
          </View>

          <View style={styles.labelRow}>
            <Text style={styles.subLabel}>10 km</Text>
            <Text style={styles.subLabel}>100 km</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text style={styles.sectionLabel}>Age</Text>
            {/* Тут ми виводимо обидва значення з масиву */}
            <Text style={styles.valueText}>
              {ageRange[0]} - {ageRange[1]}
            </Text>
          </View>

          <View style={styles.sliderWrapper}>
            <MultiSlider
              values={[ageRange[0], ageRange[1]]} // Передаємо масив із двох точок
              sliderLength={250} // Така ж довжина, як у дистанції
              onValuesChange={(v) =>
                updatePreferences({ ageRange: [v[0], v[1]] })
              } // Оновлюємо весь масив [min, max]
              min={18}
              max={60}
              step={1}
              allowOverlap={false} // Щоб бігунці не "наїжджали" один на одного
              snapped={true} // Приємне "магнітне" клацання по числах
              trackStyle={{ height: 8, borderRadius: 3 }}
              selectedStyle={{ backgroundColor: Colors.secondary }}
              unselectedStyle={{ backgroundColor: Colors.inputBorder }}
              // Використовуємо твій кастомний маркер (той самий стиль)
              customMarker={() => <View style={styles.customMarkerStyle} />}
            />
          </View>

          <View style={styles.labelRow}>
            <Text style={styles.subLabel}>18</Text>
            <Text style={styles.subLabel}>60</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Match Intentions</Text>
        <View style={styles.tagWrapper}>
          {[
            {
              id: "chatting",
              icon: "chatbubble-ellipses",
              label: "Just chatting",
            },
            {
              id: "serious relationship",
              icon: "heart-circle",
              label: "Serious relationship",
            },
            { id: "casual dating", icon: "wine", label: "Casual dating" },
            { id: "friendship", icon: "hand-left", label: "Friendship" },
          ].map((item) => (
            <AppButton
              key={item.id}
              title={item.label}
              variant="white"
              isActive={intention === item.id}
              onPress={() =>
                updatePreferences({ intention: item.id as Intention })
              }
              style={styles.tagButton}
              textSize={10}
              icon={
                <Ionicons
                  name={item.icon as any}
                  size={16}
                  style={{ marginRight: 2 }}
                  color={
                    intention === item.id ? Colors.white : Colors.secondary
                  }
                />
              }
            />
          ))}
        </View>
      </View>

      <AppButton
        title="Save & Search"
        variant="pink"
        loading={isSaving}
        onPress={() => {
          router.push("/swipes"); // Миттєво йдемо далі

          handleSave().catch((err) => {
            // Якщо фонове збереження не вдалося, показуємо Toast або Alert
            Alert.alert(
              "Error",
              "We couldn't save your filters, but you can still browse.",
            );
            console.error(err);
          });
        }}
      />
      <WelcomeModal
        isVisible={!!isModalVisible}
        onClose={() => setClosedLocally(true)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontFamily: "Raleway",
    fontSize: 28,
    color: Colors.textMain,
    marginBottom: 24,
    elevation: 4,
    letterSpacing: -0.5,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    textTransform: "uppercase",
    color: Colors.textLight,
    marginBottom: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  genderRow: {
    flexDirection: "row",
    width: "100%",
    gap: 4,
  },
  flexButton: {
    flex: 1,
    minWidth: 80,
    height: 46,
  },
  section: {
    marginBottom: 10,
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  sectionLabel: {
    fontFamily: "Raleway",
    fontSize: 16,
    color: Colors.textLight,
  },
  valueText: {
    fontSize: 16,
    fontFamily: "Raleway",
    color: Colors.secondary,
  },
  sliderWrapper: {
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    marginVertical: 10,
  },
  customMarkerStyle: {
    height: 24,
    width: 24,
    borderRadius: 13,
    backgroundColor: Colors.secondary,
    borderWidth: 6,
    borderColor: Colors.white,
    marginLeft: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  subLabel: {
    fontSize: 12,
    fontFamily: "Raleway",
    color: Colors.textLight,
  },
  tagWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
    // Переконайся, що тут НЕМАЄ alignItems: "stretch"
    alignItems: "center",
    justifyContent: "space-between",
  },
  tagButton: {
    flex: 0,
    width: "auto",
    alignSelf: "flex-start",
    height: 30,
    minWidth: 100,
    paddingHorizontal: 4,
    flexShrink: 1,
  },
});
