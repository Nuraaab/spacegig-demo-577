import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Wifi, 
  Car, 
  Wind, 
  Waves, 
  Dumbbell, 
  Shirt, 
  Tv, 
  UtensilsCrossed,
  PawPrint,
  Cigarette,
  Flame,
  Snowflake,
  Zap,
  Droplets,
  Shield,
  Camera
} from 'lucide-react-native';

type Amenity = {
  id: string;
  name: string;
  icon: any;
  color: string;
};

export default function AmenitiesScreen() {
  const router = useRouter();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
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

  const amenities: Amenity[] = [
    { id: 'wifi', name: 'WiFi', icon: Wifi, color: '#4A90E2' },
    { id: 'parking', name: 'Parking', icon: Car, color: '#7B68EE' },
    { id: 'ac', name: 'Air Conditioning', icon: Wind, color: '#00BCD4' },
    { id: 'pool', name: 'Pool', icon: Waves, color: '#2196F3' },
    { id: 'gym', name: 'Gym', icon: Dumbbell, color: '#FF6B9D' },
    { id: 'laundry', name: 'Laundry', icon: Shirt, color: '#9C27B0' },
    { id: 'tv', name: 'TV', icon: Tv, color: '#607D8B' },
    { id: 'dishwasher', name: 'Dishwasher', icon: UtensilsCrossed, color: '#FF9800' },
    { id: 'pets', name: 'Pet Friendly', icon: PawPrint, color: '#8BC34A' },
    { id: 'smoking', name: 'Smoking Allowed', icon: Cigarette, color: '#795548' },
    { id: 'heating', name: 'Heating', icon: Flame, color: '#FF5722' },
    { id: 'cooling', name: 'Cooling', icon: Snowflake, color: '#03A9F4' },
    { id: 'electricity', name: 'Electricity Included', icon: Zap, color: '#FFC107' },
    { id: 'water', name: 'Water Included', icon: Droplets, color: '#00BCD4' },
    { id: 'security', name: 'Security System', icon: Shield, color: '#F44336' },
    { id: 'surveillance', name: 'Surveillance', icon: Camera, color: '#9E9E9E' },
  ];

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev => 
      prev.includes(id) 
        ? prev.filter(a => a !== id)
        : [...prev, id]
    );
  };

  const handleNext = () => {
    animateButton(nextButtonScale, () => {
      router.push('/add-property-v2/photos' as any);
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
            <View style={[styles.progressFill, { width: '60%' }]} />
          </View>
          <Text style={styles.progressText}>Step 3 of 5</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>What amenities does your property have?</Text>
        <Text style={styles.subtitle}>
          Select all that apply. This helps tenants find the perfect match.
        </Text>

        <View style={styles.selectedCount}>
          <Text style={styles.selectedCountText}>
            {selectedAmenities.length} {selectedAmenities.length === 1 ? 'amenity' : 'amenities'} selected
          </Text>
        </View>

        <View style={styles.amenitiesGrid}>
          {amenities.map((amenity) => {
            const Icon = amenity.icon;
            const isSelected = selectedAmenities.includes(amenity.id);
            
            return (
              <TouchableOpacity
                key={amenity.id}
                style={[
                  styles.amenityCard,
                  isSelected && styles.amenityCardSelected,
                ]}
                onPress={() => toggleAmenity(amenity.id)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.iconContainer, 
                  { backgroundColor: isSelected ? amenity.color : '#F5F8FA' }
                ]}>
                  <Icon 
                    size={22} 
                    color={isSelected ? '#fff' : amenity.color} 
                    strokeWidth={2} 
                  />
                </View>
                <Text style={[
                  styles.amenityName,
                  isSelected && styles.amenityNameSelected
                ]}>
                  {amenity.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>💡 Pro Tip</Text>
          <Text style={styles.tipText}>
            Properties with more amenities typically receive 40% more inquiries. Be thorough and accurate!
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Animated.View style={{ flex: 1, transform: [{ scale: nextButtonScale }] }}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.9}
          >
            <Text style={styles.nextButtonText}>Continue</Text>
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
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  selectedCount: {
    backgroundColor: '#F0F8FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  selectedCountText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#4A90E2',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  amenityCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    gap: 10,
  },
  amenityCardSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#F0F8FF',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amenityName: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#666',
    textAlign: 'center',
  },
  amenityNameSelected: {
    color: '#1a1a1a',
  },
  tipBox: {
    backgroundColor: '#F0F8FF',
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6EBFF',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
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
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#fff',
  },
});
