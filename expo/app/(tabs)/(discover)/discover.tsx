import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Heart, MapPin, Bed, Bath, Maximize, Search, Home as HomeIcon, Briefcase, Package, Wrench, Users, ChevronRight, X, Store, LayoutGrid, List } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { PROPERTY_TYPES, AMENITIES, PropertyType } from '@/mocks/properties';



interface Category {
  id: string;
  label: string;
  icon: any;
  count: number;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  label: string;
  count: number;
  propertyTypes?: PropertyType[];
}

export default function DiscoverScreen() {
  const router = useRouter();
  const { addToFavorites, properties } = useApp();
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [listingTypeFilter, setListingTypeFilter] = useState<'all' | 'rent' | 'sale'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('list');

  const categories: Category[] = [
    {
      id: 'properties',
      label: '🏠 Properties',
      icon: HomeIcon,
      count: 342,
      subcategories: [
        { id: 'houses', label: '🏠 House', count: 128, propertyTypes: ['house'] },
        { id: 'apartments', label: '🏢 Apartment', count: 156, propertyTypes: ['apartment'] },
        { id: 'land', label: '🌳 Land', count: 67, propertyTypes: ['land'] },
        { id: 'basement', label: '🏚️ Basement', count: 45, propertyTypes: ['basement'] },
        { id: 'rooms', label: '🚪 Room', count: 167, propertyTypes: ['room'] },
      ],
    },
    {
      id: 'jobs',
      label: '💼 Jobs',
      icon: Briefcase,
      count: 145,
      subcategories: [
        { id: 'full-time', label: 'Full Time', count: 78 },
        { id: 'part-time', label: 'Part Time', count: 45 },
        { id: 'contract', label: 'Contract', count: 22 },
      ],
    },
    {
      id: 'services',
      label: '🔧 Services',
      icon: Wrench,
      count: 203,
      subcategories: [
        { id: 'home-services', label: 'Home Services', count: 89 },
        { id: 'professional', label: 'Professional Services', count: 67 },
        { id: 'personal', label: 'Personal Services', count: 47 },
      ],
    },
    {
      id: 'items',
      label: '📦 Items',
      icon: Package,
      count: 521,
      subcategories: [
        { id: 'furniture', label: 'Furniture', count: 156 },
        { id: 'electronics', label: 'Electronics', count: 198 },
        { id: 'clothing', label: 'Clothing', count: 89 },
        { id: 'other', label: 'Other', count: 78 },
      ],
    },
  ];

  const [filters, setFilters] = useState({
    propertyTypes: [] as PropertyType[],
    listingType: 'all' as 'all' | 'rent' | 'sale',
    priceRange: { min: 0, max: 10000 },
    beds: 0,
    baths: 0,
    amenities: [] as string[],
  });

  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      if (searchQuery && !prop.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !prop.location.city.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      if (selectedSubcategory?.propertyTypes && selectedSubcategory.propertyTypes.length > 0) {
        if (!selectedSubcategory.propertyTypes.includes(prop.propertyType)) {
          return false;
        }
      }

      if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(prop.propertyType)) {
        return false;
      }

      if (listingTypeFilter !== 'all' && prop.listingType !== listingTypeFilter) {
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
  }, [properties, searchQuery, filters, selectedSubcategory, listingTypeFilter]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setShowCategoryModal(false);
  };

  const handleSubcategorySelect = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    setShowSubcategoryModal(false);
  };



  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Discover</Text>
            <Text style={styles.subGreeting}>Find your perfect space</Text>
          </View>
          <TouchableOpacity 
            style={styles.roommatesButton}
            onPress={() => router.push('/(tabs)/(discover)/roommates' as any)}
          >
            <Users size={20} color="#2f95dc" />
            <Text style={styles.roommatesButtonText}>Find Roommates</Text>
          </TouchableOpacity>
        </View>



        <View style={styles.categoriesContainer}>
          {categories.map((category) => {
            const isActive = selectedCategory?.id === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  isActive && styles.categoryCardActive,
                ]}
                onPress={() => handleCategorySelect(category)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.categoryIconContainer,
                  isActive && styles.categoryIconContainerActive,
                ]}>
                  <Text style={styles.categoryEmoji}>{category.label.split(' ')[0]}</Text>
                </View>
                <Text style={[
                  styles.categoryLabel,
                  isActive && styles.categoryLabelActive,
                ]}>
                  {category.label.split(' ').slice(1).join(' ')}
                </Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            style={styles.searchIconButton}
            onPress={() => setShowSearchModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.searchIconContainer}>
              <Search size={24} color="#2f95dc" />
            </View>
            <Text style={styles.searchIconLabel}>Search</Text>
          </TouchableOpacity>
        </View>

        {selectedCategory?.id === 'properties' && (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.subcategoriesScroll}
              style={styles.subcategoriesContainer}
            >
              {selectedCategory.subcategories.map((subcategory) => {
                const isActive = selectedSubcategory?.id === subcategory.id;
                return (
                  <TouchableOpacity
                    key={subcategory.id}
                    style={[
                      styles.subcategoryChip,
                      isActive && styles.subcategoryChipActive,
                    ]}
                    onPress={() => handleSubcategorySelect(subcategory)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.subcategoryChipText,
                      isActive && styles.subcategoryChipTextActive,
                    ]}>
                      {subcategory.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              {selectedSubcategory && (
                <TouchableOpacity
                  style={styles.clearSubcategoryButton}
                  onPress={() => setSelectedSubcategory(null)}
                  activeOpacity={0.7}
                >
                  <X size={14} color="#666" />
                  <Text style={styles.clearSubcategoryText}>Clear</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
            <View style={styles.listingTypeRow}>
              <View style={styles.listingTypeToggle}>
                <TouchableOpacity
                  style={[
                    styles.listingTypeButton,
                    listingTypeFilter === 'sale' && styles.listingTypeButtonActive,
                  ]}
                  onPress={() => setListingTypeFilter('sale')}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.listingTypeButtonText,
                      listingTypeFilter === 'sale' && styles.listingTypeButtonTextActive,
                    ]}
                  >
                    For Sale
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.listingTypeButton,
                    listingTypeFilter === 'rent' && styles.listingTypeButtonActive,
                  ]}
                  onPress={() => setListingTypeFilter('rent')}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.listingTypeButtonText,
                      listingTypeFilter === 'rent' && styles.listingTypeButtonTextActive,
                    ]}
                  >
                    For Rent
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.viewSwitcher}
                onPress={() => {
                  setViewMode(current => {
                    if (current === 'list') return 'grid';
                    if (current === 'grid') return 'map';
                    return 'list';
                  });
                }}
                activeOpacity={0.7}
              >
                {viewMode === 'list' && <List size={20} color="#2f95dc" />}
                {viewMode === 'grid' && <LayoutGrid size={20} color="#2f95dc" />}
                {viewMode === 'map' && <MapPin size={20} color="#2f95dc" />}
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>



      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>{filteredProperties.length} properties</Text>
        {selectedSubcategory && (
          <View style={styles.activeFilterBadge}>
            <Text style={styles.activeFilterText}>{selectedSubcategory.label}</Text>
          </View>
        )}
      </View>

      <FlatList
        data={filteredProperties}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => router.push(`/property/${item.id}` as any)}
            style={styles.propertyCard}
          >
            <Image source={{ uri: item.images[0] }} style={styles.propertyImage} />
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                addToFavorites(item.id);
                setShowConfirmation(true);
                setTimeout(() => setShowConfirmation(false), 2000);
              }}
              style={styles.likeButtonOverlay}
              activeOpacity={0.7}
            >
              <Heart size={20} color="#fff" strokeWidth={2.5} />
            </TouchableOpacity>
            <View style={styles.propertyInfo}>
              <View style={styles.propertyHeader}>
                <Text style={styles.propertyPrice}>
                  ${item.price.toLocaleString()}<Text style={styles.pricePeriod}>/{item.listingType === 'rent' ? 'mo' : 'sale'}</Text>
                </Text>
                <View style={styles.propertyTypeBadge}>
                  <Text style={styles.propertyTypeText}>{PROPERTY_TYPES.find(t => t.value === item.propertyType)?.label}</Text>
                </View>
              </View>
              <Text style={styles.propertyTitle} numberOfLines={1}>{item.title}</Text>
              <View style={styles.propertyLocation}>
                <MapPin size={14} color="#666" />
                <Text style={styles.propertyLocationText} numberOfLines={1}>
                  {item.location.city}, {item.location.state}
                </Text>
              </View>
              <View style={styles.propertySpecs}>
                <View style={styles.propertySpec}>
                  <Bed size={16} color="#2f95dc" />
                  <Text style={styles.propertySpecText}>{item.specs.beds}</Text>
                </View>
                <View style={styles.propertySep} />
                <View style={styles.propertySpec}>
                  <Bath size={16} color="#2f95dc" />
                  <Text style={styles.propertySpecText}>{item.specs.baths}</Text>
                </View>
                <View style={styles.propertySep} />
                <View style={styles.propertySpec}>
                  <Maximize size={16} color="#2f95dc" />
                  <Text style={styles.propertySpecText}>{item.specs.sqft}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Store size={48} color="#ccc" />
            <Text style={styles.emptyText}>No properties found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters or search</Text>
          </View>
        }
      />

      <Modal
        visible={showCategoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setShowCategoryModal(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.categoryOption}
                    onPress={() => handleCategorySelect(category)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.categoryOptionLeft}>
                      <View style={styles.categoryIconBox}>
                        <Icon size={24} color="#2f95dc" />
                      </View>
                      <View>
                        <Text style={styles.categoryOptionLabel}>{category.label}</Text>
                        <Text style={styles.categoryOptionCount}>{category.count} listings</Text>
                      </View>
                    </View>
                    <ChevronRight size={20} color="#ccc" />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSubcategoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSubcategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Subcategory</Text>
              <TouchableOpacity onPress={() => setShowSubcategoryModal(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {selectedCategory?.subcategories.map((subcategory) => (
                <TouchableOpacity
                  key={subcategory.id}
                  style={styles.subcategoryOption}
                  onPress={() => handleSubcategorySelect(subcategory)}
                  activeOpacity={0.7}
                >
                  <View>
                    <Text style={styles.subcategoryOptionLabel}>{subcategory.label}</Text>
                    <Text style={styles.subcategoryOptionCount}>{subcategory.count} listings</Text>
                  </View>
                  <ChevronRight size={20} color="#ccc" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {showConfirmation && (
        <View style={styles.confirmation}>
          <Heart size={20} color="#fff" fill="#fff" />
          <Text style={styles.confirmationText}>Saved to favorites</Text>
        </View>
      )}

      <Modal
        visible={showSearchModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSearchModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search & Filters</Text>
              <TouchableOpacity onPress={() => setShowSearchModal(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.searchModalSection}>
                <View style={styles.searchModalBar}>
                  <Search size={20} color="#999" />
                  <TextInput
                    style={styles.searchModalInput}
                    placeholder="Search location, property..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus
                  />
                </View>
              </View>

              <View style={styles.filterDivider} />

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.resetButtonContainer}>
                  <TouchableOpacity 
                    style={styles.resetButton}
                    onPress={() => {
                      setFilters({
                        propertyTypes: [],
                        listingType: 'all',
                        priceRange: { min: 0, max: 10000 },
                        beds: 0,
                        baths: 0,
                        amenities: [],
                      });
                      setSearchQuery('');
                    }}
                  >
                    <Text style={styles.resetText}>Reset All</Text>
                  </TouchableOpacity>
                </View>

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
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowSearchModal(false)}
              >
                <Text style={styles.applyButtonText}>Show {filteredProperties.length} Results</Text>
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


  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
  },


  searchIconButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  searchIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchIconLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: '#666',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 60,
    marginTop: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  confirmation: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    backgroundColor: '#2f95dc',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#2f95dc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  confirmationText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600' as const,
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
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#4A90E2',
  },
  searchModalSection: {
    marginBottom: 16,
  },
  searchModalBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
  },
  searchModalInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  filterDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 16,
  },
  resetButtonContainer: {
    marginBottom: 16,
  },
  resetButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
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

  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 15,
    color: '#666',
    fontWeight: '400' as const,
  },
  roommatesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F4FF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  roommatesButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#2f95dc',
  },


  categoriesContainer: {
    marginTop: 20,
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  categoryCard: {
    alignItems: 'center',
    paddingVertical: 8,
    flex: 1,
  },
  categoryCardActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#1a1a1a',
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIconContainerActive: {
    backgroundColor: '#E8F4FF',
    borderWidth: 2,
    borderColor: '#2f95dc',
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: '#666',
  },
  categoryLabelActive: {
    color: '#1a1a1a',
    fontWeight: '600' as const,
  },

  subcategoriesContainer: {
    marginTop: 14,
    marginBottom: 8,
  },
  subcategoriesScroll: {
    paddingRight: 20,
  },
  subcategoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#f5f5f5',
  },
  subcategoryChipActive: {
    backgroundColor: '#E8F4FF',
    borderColor: '#2f95dc',
  },
  subcategoryChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#666',
  },
  subcategoryChipTextActive: {
    color: '#2f95dc',
    fontWeight: '700' as const,
  },
  clearSubcategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    marginRight: 10,
  },
  clearSubcategoryText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#666',
  },

  listingTypeRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
    alignItems: 'center',
  },
  listingTypeToggle: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  viewSwitcher: {
    width: 48,
    height: 48,
    backgroundColor: '#E8F4FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listingTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listingTypeButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listingTypeButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#666',
  },
  listingTypeButtonTextActive: {
    color: '#2f95dc',
    fontWeight: '700' as const,
  },



  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  resultsCount: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#1a1a1a',
  },
  activeFilterBadge: {
    backgroundColor: '#E8F4FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeFilterText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#2f95dc',
  },

  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  propertyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  propertyImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
  },
  likeButtonOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  propertyInfo: {
    padding: 16,
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  propertyPrice: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#1a1a1a',
  },
  pricePeriod: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: '#666',
  },
  propertyTypeBadge: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  propertyTypeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#666',
  },
  propertyTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  propertyLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  propertyLocationText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  propertySpecs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  propertySpec: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  propertySpecText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#333',
  },
  propertySep: {
    width: 1,
    height: 16,
    backgroundColor: '#e0e0e0',
  },

  categoryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  categoryOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  categoryIconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryOptionLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 2,
  },
  categoryOptionCount: {
    fontSize: 13,
    color: '#999',
    fontWeight: '400' as const,
  },

  subcategoryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  subcategoryOptionLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 2,
  },
  subcategoryOptionCount: {
    fontSize: 13,
    color: '#999',
    fontWeight: '400' as const,
  },
});
