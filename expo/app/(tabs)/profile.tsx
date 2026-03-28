import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { User, Heart, Home, LogOut, ChevronRight, Plus } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut, getFavoriteProperties } = useApp();
  const favoritesCount = getFavoriteProperties().length;

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth' as any);
  };

  const handleCreateListing = () => {
    router.push('/create-listing' as any);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Profile' }} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={48} color="#4A90E2" />
            </View>
          )}
          <Text style={styles.name}>{user?.name || 'Guest User'}</Text>
          <Text style={styles.email}>{user?.email || 'guest@example.com'}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Heart size={24} color="#FF6B6B" />
            <Text style={styles.statNumber}>{favoritesCount}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statCard}>
            <Home size={24} color="#4A90E2" />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Listings</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleCreateListing}>
          <Plus size={24} color="#fff" />
          <Text style={styles.createButtonText}>Create New Listing</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.menuItem}>
            <User size={20} color="#666" />
            <Text style={styles.menuItemText}>Edit Profile</Text>
            <ChevronRight size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Heart size={20} color="#666" />
            <Text style={styles.menuItemText}>My Favorites</Text>
            <ChevronRight size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/my-listings' as any)}
          >
            <Home size={20} color="#666" />
            <Text style={styles.menuItemText}>My Listings</Text>
            <ChevronRight size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={20} color="#FF6B6B" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FF6B6B',
  },
});
