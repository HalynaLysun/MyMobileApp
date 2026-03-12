import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // Використовуємо хук

interface Props {
  children: React.ReactNode;
  withScroll?: boolean; // Додаємо вибір: скролити чи ні
}

export default function ScreenContainer({
  children,
  withScroll = true,
}: Props) {
  const insets = useSafeAreaInsets(); // Отримуємо динамічні відступи

  const containerStyle = [
    styles.content,
    {
      paddingTop: insets.top, // Гнучко додаємо відступ зверху
      paddingBottom: insets.bottom, // Гнучко додаємо відступ знизу
    },
  ];

  if (!withScroll) {
    return <View style={containerStyle}>{children}</View>;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      // Щоб скрол не заходив під нижню панель
      style={{ flex: 1 }}
    >
      <View style={containerStyle}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
