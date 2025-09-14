import { Tabs } from "expo-router";
import { Trees, Flower2, Users, Scissors } from "lucide-react-native";
import React from "react";
import { Colors } from "../constants";
import { UserProvider } from "../contexts";

export default function TabLayout() {
  return (
    <UserProvider>
      <Tabs
        screenOptions={{
          headerShown: true,
          tabBarStyle: {
            backgroundColor: Colors.cardBackground,
            borderTopWidth: 0,
            elevation: 8,
            shadowColor: Colors.shadow.color,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
          },
          headerStyle: {
            backgroundColor: Colors.cardBackground,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitleStyle: {
            fontWeight: "bold" as const,
            fontSize: 20,
          },
        }}
      >
        <Tabs.Screen
          name="garden"
          options={{
            title: "Garden",
            headerTintColor: Colors.garden.primary,
            tabBarActiveTintColor: Colors.garden.primary,
            tabBarInactiveTintColor: Colors.text.secondary,
            tabBarIcon: ({ color }) => <Trees size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="blooming"
          options={{
            title: "Blooming",
            headerTintColor: Colors.blooming.primary,
            tabBarActiveTintColor: Colors.blooming.primary,
            tabBarInactiveTintColor: Colors.text.secondary,
            tabBarIcon: ({ color }) => <Flower2 size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="pruning"
          options={{
            title: "Pruning",
            headerTintColor: Colors.pruning.primary,
            tabBarActiveTintColor: Colors.pruning.primary,
            tabBarInactiveTintColor: Colors.text.secondary,
            tabBarIcon: ({ color }) => <Scissors size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="friends-feed"
          options={{
            title: "Friends Feed",
            headerTintColor: Colors.garden.primary,
            tabBarActiveTintColor: Colors.garden.primary,
            tabBarInactiveTintColor: Colors.text.secondary,
            tabBarIcon: ({ color }) => <Users size={24} color={color} />,
          }}
        />
      </Tabs>
    </UserProvider>
  );
}
