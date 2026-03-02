import { View, Text, Image, Dimensions, StyleSheet } from "react-native";
import React from "react";
import { UserProfile } from "@/types/user";
import { Colors } from "@/constants/Colors";
import ScreenContainer from "@/components/ScreenContainer";

const USER_DATA: UserProfile = {
  id: "1",
  firstName: "Julia",
  age: 24,
  bio: "I'm a travel enthusiast who loves exploring new cultures and cuisines.Always up for an adventure and looking for someone to share it with!",
  photoUrl:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=600&auto=format&fit=crop",
};

const { width } = Dimensions.get("window");

const Swipes = () => {
  return (
    <ScreenContainer>
      <View style={styles.card}>
        <Image
          source={{
            uri: USER_DATA.photoUrl,
          }}
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.name}>
            {USER_DATA.firstName}, {USER_DATA.age}
          </Text>
          <Text style={styles.bio}>{USER_DATA.bio}</Text>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 550,
    maxWidth: 400,
    borderRadius: 25,
    backgroundColor: Colors.white,
    overflow: "hidden",
    elevation: 8,
    shadowColor: Colors.shadow,
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
    color: Colors.textMain,
  },
  bio: {
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 8,
    lineHeight: 22,
  },
});

export default Swipes;
