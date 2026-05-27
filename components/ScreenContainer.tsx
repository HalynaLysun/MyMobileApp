import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";

interface Props {
  children: React.ReactNode;
  withScroll?: boolean; // Додаємо вибір: скролити чи ні
}

export default function ScreenContainer({
  children,
  withScroll = true,
}: Props) {
  const insets = useSafeAreaInsets(); // Отримуємо динамічні відступи

  const renderContent = () => {
    // const containerStyle = [
    //   styles.content,
    //   {
    //     paddingTop: insets.top,
    //     paddingBottom: insets.bottom,
    //   },
    // ];
    const edgeInsets = {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    };
    if (!withScroll) {
      return <View style={[{ flex: 1 }, edgeInsets]}>{children}</View>;
    }

    return (
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={{ flex: 1 }}
      >
        <View style={[styles.content, edgeInsets]}>{children}</View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Градієнт завжди на фоні */}
      <LinearGradient
        colors={[Colors.white, "#E3F2FD"]}
        style={styles.gradientBackground}
        locations={[0.1, 1]}
        start={{ x: 1, y: 0.5 }}
        end={{ x: 0, y: 0.3 }}
      />

      {/* ВИКЛИКАЄМО ФУНКЦІЮ ТУТ: */}
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },
});
