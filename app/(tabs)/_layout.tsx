import { Tabs, useRouter, usePathname } from "expo-router";
import { Home, Heart, User, Plus, Users } from "lucide-react-native";
import React, { useRef } from "react";
import { TouchableOpacity, Text, StyleSheet, Animated } from "react-native";

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const isJobsRoute = pathname?.includes('/jobs');

  const handleAddPress = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 0.8,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 2,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      rotateAnim.setValue(0);
    });

    if (isJobsRoute) {
      router.push('/create-job' as any);
    } else {
      router.push('/create-listing' as any);
    }
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
        name="add-listing"
        options={{
          title: "",
          tabBarIcon: () => {
            const rotate = rotateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '180deg'],
            });
            return (
              <Animated.View style={{ transform: [{ scale: scaleAnim }, { rotate }] }}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddPress}
                  activeOpacity={0.9}
                >
                  <Plus size={28} color="#fff" strokeWidth={3} />
                </TouchableOpacity>
              </Animated.View>
            );
          },
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.addLabel, focused && styles.addLabelFocused]}>
              {isJobsRoute ? 'Add Opening' : 'Add Listing'}
            </Text>
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={handleAddPress}
              style={props.style}
            />
          ),
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
