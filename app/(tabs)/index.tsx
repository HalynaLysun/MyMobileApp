import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient"; // Найкраще для фону "захід сонця" [cite: 2026-01-14]
import { Ionicons } from "@expo/vector-icons";

import AppButton from "@/components/AppButton";
import { Colors } from "@/constants/Colors";

export default function FiltersScreen() {
  const insets = useSafeAreaInsets(); // Отримуємо точні відступи системи [cite: 2026-01-24]
  const [gender, setGender] = useState<"male" | "female" | "all">("all");

  return (
    <View style={styles.container}>
      {/* М'який градієнт фону замість статичного кольору [cite: 2026-01-14] */}
      <LinearGradient
        colors={["#FCE4EC", "#E3F2FD"]} // Від ніжно-блакитного до світло-рожевого [cite: 2026-01-24]
        locations={[0.1, 1]}
        start={{ x: 1, y: 0.5 }} // Початок справа (середина по вертикалі) [cite: 2026-01-24]
        end={{ x: 0, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
        ]}
      >
        <Text style={styles.headerTitle}>Find your match...</Text>

        {/* Картка з використанням Glassmorphism ефекту */}
        <View style={styles.card}>
          <Text style={styles.label}>Gender</Text>

          <View style={styles.genderRow}>
            <AppButton
              title="Male"
              variant="white"
              isActive={gender === "male"}
              onPress={() => setGender("male")}
              style={styles.flexButton}
              icon={
                <Ionicons
                  name="male"
                  size={20}
                  color={gender === "male" ? Colors.white : Colors.primary}
                />
              }
              textSize={14}
            />

            <AppButton
              title="Female"
              variant="white"
              isActive={gender === "female"}
              onPress={() => setGender("female")}
              style={[styles.flexButton, { marginHorizontal: 6 }]}
              icon={
                <Ionicons
                  name="female"
                  size={20}
                  color={gender === "female" ? Colors.white : Colors.secondary}
                />
              }
              textSize={14}
            />

            <AppButton
              title="All"
              variant="white"
              isActive={gender === "all"}
              onPress={() => setGender("all")}
              style={styles.flexButton}
              icon={
                // <FontAwesomeIcon icon={fas.faHouse} />
                <Ionicons
                  name="people-outline"
                  size={22}
                  color={gender === "all" ? Colors.white : Colors.textLight}
                />
              }
              textSize={14}
            />
          </View>

          {/* Місце для майбутніх слайдерів [cite: 2026-01-14] */}
          <View style={styles.placeholder} />
        </View>

        <AppButton
          title="Save & Search"
          variant="pink"
          onPress={() => console.log("Search pressed")}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "sans-serif-condensed",
    color: "#1A1F36",
    marginBottom: 24,
    elevation: 4,
    letterSpacing: -0.5,
  },
  card: {
    backgroundColor: Colors.white, // Напівпрозорість для ефекту скла [cite: 2026-01-14]
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
    // Покращені тіні [cite: 2026-01-24]
    shadowColor: "#000",
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
    gap: 6,
  },
  flexButton: {
    flex: 1,
    height: 46, // Оптимальна висота для тач-зони [cite: 2026-01-14]
  },
  placeholder: {
    height: 120, // Простір під слайдери [cite: 2026-01-24]
  },
});

// import { Colors } from "@/constants/Colors";
// import React, { useState } from "react";
// import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
// import ScreenContainer from "@/components/ScreenContainer";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import AppButton from "@/components/AppButton";

// export default function FiltersScreen() {
//   // Створюємо стан для вибору статі [cite: 2026-01-24]
//   const [gender, setGender] = useState("woman");

//   return (
//     <ScreenContainer>
//       <Text style={styles.header}>Find your match...</Text>

//       <View style={styles.card}>
//         <Text style={styles.label}>Gender</Text>

//         <View style={styles.buttonGroup}>
//           {/* Кнопка "Woman" [cite: 2026-01-24] */}
//           <AppButton
//             title="Woman"
//             isActive={gender === "woman"}
//             variant="secondary"
//             icon={
//               <MaterialCommunityIcons
//                 name="face-woman-shimmer"
//                 size={30}
//                 color={gender === "woman" ? Colors.secondary : Colors.white}
//               />
//             }
//             onPress={() => setGender("woman")}
//           >
//             {/* <Text
//               style={[
//                 styles.optionText,
//                 gender === "woman" && styles.selectedText,
//               ]}
//             >
//               Woman
//             </Text> */}
//           </AppButton>

//           {/* Кнопка "Man" [cite: 2026-01-24] */}
//           <TouchableOpacity
//             style={[styles.option, gender === "man" && styles.selectedOption]}
//             onPress={() => setGender("man")}
//           >
//             <MaterialCommunityIcons
//               name="face-man-shimmer"
//               size={30}
//               color={gender === "man" ? Colors.white : Colors.primary}
//             />
//             {/* <Text
//               style={[
//                 styles.optionText,
//                 gender === "man" && styles.selectedText,
//               ]}
//             >
//               Man
//             </Text> */}
//           </TouchableOpacity>

//           {/* Кнопка "Both" [cite: 2026-01-24] */}
//           <TouchableOpacity
//             style={[styles.option, gender === "both" && styles.selectedOption]}
//             onPress={() => setGender("both")}
//           >
//             <Ionicons
//               name="people-outline"
//               size={30}
//               fontWeight="bold"
//               color={gender === "both" ? Colors.white : Colors.textMain}
//             />
//             {/* <Text
//               style={[
//                 styles.optionText,
//                 gender === "both" && styles.selectedText,
//               ]}
//             >
//               Both
//             </Text> */}
//           </TouchableOpacity>
//         </View>
//       </View>

//       <AppButton
//         title="Save & Search"
//         variant="primary"
//         onPress={() => console.log("Searching...")}
//       />
//     </ScreenContainer>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: Colors.textMain,
//     marginBottom: 20,
//   },
//   card: {
//     backgroundColor: Colors.white,
//     padding: 20,
//     borderRadius: 20,
//     shadowColor: Colors.shadow,
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   label: {
//     fontSize: 16,
//     color: Colors.textMain,
//     marginBottom: 15,
//     fontWeight: "600",
//   },
//   buttonGroup: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 10,
//   },
//   option: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 13,
//     borderWidth: 1,
//     borderColor: Colors.background, // Блакитний контур [cite: 2026-01-24]
//     alignItems: "center",
//   },
//   selectedOption: {
//     backgroundColor: Colors.primary, // Активний блакитний колір [cite: 2026-01-24]
//     borderColor: Colors.primary,
//   },
//   optionText: {
//     color: Colors.primary,
//     fontWeight: "bold",
//   },
//   selectedText: {
//     color: Colors.white,
//   },
//   applyButton: {
//     backgroundColor: Colors.secondary, // Рожева кнопка дії [cite: 2026-01-14]
//     paddingVertical: 18,
//     borderRadius: 30,
//     marginTop: "auto",
//     marginBottom: 20,
//     alignItems: "center",
//   },
//   applyButtonText: {
//     color: Colors.white,
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });
