import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  X,
  Heart,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Wifi,
  Tv,
  UtensilsCrossed,
  WashingMachine,
  Car,
  Wind,
  Flame,
  Waves,
  Dumbbell,
  PawPrint,
  Home,
  Home as HomeIcon,
  Trees,
  TrendingUp,
  Zap,
  Crown,
  Eye,
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AMENITY_ICONS: Record<string, any> = {
  'Wi-Fi': Wifi,
  TV: Tv,
  Kitchen: UtensilsCrossed,
  Washer: WashingMachine,
  'Free parking': Car,
  'Air conditioning': Wind,
  Heating: Flame,
  Pool: Waves,
  Gym: Dumbbell,
  'Pet friendly': PawPrint,
  Balcony: HomeIcon,
  Garden: Trees,
};

export default function PropertyDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { properties, favorites, addToFavorites, removeFromFavorites, isAuthenticated } = useApp();
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const property = properties.find((p) => p.id === id);
  const isFavorite = favorites.includes(id as string);

  if (!property) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.homeButton} onPress={() => router.replace('/onboarding')}>
            <Home size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <X size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Property not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(property.id);
    } else {
      addToFavorites(property.id);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setCurrentImageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {property.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.image} />
            ))}
          </ScrollView>

          <View style={styles.imageIndicator}>
            {property.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentImageIndex && styles.activeDot,
                ]}
              />
            ))}
          </View>

          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity style={styles.homeButton} onPress={() => router.replace('/onboarding')}>
                <Home size={24} color="#1a1a1a" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                <X size={24} color="#1a1a1a" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleFavorite}>
              <Heart
                size={24}
                color={isFavorite ? '#FF6B6B' : '#1a1a1a'}
                fill={isFavorite ? '#FF6B6B' : 'transparent'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>
              ${property.price.toLocaleString()}
              <Text style={styles.priceUnit}>
                /{property.listingType === 'rent' ? 'month' : 'sale'}
              </Text>
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{property.title}</Text>

          <View style={styles.locationRow}>
            <MapPin size={18} color="#666" />
            <Text style={styles.location}>
              {property.location.address}, {property.location.city}, {property.location.state}
            </Text>
          </View>

          <View style={styles.specsContainer}>
            <View style={styles.specCard}>
              <Bed size={24} color="#4A90E2" />
              <Text style={styles.specNumber}>{property.specs.beds}</Text>
              <Text style={styles.specLabel}>Bedrooms</Text>
            </View>
            <View style={styles.specCard}>
              <Bath size={24} color="#4A90E2" />
              <Text style={styles.specNumber}>{property.specs.baths}</Text>
              <Text style={styles.specLabel}>Bathrooms</Text>
            </View>
            <View style={styles.specCard}>
              <Maximize size={24} color="#4A90E2" />
              <Text style={styles.specNumber}>{property.specs.sqft}</Text>
              <Text style={styles.specLabel}>Sq Ft</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {property.amenities.map((amenity, index) => {
                const Icon = AMENITY_ICONS[amenity] || HomeIcon;
                return (
                  <View key={index} style={styles.amenityItem}>
                    <Icon size={20} color="#4A90E2" />
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {property.boost && property.boost.tier !== 'none' && (
            <View style={styles.boostSection}>
              <View style={styles.boostHeader}>
                <View style={[styles.boostBadge, styles[`boost${property.boost.tier.charAt(0).toUpperCase() + property.boost.tier.slice(1)}` as keyof typeof styles]]}>
                  {property.boost.tier === 'basic' && <TrendingUp size={16} color="#4A90E2" />}
                  {property.boost.tier === 'featured' && <Zap size={16} color="#F59E0B" />}
                  {property.boost.tier === 'premium' && <Crown size={16} color="#8B5CF6" />}
                  <Text style={[styles.boostBadgeText, styles[`boost${property.boost.tier.charAt(0).toUpperCase() + property.boost.tier.slice(1)}Text` as keyof typeof styles]]}>
                    {property.boost.tier.charAt(0).toUpperCase() + property.boost.tier.slice(1)} Boost
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.boostAnalyticsButton}
                  onPress={() => console.log('View analytics')}
                >
                  <Eye size={16} color="#666" />
                  <Text style={styles.boostAnalyticsText}>
                    {property.boost.views || 0} views
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.boostStats}>
                <View style={styles.boostStat}>
                  <Text style={styles.boostStatLabel}>Impressions</Text>
                  <Text style={styles.boostStatValue}>{property.boost.impressions || 0}</Text>
                </View>
                <View style={styles.boostStat}>
                  <Text style={styles.boostStatLabel}>Active Until</Text>
                  <Text style={styles.boostStatValue}>
                    {property.boost.endDate ? new Date(property.boost.endDate).toLocaleDateString() : 'N/A'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.boostListingButton}
            onPress={() => {
              if (!isAuthenticated) {
                router.push('/auth');
              } else {
                console.log('Boost listing');
              }
            }}
          >
            <TrendingUp size={20} color="#fff" />
            <Text style={styles.boostListingButtonText}>Boost This Listing</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => {
              if (!isAuthenticated) {
                router.push('/auth');
              } else {
                console.log('Contact host');
              }
            }}
          >
            <Text style={styles.contactButtonText}>Contact Host</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    height: 400,
    position: 'relative',
  },
  image: {
    width: SCREEN_WIDTH,
    height: 400,
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 24,
  },
  header: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    gap: 8,
  },
  homeButton: {
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
  closeButton: {
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
  favoriteButton: {
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
  content: {
    padding: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#1a1a1a',
  },
  priceUnit: {
    fontSize: 18,
    fontWeight: '400' as const,
    color: '#666',
  },
  badge: {
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#4A90E2',
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  location: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  specsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  specCard: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  specNumber: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginTop: 8,
  },
  specLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  amenityText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  contactButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  contactButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
  boostSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  boostHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  boostBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  boostBasic: {
    backgroundColor: '#EFF6FF',
  },
  boostFeatured: {
    backgroundColor: '#FEF3C7',
  },
  boostPremium: {
    backgroundColor: '#F3E8FF',
  },
  boostBadgeText: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  boostBasicText: {
    color: '#4A90E2',
  },
  boostFeaturedText: {
    color: '#F59E0B',
  },
  boostPremiumText: {
    color: '#8B5CF6',
  },
  boostAnalyticsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  boostAnalyticsText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#666',
  },
  boostStats: {
    flexDirection: 'row',
    gap: 12,
  },
  boostStat: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
  },
  boostStatLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  boostStatValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1a1a1a',
  },
  boostListingButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  boostListingButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#fff',
  },
});
