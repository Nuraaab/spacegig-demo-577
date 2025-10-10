import { useState, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  PanResponder,
  Animated,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Heart, X, MapPin, Bed, Bath, Maximize, Search, SlidersHorizontal, Home, Plus, LayoutGrid, Layers } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

export default function DiscoverScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getCurrentProperty, nextProperty, addToFavorites, properties } = useApp();
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'swipe' | 'stack'>('swipe');
  const addButtonScale = useRef(new Animated.Value(1)).current;
  const viewModeButtonScale = useRef(new Animated.Value(1)).current;

  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const property = getCurrentProperty();

  const handleSwipeComplete = (direction: 'left' | 'right') => {
    if (direction === 'right' && property) {
      addToFavorites(property.id);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2000);
    }
    nextProperty();
    position.setValue({ x: 0, y: 0 });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          Animated.spring(position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gesture.dy },
            useNativeDriver: false,
          }).start(() => handleSwipeComplete('right'));
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          Animated.spring(position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gesture.dy },
            useNativeDriver: false,
          }).start(() => handleSwipeComplete('left'));
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const likeButtonScale = useRef(new Animated.Value(1)).current;
  const passButtonScale = useRef(new Animated.Value(1)).current;
  const homeButtonScale = useRef(new Animated.Value(1)).current;
  const filterButtonScale = useRef(new Animated.Value(1)).current;

  const handleToggleViewMode = () => {
    animateButton(viewModeButtonScale, () => {
      setViewMode(prev => prev === 'swipe' ? 'stack' : 'swipe');
    });
  };

  const animateButton = (scale: Animated.Value, callback: () => void) => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  const handleLike = () => {
    animateButton(likeButtonScale, () => {
      Animated.spring(position, {
        toValue: { x: SCREEN_WIDTH + 100, y: 0 },
        useNativeDriver: false,
      }).start(() => handleSwipeComplete('right'));
    });
  };

  const handlePass = () => {
    animateButton(passButtonScale, () => {
      Animated.spring(position, {
        toValue: { x: -SCREEN_WIDTH - 100, y: 0 },
        useNativeDriver: false,
      }).start(() => handleSwipeComplete('left'));
    });
  };

  const handleAddHome = () => {
    Animated.sequence([
      Animated.timing(addButtonScale, {
        toValue: 1.2,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(addButtonScale, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push('/welcome');
    });
  };

  if (!property) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Discover Properties',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.replace('/onboarding')}
                style={{ marginLeft: 8 }}
              >
                <Home size={24} color="#1a1a1a" />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No more properties to show</Text>
          <Text style={styles.emptySubtext}>Check back later for new listings</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Discover Properties',
          headerLeft: () => (
            <Animated.View style={{ transform: [{ scale: homeButtonScale }], marginLeft: 8 }}>
              <TouchableOpacity
                onPress={() => animateButton(homeButtonScale, () => router.replace('/onboarding'))}
                activeOpacity={0.8}
              >
                <Home size={24} color="#1a1a1a" />
              </TouchableOpacity>
            </Animated.View>
          ),
        }}
      />

      <View style={[styles.searchContainer, { paddingTop: insets.top + 12 }]}>
        <View style={styles.searchBar}>
          <Search size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search properties..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Animated.View style={{ transform: [{ scale: viewModeButtonScale }] }}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={handleToggleViewMode}
            activeOpacity={0.8}
          >
            {viewMode === 'swipe' ? (
              <LayoutGrid size={20} color="#4A90E2" />
            ) : (
              <Layers size={20} color="#4A90E2" />
            )}
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={{ transform: [{ scale: filterButtonScale }] }}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => animateButton(filterButtonScale, () => setShowFilters(!showFilters))}
            activeOpacity={0.8}
          >
            <SlidersHorizontal size={20} color="#4A90E2" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {viewMode === 'swipe' ? (
        <>
          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }],
              },
            ]}
            {...panResponder.panHandlers}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push(`/property/${property.id}` as any)}
              style={styles.cardTouchable}
            >
              <Image source={{ uri: property.images[0] }} style={styles.image} />

              <Animated.View style={[styles.likeLabel, { opacity: likeOpacity }]}>
                <Text style={styles.likeLabelText}>LIKE</Text>
              </Animated.View>

              <Animated.View style={[styles.nopeLabel, { opacity: nopeOpacity }]}>
                <Text style={styles.nopeLabelText}>PASS</Text>
              </Animated.View>

              <View style={styles.cardContent}>
                <View style={styles.priceTag}>
                  <Text style={styles.price}>
                    ${property.price.toLocaleString()}/{property.listingType === 'rent' ? 'mo' : 'sale'}
                  </Text>
                </View>

                <Text style={styles.title}>{property.title}</Text>

                <View style={styles.locationRow}>
                  <MapPin size={16} color="#666" />
                  <Text style={styles.location}>
                    {property.location.city}, {property.location.state}
                  </Text>
                </View>

                <View style={styles.specs}>
                  <View style={styles.specItem}>
                    <Bed size={18} color="#4A90E2" />
                    <Text style={styles.specText}>{property.specs.beds} beds</Text>
                  </View>
                  <View style={styles.specItem}>
                    <Bath size={18} color="#4A90E2" />
                    <Text style={styles.specText}>{property.specs.baths} baths</Text>
                  </View>
                  <View style={styles.specItem}>
                    <Maximize size={18} color="#4A90E2" />
                    <Text style={styles.specText}>{property.specs.sqft} sqft</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.buttonsContainer}>
            <Animated.View style={{ transform: [{ scale: passButtonScale }] }}>
              <TouchableOpacity style={[styles.actionButton, styles.passButton]} onPress={handlePass} activeOpacity={0.8}>
                <X size={32} color="#FF6B6B" strokeWidth={3} />
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={{ transform: [{ scale: likeButtonScale }] }}>
              <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={handleLike} activeOpacity={0.8}>
                <Heart size={32} color="#4A90E2" strokeWidth={3} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </>
      ) : (
        <ScrollView
          style={styles.stackContainer}
          contentContainerStyle={styles.stackContent}
          showsVerticalScrollIndicator={false}
        >
          {properties.map((prop) => (
            <TouchableOpacity
              key={prop.id}
              activeOpacity={0.95}
              onPress={() => router.push(`/property/${prop.id}` as any)}
              style={styles.stackCard}
            >
              <Image source={{ uri: prop.images[0] }} style={styles.stackImage} />
              <View style={styles.stackCardContent}>
                <View style={styles.stackHeader}>
                  <View style={styles.stackPriceTag}>
                    <Text style={styles.stackPrice}>
                      ${prop.price.toLocaleString()}/{prop.listingType === 'rent' ? 'mo' : 'sale'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      addToFavorites(prop.id);
                      setShowConfirmation(true);
                      setTimeout(() => setShowConfirmation(false), 2000);
                    }}
                    style={styles.stackLikeButton}
                    activeOpacity={0.7}
                  >
                    <Heart size={20} color="#4A90E2" strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.stackTitle}>{prop.title}</Text>
                <View style={styles.locationRow}>
                  <MapPin size={14} color="#666" />
                  <Text style={styles.stackLocation}>
                    {prop.location.city}, {prop.location.state}
                  </Text>
                </View>
                <View style={styles.stackSpecs}>
                  <View style={styles.stackSpecItem}>
                    <Bed size={16} color="#4A90E2" />
                    <Text style={styles.stackSpecText}>{prop.specs.beds}</Text>
                  </View>
                  <View style={styles.stackSpecItem}>
                    <Bath size={16} color="#4A90E2" />
                    <Text style={styles.stackSpecText}>{prop.specs.baths}</Text>
                  </View>
                  <View style={styles.stackSpecItem}>
                    <Maximize size={16} color="#4A90E2" />
                    <Text style={styles.stackSpecText}>{prop.specs.sqft} sqft</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {showConfirmation && (
        <View style={styles.confirmation}>
          <Heart size={24} color="#fff" fill="#fff" />
          <Text style={styles.confirmationText}>Added to favorites!</Text>
        </View>
      )}

      <Animated.View style={[styles.addButtonContainer, { transform: [{ scale: addButtonScale }] }]}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddHome} activeOpacity={0.8}>
          <Plus size={24} color="#fff" strokeWidth={2.5} />
          <Text style={styles.addButtonText}>Add Home</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    position: 'absolute',
    top: 140,
    left: 20,
    right: 20,
    height: SCREEN_HEIGHT * 0.6,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardTouchable: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  likeLabel: {
    position: 'absolute',
    top: 50,
    right: 40,
    borderWidth: 4,
    borderColor: '#4A90E2',
    borderRadius: 8,
    padding: 8,
    transform: [{ rotate: '20deg' }],
  },
  likeLabelText: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#4A90E2',
  },
  nopeLabel: {
    position: 'absolute',
    top: 50,
    left: 40,
    borderWidth: 4,
    borderColor: '#FF6B6B',
    borderRadius: 8,
    padding: 8,
    transform: [{ rotate: '-20deg' }],
  },
  nopeLabelText: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#FF6B6B',
  },
  cardContent: {
    flex: 1,
    padding: 20,
  },
  priceTag: {
    position: 'absolute',
    top: -30,
    right: 20,
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  specs: {
    flexDirection: 'row',
    gap: 20,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  specText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500' as const,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  passButton: {
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  likeButton: {
    borderWidth: 2,
    borderColor: '#4A90E2',
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
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  confirmation: {
    position: 'absolute',
    top: 100,
    left: '50%',
    transform: [{ translateX: -100 }],
    width: 200,
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 130,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#0ea5e9',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600' as const,
    fontSize: 15,
  },
  stackContainer: {
    flex: 1,
    marginTop: 8,
  },
  stackContent: {
    padding: 16,
    paddingBottom: 100,
  },
  stackCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  stackImage: {
    width: '100%',
    height: 220,
  },
  stackCardContent: {
    padding: 16,
  },
  stackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stackPriceTag: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stackPrice: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
  stackLikeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stackTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 6,
  },
  stackLocation: {
    fontSize: 13,
    color: '#666',
  },
  stackSpecs: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  stackSpecItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stackSpecText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500' as const,
  },
});
