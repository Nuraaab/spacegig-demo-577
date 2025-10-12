import { Tabs, useRouter } from "expo-router";
import { Home, Heart, User, Users, Plus } from "lucide-react-native";
import { TouchableOpacity, StyleSheet, Animated, Text, View } from "react-native";
import { useRef } from "react";

export default function TabLayout() {
  const router = useRouter();
  const addButtonScale = useRef(new Animated.Value(1)).current;

  const handleAddPress = () => {
    Animated.sequence([
      Animated.timing(addButtonScale, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(addButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push('/property-menu' as any);
    });
  };

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
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-job"
        options={{
          title: "",
          tabBarIcon: () => (
            <TouchableOpacity
              onPress={handleAddPress}
              style={styles.addJobContainer}
              activeOpacity={0.8}
            >
              <Animated.View style={{ transform: [{ scale: addButtonScale }] }}>
                <View style={styles.addButton}>
                  <Plus size={28} color="#fff" strokeWidth={2.5} />
                </View>
              </Animated.View>
              <Text style={styles.addJobLabel}>Add Property</Text>
            </TouchableOpacity>
          ),
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
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
  addJobContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 56,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
  },
  addJobLabel: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: '#4A90E2',
    marginTop: -16,
    textAlign: 'center',
    width: 80,
  },
});
