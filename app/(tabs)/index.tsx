import AppButton from "@/components/AppButton";
import ScreenContainer from "@/components/ScreenContainer";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { IconDefinition, library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { DEFAULT_USER_PREFERENCES, Intention } from "@/types/user";
import WelcomeModal from "@/components/WelcomeModal";
import { INTENTIONS } from "@/constants/IntentionOptions";

const iconList = Object.values(fas) as IconDefinition[];

library.add(...iconList);

export default function FiltersScreen() {
  const { user, updatePreferences, isSaving } = useAuth();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  const [closedLocally, setClosedLocally] = useState(false);

  const { preferences } = useAuth(); // Беремо вже готові преференси з контексту
  const { gender, distance, ageRange, intention } = preferences;

  // const { newUser } = useLocalSearchParams();

  // const update = useMutation(api.users.updateFilters);

  const handleSave = async () => {
    if (!user) {
      alert("Error: User not found");
      return;
    }

    try {
      await updatePreferences({
        gender: gender,
        distance: distance,
        ageRange: ageRange,
        intention: intention,
      });
    } catch (error) {
      alert("Error saving settings");
      console.log(error);
    }
  };

  // Запит виконається ТІЛЬКИ якщо user та user.id існують
  const userData = useQuery(
    api.users.getUser,
    user?._id ? { _id: user._id } : "skip",
  );

  const hasCompletedTest = userData?.isTestPassed === true;

  useEffect(() => {
    // 1. Перевіряємо, чи прийшли дані і чи ми їх ще не завантажували
    if (userData && !isLoaded) {
      setIsLoaded(true);
      // 2. Безпечно дістаємо фільтри з userData (якщо їх немає, беремо дефолтні)
      const userFilters = userData.filters || DEFAULT_USER_PREFERENCES;

      updatePreferences({
        gender: userFilters.gender,
        distance: userFilters.distance,
        // Використовуємо явне приведення до кортежу [number, number]
        ageRange: [
          userFilters.ageRange?.[0] ?? DEFAULT_USER_PREFERENCES.ageRange[0],
          userFilters.ageRange?.[1] ?? DEFAULT_USER_PREFERENCES.ageRange[1],
        ] as [number, number],
        intention: userFilters.intention,
      });
    }
  }, [userData, isLoaded, updatePreferences]);

  const isModalVisible =
    userData && userData.hasSeenWelcome === false && !closedLocally;

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
              max={90}
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
            <Text style={styles.subLabel}>90</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Match Intentions</Text>
        <View style={styles.tagWrapper}>
          {INTENTIONS.map((item) => (
            <AppButton
              key={item._id}
              title={item.label}
              variant="white"
              isActive={intention === item._id}
              onPress={() => {
                if (item._id === "serious relationship") {
                  // ЯКЩО ТЕСТ НЕ ПРОЙДЕНО — на питання
                  // ЯКЩО ПРОЙДЕНО — просто ставимо інтенцію
                  if (!hasCompletedTest) {
                    router.push("/questions");
                  } else {
                    updatePreferences({ intention: "serious relationship" });
                  }
                } else {
                  updatePreferences({ intention: item._id as Intention });
                }
              }}
              style={styles.tagButton}
              textSize={10}
              icon={
                <Ionicons
                  name={item.filterIcon as any}
                  size={16}
                  style={{ marginRight: 2 }}
                  color={
                    intention === item._id ? Colors.white : Colors.secondary
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
            alert("We couldn't save your filters, but you can still browse.");
            console.error(err);
          });
        }}
      />
      <AppButton
        title="More Options"
        variant="pink"
        loading={isSaving}
        onPress={() => {
          router.push("/more-filters"); // Миттєво йдемо далі

          handleSave().catch((err) => {
            // Якщо фонове збереження не вдалося, показуємо Toast або Alert
            alert("We couldn't save your filters, but you can still browse.");
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
