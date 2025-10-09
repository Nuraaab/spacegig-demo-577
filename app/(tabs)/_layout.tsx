import { Tabs, useRouter } from "expo-router";
import { Home, Heart, User, Plus } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600' as const,
        },
      }}
    >
      <Tabs.Screen
        name="(discover)"
        options={{
          title: "Discover",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-listing"
        options={{
          title: "",
          tabBarIcon: () => (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/create-listing/index' as any)}
            >
              <Plus size={28} color="#fff" strokeWidth={3} />
            </TouchableOpacity>
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.addLabel, focused && styles.addLabelFocused]}>
              Add Listing
            </Text>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/create-listing/index' as any);
          },
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addLabel: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: '#999',
    marginTop: 4,
  },
  addLabelFocused: {
    color: '#4A90E2',
  },
});
