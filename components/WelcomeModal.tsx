import { Modal, View, Text, StyleSheet, ScrollView } from "react-native";
import { Colors } from "@/constants/Colors";
import AppButton from "./AppButton";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "convex/react";

interface WelcomeModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function WelcomeModal({
  isVisible,
  onClose,
}: WelcomeModalProps) {
  const { user } = useAuth();
  const markSeen = useMutation(api.users.markWelcomeAsSeen);

  const handlePress = async () => {
    if (user?.id) {
      try {
        // 1. Повідомляємо базу даних, що юзер бачив модалку
        await markSeen({ id: user.id });
      } catch (error) {
        console.error("Failed to mark welcome as seen:", error);
      }
    }
    // 2. Закриваємо модалку на екрані (викликаємо функцію з пропсів)
    onClose();
  };
  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.emoji}>✨</Text>
            <Text style={styles.title}>Welcome to our Community!</Text>

            <Text style={styles.text}>
              We are thrilled to have you here. We wish you the best of luck in
              finding your perfect match!
            </Text>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>🚀 Getting Started</Text>
              <Text style={styles.text}>
                You can already start using filters, swipes, and messaging.
                However, to be{" "}
                <Text style={styles.bold}>visible to others in swipes</Text>,
                you must upload a photo and fill in some info. Detailed profiles
                get much more attention!
              </Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>💎 Serious Intentions</Text>
              <Text style={styles.text}>
                Looking for something real? Complete our{" "}
                <Text style={styles.bold}>15-question survey</Text> to unlock
                access to other serious users, see compatibility statistics, and
                view their answers.
              </Text>
            </View>

            <AppButton
              title="Got it, let's explore!"
              variant="pink"
              onPress={handlePress}
              style={{ marginTop: 20 }}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderRadius: 32,
    maxHeight: "80%",
    overflow: "hidden",
  },
  scrollContent: {
    padding: 24,
    alignItems: "center",
  },
  emoji: { fontSize: 40, marginBottom: 10 },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.textMain,
    textAlign: "center",
    marginBottom: 15,
    fontFamily: "Raleway",
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textLight,
    textAlign: "center",
    marginBottom: 15,
  },
  infoSection: {
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 20,
    width: "100%",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textMain,
    marginBottom: 8,
  },
  bold: {
    fontWeight: "700",
    color: Colors.secondary,
  },
});
