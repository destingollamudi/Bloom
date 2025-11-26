import { Tabs } from "expo-router";
import { Trees, Flower2, Users, Scissors } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import { Colors } from "../constants";
import { UserProvider } from "../contexts";
import { queryClient } from "../services/queryClient";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
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
            paddingTop: 6,
            paddingBottom: Platform.OS === 'ios' ? insets.bottom + 6 : 6,
            height: Platform.OS === 'ios' ? 65 + insets.bottom : 65,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginTop: 2,
          },
          headerStyle: {
            backgroundColor: 'transparent',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            height: Platform.OS === 'ios' ? 60 + insets.top : 60,
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
        <Tabs.Screen
          name="index"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="search-users"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="gratitude-archive"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="+not-found"
          options={{
            href: null, // Hide from tab bar
          }}
        />
      </Tabs>
      </UserProvider>
    </QueryClientProvider>
  );
}
