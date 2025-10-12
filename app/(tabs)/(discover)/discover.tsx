import { useState, useRef, useMemo } from 'react';
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
  Modal,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Heart, X, MapPin, Bed, Bath, Maximize, Search, SlidersHorizontal, Home, LayoutGrid, Layers, Map } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { PROPERTY_TYPES, AMENITIES, PropertyType } from '@/mocks/properties';

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
  const viewModeButtonScale = useRef(new Animated.Value(1)).current;

  const [filters, setFilters] = useState({
    propertyTypes: [] as PropertyType[],
    listingType: 'all' as 'all' | 'rent' | 'sale',
    priceRange: { min: 0, max: 10000 },
    beds: 0,
    baths: 0,
    amenities: [] as string[],
  });

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

  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      if (searchQuery && !prop.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !prop.location.city.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(prop.propertyType)) {
        return false;
      }

      if (filters.listingType !== 'all' && prop.listingType !== filters.listingType) {
        return false;
      }

      if (prop.price < filters.priceRange.min || prop.price > filters.priceRange.max) {
        return false;
      }

      if (filters.beds > 0 && prop.specs.beds < filters.beds) {
        return false;
      }

      if (filters.baths > 0 && prop.specs.baths < filters.baths) {
        return false;
      }

      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => prop.amenities.includes(amenity));
        if (!hasAllAmenities) return false;
      }

      return true;
    });
  }, [properties, searchQuery, filters]);

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

      <View style={styles.topContainer}>
        <View style={styles.searchBarFullWidth}>
          <Search size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search properties..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View style={styles.filterRow}>
          <Animated.View style={{ transform: [{ scale: homeButtonScale }] }}>
            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => animateButton(homeButtonScale, () => router.replace('/onboarding'))}
              activeOpacity={0.8}
            >
              <Home size={22} color="#4A90E2" />
            </TouchableOpacity>
          </Animated.View>
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
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => router.push('/(tabs)/(discover)/map' as any)}
            activeOpacity={0.8}
          >
            <Map size={20} color="#4A90E2" />
          </TouchableOpacity>
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
          {filteredProperties.map((prop) => (
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

      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity 
                onPress={() => {
                  setFilters({
                    propertyTypes: [],
                    listingType: 'all',
                    priceRange: { min: 0, max: 10000 },
                    beds: 0,
                    baths: 0,
                    amenities: [],
                  });
                }}
              >
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Listing Type</Text>
                <View style={styles.segmentedControl}>
                  {['all', 'rent', 'sale'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.segment,
                        filters.listingType === type && styles.segmentActive,
                      ]}
                      onPress={() => setFilters({ ...filters, listingType: type as any })}
                    >
                      <Text
                        style={[
                          styles.segmentText,
                          filters.listingType === type && styles.segmentTextActive,
                        ]}
                      >
                        {type === 'all' ? 'All' : type === 'rent' ? 'For Rent' : 'For Sale'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Price Range</Text>
                <View style={styles.priceInputContainer}>
                  <View style={styles.priceInput}>
                    <Text style={styles.pricePrefix}>$</Text>
                    <TextInput
                      style={styles.priceInputText}
                      value={filters.priceRange.min === 0 ? '' : filters.priceRange.min.toString()}
                      onChangeText={(text) => {
                        const value = parseInt(text) || 0;
                        setFilters({
                          ...filters,
                          priceRange: { ...filters.priceRange, min: value },
                        });
                      }}
                      keyboardType="numeric"
                      placeholder="Min"
                      placeholderTextColor="#999"
                    />
                  </View>
                  <Text style={styles.priceSeparator}>—</Text>
                  <View style={styles.priceInput}>
                    <Text style={styles.pricePrefix}>$</Text>
                    <TextInput
                      style={styles.priceInputText}
                      value={filters.priceRange.max === 10000 ? '' : filters.priceRange.max.toString()}
                      onChangeText={(text) => {
                        const value = parseInt(text) || 10000;
                        setFilters({
                          ...filters,
                          priceRange: { ...filters.priceRange, max: value },
                        });
                      }}
                      keyboardType="numeric"
                      placeholder="Max"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Bedrooms</Text>
                <View style={styles.numberGrid}>
                  {[0, 1, 2, 3, 4, 5].map((num) => (
                    <TouchableOpacity
                      key={num}
                      style={[
                        styles.numberButton,
                        filters.beds === num && styles.numberButtonActive,
                      ]}
                      onPress={() => setFilters({ ...filters, beds: num })}
                    >
                      <Text
                        style={[
                          styles.numberButtonText,
                          filters.beds === num && styles.numberButtonTextActive,
                        ]}
                      >
                        {num === 0 ? 'Any' : num === 5 ? '5+' : num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Bathrooms</Text>
                <View style={styles.numberGrid}>
                  {[0, 1, 2, 3, 4].map((num) => (
                    <TouchableOpacity
                      key={num}
                      style={[
                        styles.numberButton,
                        filters.baths === num && styles.numberButtonActive,
                      ]}
                      onPress={() => setFilters({ ...filters, baths: num })}
                    >
                      <Text
                        style={[
                          styles.numberButtonText,
                          filters.baths === num && styles.numberButtonTextActive,
                        ]}
                      >
                        {num === 0 ? 'Any' : num === 4 ? '4+' : num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Property Type</Text>
                <View style={styles.chipContainer}>
                  {PROPERTY_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.chip,
                        filters.propertyTypes.includes(type.value) && styles.chipActive,
                      ]}
                      onPress={() => {
                        const newTypes = filters.propertyTypes.includes(type.value)
                          ? filters.propertyTypes.filter((t) => t !== type.value)
                          : [...filters.propertyTypes, type.value];
                        setFilters({ ...filters, propertyTypes: newTypes });
                      }}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          filters.propertyTypes.includes(type.value) && styles.chipTextActive,
                        ]}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Amenities</Text>
                <View style={styles.chipContainer}>
                  {AMENITIES.slice(0, 8).map((amenity) => (
                    <TouchableOpacity
                      key={amenity.name}
                      style={[
                        styles.chip,
                        filters.amenities.includes(amenity.name) && styles.chipActive,
                      ]}
                      onPress={() => {
                        const newAmenities = filters.amenities.includes(amenity.name)
                          ? filters.amenities.filter((a) => a !== amenity.name)
                          : [...filters.amenities, amenity.name];
                        setFilters({ ...filters, amenities: newAmenities });
                      }}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          filters.amenities.includes(amenity.name) && styles.chipTextActive,
                        ]}
                      >
                        {amenity.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.applyButtonText}>Show Results</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  searchBarFullWidth: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  homeButton: {
    width: 48,
    height: 48,
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#1a1a1a',
  },
  resetText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#4A90E2',
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginBottom: 28,
  },
  filterLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#666',
  },
  segmentTextActive: {
    color: '#1a1a1a',
    fontWeight: '600' as const,
  },
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  numberButton: {
    width: '15%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 1.5,
    borderColor: '#f5f5f5',
  },
  numberButtonActive: {
    backgroundColor: '#E8F4FF',
    borderColor: '#4A90E2',
  },
  numberButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#666',
  },
  numberButtonTextActive: {
    color: '#4A90E2',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1.5,
    borderColor: '#f5f5f5',
  },
  chipActive: {
    backgroundColor: '#E8F4FF',
    borderColor: '#4A90E2',
  },
  chipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500' as const,
  },
  chipTextActive: {
    color: '#4A90E2',
    fontWeight: '600' as const,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#f5f5f5',
  },
  pricePrefix: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#666',
    marginRight: 4,
  },
  priceInputText: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500' as const,
  },
  priceSeparator: {
    fontSize: 18,
    color: '#999',
    fontWeight: '300' as const,
  },
  modalFooter: {
    padding: 20,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  applyButton: {
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#fff',
  },
});
