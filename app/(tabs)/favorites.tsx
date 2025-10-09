import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MapPin, Bed, Bath, Maximize, Heart } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Property } from '@/mocks/properties';

export default function FavoritesScreen() {
  const router = useRouter();
  const { getFavoriteProperties, removeFromFavorites } = useApp();
  const favorites = getFavoriteProperties();

  const renderProperty = ({ item }: { item: Property }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/property/${item.id}` as any)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.images[0] }} style={styles.image} />

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => removeFromFavorites(item.id)}
      >
        <Heart size={24} color="#FF6B6B" fill="#FF6B6B" />
      </TouchableOpacity>

      <View style={styles.cardContent}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.price}>
            ${item.price.toLocaleString()}/{item.listingType === 'rent' ? 'mo' : 'sale'}
          </Text>
        </View>

        <View style={styles.locationRow}>
          <MapPin size={14} color="#666" />
          <Text style={styles.location} numberOfLines={1}>
            {item.location.city}, {item.location.state}
          </Text>
        </View>

        <View style={styles.specs}>
          <View style={styles.specItem}>
            <Bed size={16} color="#4A90E2" />
            <Text style={styles.specText}>{item.specs.beds}</Text>
          </View>
          <View style={styles.specItem}>
            <Bath size={16} color="#4A90E2" />
            <Text style={styles.specText}>{item.specs.baths}</Text>
          </View>
          <View style={styles.specItem}>
            <Maximize size={16} color="#4A90E2" />
            <Text style={styles.specText}>{item.specs.sqft} sqft</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Favorites' }} />

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Heart size={64} color="#ddd" />
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>
            Swipe right on properties you like to add them here
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderProperty}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 200,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1a1a1a',
  },
  price: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#4A90E2',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  location: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  specs: {
    flexDirection: 'row',
    gap: 16,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500' as const,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
