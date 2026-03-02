import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Colors } from "../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  children: React.ReactNode;
}

export default function ScreenContainer({ children }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background, // Твій світло-блакитний фон [cite: 2026-01-24]
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20, // Відступи з боків [cite: 2026-01-24]
    paddingTop: 20, // Відступ зверху [cite: 2026-01-24]
  },
});
