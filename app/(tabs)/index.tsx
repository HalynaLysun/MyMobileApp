import { Link } from "expo-router";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";

// Отримуємо ширину екрана, щоб картка була адаптивною [cite: 2026-01-24]
const { width } = Dimensions.get("window");

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=600&auto=format&fit=crop",
          }}
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.name}>Олена, 24</Text>
          <Text style={styles.bio}>
            Люблю подорожі, каву та React Native 🚀. Шукаю когось для спільного
            кодингу!
          </Text>
        </View>
      </View>
      <Link href="/about">Link to about section</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f2f5", // Світло-сірий фон [cite: 2026-01-24]
  },
  card: {
    width: width * 0.9, // 90% від ширини екрана [cite: 2026-01-24]
    height: 550,
    borderRadius: 25,
    backgroundColor: "white",
    overflow: "hidden",
    // Тіні для гарного вигляду (basically, як у Tinder) [cite: 2026-01-24]
    elevation: 8, // для Android [cite: 2026-01-24]
    shadowColor: "#000", // для iOS [cite: 2026-01-24]
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
    color: "#1a1a1a",
  },
  bio: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    lineHeight: 22,
  },
});
