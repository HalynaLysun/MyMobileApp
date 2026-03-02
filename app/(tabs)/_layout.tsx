import { Tabs } from "expo-router";
import React from "react";
import {
  MaterialCommunityIcons,
  Ionicons,
  Fontisto,
  FontAwesome6,
} from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: Colors.primary,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: "#ffffff",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Filters",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-filter"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="swipes"
        options={{
          title: "Dating",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flame" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          tabBarIcon: ({ color, size }) => (
            <Fontisto name="hipchat" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: "Matches",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="heart-circle-check" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-sharp" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
