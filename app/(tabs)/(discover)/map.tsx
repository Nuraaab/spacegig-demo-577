import { useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Platform,
  Image,
} from 'react-native';
import type { Region } from 'react-native-maps';
import { Stack, useRouter } from 'expo-router';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Heart,
  ChevronDown,
  ChevronUp,
  Home,
  ArrowUpDown,
  Bookmark,
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { PROPERTY_TYPES, PropertyType, Property } from '@/mocks/properties';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'sqft_asc' | 'sqft_desc';

function MapViewComponent({
  mapRef,
  region,
  filteredProperties,
  selectedProperty,
  handleMarkerPress,
  handleRegionChangeComplete,
}: {
  mapRef: any;
  region: Region;
  filteredProperties: Property[];
  selectedProperty: Property | null;
  handleMarkerPress: (property: Property) => void;
  handleRegionChangeComplete: (region: Region) => void;
}) {
  if (Platform.OS === 'web') return null;

  const MapView = require('react-native-maps').default;
  const { Marker, PROVIDER_DEFAULT } = require('react-native-maps');

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      provider={PROVIDER_DEFAULT}
      initialRegion={region}
      onRegionChangeComplete={handleRegionChangeComplete}
      showsUserLocation={false}
      showsMyLocationButton={false}
    >
      {filteredProperties.map((property) => (
        <Marker
          key={property.id}
          coordinate={{
            latitude: property.location.lat,
            longitude: property.location.lng,
          }}
          onPress={() => handleMarkerPress(property)}
        >
          <View
            style={[
              styles.markerChip,
              selectedProperty?.id === property.id && styles.markerChipSelected,
              property.is_deal && styles.markerChipDeal,
            ]}
          >
            <Text style={styles.markerText}>{property.price_display}</Text>
            {property.is_deal && (
              <View style={styles.dealBadge}>
                <Text style={styles.dealBadgeText}>Deal</Text>
              </View>
            )}
            {property.is_new && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>New</Text>
              </View>
            )}
          </View>
        </Marker>
      ))}
    </MapView>
  );
}

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { properties, addToFavorites } = useApp();
  const mapRef = useRef<any>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showSortMenu, setShowSortMenu] = useState<boolean>(false);
  const [showSaveSearch, setShowSaveSearch] = useState<boolean>(false);
  const [savedSearchName, setSavedSearchName] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState<boolean>(false);
  const [listPanelHeight, setListPanelHeight] = useState<number>(0);
  const [showSearchThisArea, setShowSearchThisArea] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');

  const [filters, setFilters] = useState({
    propertyTypes: [] as PropertyType[],
    listingType: 'all' as 'all' | 'rent' | 'sale',
    priceRange: { min: 0, max: 10000 },
    beds: 0,
    baths: 0,
    amenities: [] as string[],
    minSqft: 0,
    petsAllowed: false,
    parking: false,
    yearBuilt: '',
    keywords: '',
  });

  const [region, setRegion] = useState<Region>({
    latitude: 34.0522,
    longitude: -118.2437,
    latitudeDelta: 2.5,
    longitudeDelta: 2.5,
  });

  const filteredProperties = useMemo(() => {
    let filtered = properties.filter((prop) => {
      if (searchQuery && !prop.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !prop.location.city.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !prop.location.address.toLowerCase().includes(searchQuery.toLowerCase())) {
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

      if (filters.minSqft > 0 && prop.specs.sqft < filters.minSqft) {
        return false;
      }

      if (filters.petsAllowed && !prop.amenities.includes('Pet friendly')) {
        return false;
      }

      if (filters.parking && !prop.amenities.includes('Free parking')) {
        return false;
      }

      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => prop.amenities.includes(amenity));
        if (!hasAllAmenities) return false;
      }

      if (filters.keywords && !prop.description.toLowerCase().includes(filters.keywords.toLowerCase())) {
        return false;
      }

      return true;
    });

    switch (sortBy) {
      case 'price_asc':
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered = filtered.sort((a, b) => new Date(b.listed_at).getTime() - new Date(a.listed_at).getTime());
        break;
      case 'sqft_asc':
        filtered = filtered.sort((a, b) => a.specs.sqft - b.specs.sqft);
        break;
      case 'sqft_desc':
        filtered = filtered.sort((a, b) => b.specs.sqft - a.specs.sqft);
        break;
      default:
        break;
    }

    return filtered;
  }, [properties, searchQuery, filters, sortBy]);

  const handleMarkerPress = useCallback((property: Property) => {
    setSelectedProperty(property);
    setShowBottomSheet(true);
    
    const propertyIndex = filteredProperties.findIndex(p => p.id === property.id);
    if (propertyIndex !== -1 && listPanelHeight > 0) {
      console.log('Scrolling to property:', property.title);
    }
  }, [filteredProperties, listPanelHeight]);

  const handleCardPress = useCallback((property: Property) => {
    setSelectedProperty(property);
    setShowBottomSheet(true);
    
    mapRef.current?.animateToRegion({
      latitude: property.location.lat,
      longitude: property.location.lng,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }, 500);
  }, []);

  const handleRegionChangeComplete = useCallback((newRegion: Region) => {
    setRegion(newRegion);
    setShowSearchThisArea(true);
  }, []);

  const handleSearchThisArea = useCallback(() => {
    console.log('Searching area:', region);
    setShowSearchThisArea(false);
  }, [region]);

  const handleSaveSearch = useCallback(() => {
    console.log('Saving search:', savedSearchName, filters, region);
    setSavedSearchName('');
    setShowSaveSearch(false);
  }, [savedSearchName, filters, region]);

  const toggleListPanel = useCallback(() => {
    setListPanelHeight(prev => prev === 0 ? 300 : 0);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      propertyTypes: [],
      listingType: 'all',
      priceRange: { min: 0, max: 10000 },
      beds: 0,
      baths: 0,
      amenities: [],
      minSqft: 0,
      petsAllowed: false,
      parking: false,
      yearBuilt: '',
      keywords: '',
    });
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Map View',
          headerShown: false,
        }}
      />

      <View style={[styles.searchContainer, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Home size={22} color="#4A90E2" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Search size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search address, city, ZIP..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowSortMenu(true)}
          activeOpacity={0.8}
        >
          <ArrowUpDown size={20} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowFilters(true)}
          activeOpacity={0.8}
        >
          <SlidersHorizontal size={20} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowSaveSearch(true)}
          activeOpacity={0.8}
        >
          <Bookmark size={20} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      {Platform.OS === 'web' ? (
        <View style={styles.webFallback}>
          <MapPin size={64} color="#4A90E2" />
          <Text style={styles.webFallbackTitle}>Map View</Text>
          <Text style={styles.webFallbackText}>
            Interactive map is only available on mobile devices.
          </Text>
          <Text style={styles.webFallbackText}>
            Scan the QR code to view the map on your phone.
          </Text>
        </View>
      ) : (
        <MapViewComponent
          mapRef={mapRef}
          region={region}
          filteredProperties={filteredProperties}
          selectedProperty={selectedProperty}
          handleMarkerPress={handleMarkerPress}
          handleRegionChangeComplete={handleRegionChangeComplete}
        />
      )}

      {showSearchThisArea && (
        <View style={styles.searchAreaButtonContainer}>
          <TouchableOpacity
            style={styles.searchAreaButton}
            onPress={handleSearchThisArea}
            activeOpacity={0.9}
          >
            <Search size={18} color="#fff" />
            <Text style={styles.searchAreaButtonText}>Search this area</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.listPanelToggle}>
        <TouchableOpacity
          style={styles.listToggleButton}
          onPress={toggleListPanel}
          activeOpacity={0.9}
        >
          {listPanelHeight === 0 ? (
            <ChevronUp size={24} color="#4A90E2" />
          ) : (
            <ChevronDown size={24} color="#4A90E2" />
          )}
          <Text style={styles.listToggleText}>
            {filteredProperties.length} properties
          </Text>
        </TouchableOpacity>
      </View>

      {listPanelHeight > 0 && (
        <View style={[styles.listPanel, { height: listPanelHeight }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {filteredProperties.map((property) => (
              <TouchableOpacity
                key={property.id}
                style={styles.listCard}
                onPress={() => handleCardPress(property)}
                activeOpacity={0.9}
              >
                <Image source={{ uri: property.images[0] }} style={styles.listCardImage} />
                <View style={styles.listCardContent}>
                  <Text style={styles.listCardPrice}>{property.price_display}</Text>
                  <Text style={styles.listCardTitle} numberOfLines={1}>
                    {property.title}
                  </Text>
                  <View style={styles.listCardSpecs}>
                    <Text style={styles.listCardSpecText}>
                      {property.specs.beds} bd · {property.specs.baths} ba · {property.specs.sqft} sqft
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <Modal
        visible={showBottomSheet}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBottomSheet(false)}
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity
            style={styles.bottomSheetBackdrop}
            activeOpacity={1}
            onPress={() => setShowBottomSheet(false)}
          />
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHandle} />
            {selectedProperty && (
              <>
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  style={styles.bottomSheetCarousel}
                >
                  {selectedProperty.images.slice(0, 3).map((image, index) => (
                    <Image
                      key={index}
                      source={{ uri: image }}
                      style={styles.bottomSheetImage}
                    />
                  ))}
                </ScrollView>
                <View style={styles.bottomSheetContent}>
                  <View style={styles.bottomSheetHeader}>
                    <View>
                      <Text style={styles.bottomSheetPrice}>{selectedProperty.price_display}</Text>
                      <View style={styles.bottomSheetBadges}>
                        {selectedProperty.is_deal && (
                          <View style={styles.bottomSheetDealBadge}>
                            <Text style={styles.bottomSheetDealText}>Deal</Text>
                          </View>
                        )}
                        {selectedProperty.is_new && (
                          <View style={styles.bottomSheetNewBadge}>
                            <Text style={styles.bottomSheetNewText}>New</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.bottomSheetSaveButton}
                      onPress={() => {
                        addToFavorites(selectedProperty.id);
                      }}
                      activeOpacity={0.8}
                    >
                      <Heart size={24} color="#4A90E2" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.bottomSheetTitle}>{selectedProperty.title}</Text>
                  <View style={styles.bottomSheetSpecs}>
                    <View style={styles.bottomSheetSpecItem}>
                      <Bed size={18} color="#666" />
                      <Text style={styles.bottomSheetSpecText}>
                        {selectedProperty.specs.beds} beds
                      </Text>
                    </View>
                    <View style={styles.bottomSheetSpecItem}>
                      <Bath size={18} color="#666" />
                      <Text style={styles.bottomSheetSpecText}>
                        {selectedProperty.specs.baths} baths
                      </Text>
                    </View>
                    <View style={styles.bottomSheetSpecItem}>
                      <Maximize size={18} color="#666" />
                      <Text style={styles.bottomSheetSpecText}>
                        {selectedProperty.specs.sqft} sqft
                      </Text>
                    </View>
                  </View>
                  <View style={styles.bottomSheetLocation}>
                    <MapPin size={16} color="#666" />
                    <Text style={styles.bottomSheetLocationText}>
                      {selectedProperty.location.address}, {selectedProperty.location.city}, {selectedProperty.location.state}
                    </Text>
                  </View>
                  <View style={styles.bottomSheetActions}>
                    <TouchableOpacity
                      style={styles.bottomSheetButton}
                      onPress={() => {
                        setShowBottomSheet(false);
                        router.push(`/property/${selectedProperty.id}` as any);
                      }}
                      activeOpacity={0.9}
                    >
                      <Text style={styles.bottomSheetButtonText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

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
              <TouchableOpacity onPress={resetFilters}>
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
                <Text style={styles.filterLabel}>Min Square Feet</Text>
                <TextInput
                  style={styles.textInput}
                  value={filters.minSqft === 0 ? '' : filters.minSqft.toString()}
                  onChangeText={(text) => {
                    const value = parseInt(text) || 0;
                    setFilters({ ...filters, minSqft: value });
                  }}
                  keyboardType="numeric"
                  placeholder="Enter minimum sqft"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Additional Filters</Text>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setFilters({ ...filters, petsAllowed: !filters.petsAllowed })}
                >
                  <View style={[styles.checkbox, filters.petsAllowed && styles.checkboxActive]}>
                    {filters.petsAllowed && <View style={styles.checkboxInner} />}
                  </View>
                  <Text style={styles.checkboxLabel}>Pets Allowed</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setFilters({ ...filters, parking: !filters.parking })}
                >
                  <View style={[styles.checkbox, filters.parking && styles.checkboxActive]}>
                    {filters.parking && <View style={styles.checkboxInner} />}
                  </View>
                  <Text style={styles.checkboxLabel}>Parking</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Keywords</Text>
                <TextInput
                  style={styles.textInput}
                  value={filters.keywords}
                  onChangeText={(text) => setFilters({ ...filters, keywords: text })}
                  placeholder="Search description..."
                  placeholderTextColor="#999"
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.applyButtonText}>Show {filteredProperties.length} Results</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSortMenu}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowSortMenu(false)}
      >
        <TouchableOpacity
          style={styles.sortMenuOverlay}
          activeOpacity={1}
          onPress={() => setShowSortMenu(false)}
        >
          <View style={styles.sortMenu}>
            <Text style={styles.sortMenuTitle}>Sort By</Text>
            {[
              { value: 'relevance', label: 'Relevance' },
              { value: 'price_asc', label: 'Price: Low to High' },
              { value: 'price_desc', label: 'Price: High to Low' },
              { value: 'newest', label: 'Newest' },
              { value: 'sqft_asc', label: 'Sqft: Low to High' },
              { value: 'sqft_desc', label: 'Sqft: High to Low' },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.sortMenuItem}
                onPress={() => {
                  setSortBy(option.value as SortOption);
                  setShowSortMenu(false);
                }}
              >
                <Text
                  style={[
                    styles.sortMenuItemText,
                    sortBy === option.value && styles.sortMenuItemTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showSaveSearch}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowSaveSearch(false)}
      >
        <View style={styles.saveSearchOverlay}>
          <View style={styles.saveSearchModal}>
            <Text style={styles.saveSearchTitle}>Save Search</Text>
            <TextInput
              style={styles.saveSearchInput}
              value={savedSearchName}
              onChangeText={setSavedSearchName}
              placeholder="Enter search name..."
              placeholderTextColor="#999"
            />
            <View style={styles.saveSearchActions}>
              <TouchableOpacity
                style={styles.saveSearchCancelButton}
                onPress={() => {
                  setSavedSearchName('');
                  setShowSaveSearch(false);
                }}
              >
                <Text style={styles.saveSearchCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveSearchSaveButton}
                onPress={handleSaveSearch}
              >
                <Text style={styles.saveSearchSaveText}>Save</Text>
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
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    paddingBottom: 12,
    gap: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
    zIndex: 10,
  },
  homeButton: {
    width: 44,
    height: 44,
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
  },
  iconButton: {
    width: 44,
    height: 44,
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  markerChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4A90E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  markerChipSelected: {
    backgroundColor: '#4A90E2',
    transform: [{ scale: 1.1 }],
  },
  markerChipDeal: {
    borderColor: '#FF6B6B',
  },
  markerText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: '#1a1a1a',
  },
  dealBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  dealBadgeText: {
    fontSize: 9,
    fontWeight: '700' as const,
    color: '#fff',
  },
  newBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: '700' as const,
    color: '#fff',
  },
  searchAreaButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 130 : 90,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  searchAreaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  searchAreaButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#fff',
  },
  listPanelToggle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  listToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  listToggleText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
  },
  listPanel: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  listCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  listCardImage: {
    width: '100%',
    height: 180,
  },
  listCardContent: {
    padding: 12,
  },
  listCardPrice: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#4A90E2',
    marginBottom: 4,
  },
  listCardTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 6,
  },
  listCardSpecs: {
    flexDirection: 'row',
  },
  listCardSpecText: {
    fontSize: 13,
    color: '#666',
  },
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheetBackdrop: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  bottomSheetCarousel: {
    height: 240,
  },
  bottomSheetImage: {
    width: SCREEN_WIDTH,
    height: 240,
  },
  bottomSheetContent: {
    padding: 20,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bottomSheetPrice: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#4A90E2',
    marginBottom: 8,
  },
  bottomSheetBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  bottomSheetDealBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bottomSheetDealText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#fff',
  },
  bottomSheetNewBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bottomSheetNewText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#fff',
  },
  bottomSheetSaveButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheetTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  bottomSheetSpecs: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  bottomSheetSpecItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bottomSheetSpecText: {
    fontSize: 15,
    color: '#666',
  },
  bottomSheetLocation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 20,
  },
  bottomSheetLocationText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bottomSheetActions: {
    flexDirection: 'row',
    gap: 12,
  },
  bottomSheetButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  bottomSheetButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
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
  textInput: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    color: '#1a1a1a',
    borderWidth: 1.5,
    borderColor: '#f5f5f5',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    borderColor: '#4A90E2',
    backgroundColor: '#E8F4FF',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: '#4A90E2',
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#1a1a1a',
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
  sortMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sortMenu: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 300,
  },
  sortMenuTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 16,
  },
  sortMenuItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sortMenuItemText: {
    fontSize: 16,
    color: '#666',
  },
  sortMenuItemTextActive: {
    color: '#4A90E2',
    fontWeight: '600' as const,
  },
  saveSearchOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  saveSearchModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
  },
  saveSearchTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 16,
  },
  saveSearchInput: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 20,
  },
  saveSearchActions: {
    flexDirection: 'row',
    gap: 12,
  },
  saveSearchCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  saveSearchCancelText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#666',
  },
  saveSearchSaveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
  },
  saveSearchSaveText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f8f9fa',
  },
  webFallbackTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginTop: 20,
    marginBottom: 12,
  },
  webFallbackText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
});
