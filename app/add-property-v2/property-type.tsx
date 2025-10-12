import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Home, Building, Building2, MapPin, Warehouse, DoorOpen } from 'lucide-react-native';

type PropertyType = 'house' | 'apartment' | 'condo' | 'land' | 'basement' | 'room';
type ListingType = 'rent' | 'sale';

export default function PropertyTypeScreen() {
  const router = useRouter();
  const [listingType, setListingType] = useState<ListingType>('rent');
  const [selectedType, setSelectedType] = useState<PropertyType | null>(null);
  const backButtonScale = useRef(new Animated.Value(1)).current;
  const nextButtonScale = useRef(new Animated.Value(1)).current;

  const animateButton = (scale: Animated.Value, callback: () => void) => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.95,
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

  const basePropertyTypes = [
    {
      id: 'house' as PropertyType,
      title: 'House',
      icon: Home,
    },
    {
      id: 'apartment' as PropertyType,
      title: 'Apartment',
      icon: Building,
    },
    {
      id: 'condo' as PropertyType,
      title: 'Condo',
      icon: Building2,
    },
    {
      id: 'land' as PropertyType,
      title: 'Land',
      icon: MapPin,
    },
  ];

  const rentOnlyTypes = [
    {
      id: 'basement' as PropertyType,
      title: 'Basement',
      icon: Warehouse,
    },
    {
      id: 'room' as PropertyType,
      title: 'Room',
      icon: DoorOpen,
    },
  ];

  const propertyTypes = listingType === 'rent' 
    ? [...basePropertyTypes, ...rentOnlyTypes]
    : basePropertyTypes;

  const handleNext = () => {
    if (!selectedType) return;
    animateButton(nextButtonScale, () => {
      router.push(`/add-property-v2/property-details?type=${selectedType}&listingType=${listingType}` as any);
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Animated.View style={{ transform: [{ scale: backButtonScale }] }}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => animateButton(backButtonScale, () => router.back())}
            activeOpacity={0.8}
          >
            <ChevronLeft size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </Animated.View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '12.5%' }]} />
          </View>
          <Text style={styles.progressText}>Step 1 of 8</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.stepLabel}>STEP 1 OF 8</Text>
        <Text style={styles.title}>What type of property?</Text>
        <Text style={styles.subtitle}>
          Choose the property type you&apos;re listing
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Listing Type</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleOption,
                styles.toggleOptionLeft,
                listingType === 'sale' && styles.toggleOptionActive,
              ]}
              onPress={() => setListingType('sale')}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.toggleText,
                listingType === 'sale' && styles.toggleTextActive,
              ]}>
                Sale
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleOption,
                styles.toggleOptionRight,
                listingType === 'rent' && styles.toggleOptionActive,
              ]}
              onPress={() => setListingType('rent')}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.toggleText,
                listingType === 'rent' && styles.toggleTextActive,
              ]}>
                Rent
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Type</Text>
          <View style={styles.grid}>
            {propertyTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.propertyCard,
                    isSelected && styles.propertyCardSelected,
                  ]}
                  onPress={() => setSelectedType(type.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.iconContainer}>
                    <Icon size={40} color="#4A90E2" strokeWidth={1.5} />
                  </View>
                  <Text style={styles.cardTitle}>{type.title}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Animated.View style={{ flex: 1, transform: [{ scale: nextButtonScale }] }}>
          <TouchableOpacity
            style={[styles.nextButton, !selectedType && styles.nextButtonDisabled]}
            onPress={handleNext}
            activeOpacity={0.9}
            disabled={!selectedType}
          >
            <Text style={[styles.nextButtonText, !selectedType && styles.nextButtonTextDisabled]}>
              Next
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F8FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E8F4FF',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#999',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F8FA',
    borderRadius: 12,
    padding: 4,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  toggleOptionLeft: {
    marginRight: 2,
  },
  toggleOptionRight: {
    marginLeft: 2,
  },
  toggleOptionActive: {
    backgroundColor: '#4A90E2',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#666',
  },
  toggleTextActive: {
    color: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  propertyCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    gap: 12,
  },
  propertyCardSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#F0F8FF',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  nextButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonDisabled: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#fff',
  },
  nextButtonTextDisabled: {
    color: '#9CA3AF',
  },
});
