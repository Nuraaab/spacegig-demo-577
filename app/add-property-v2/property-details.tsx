import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, TextInput, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Bed, Bath, Maximize, MapPin, DollarSign, Home as HomeIcon } from 'lucide-react-native';

export default function PropertyDetailsScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams();
  const [listingType, setListingType] = useState<'rent' | 'sale'>('rent');
  const [beds, setBeds] = useState<number>(1);
  const [baths, setBaths] = useState<number>(1);
  const [den, setDen] = useState<number>(0);
  const [sqft, setSqft] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  
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
            <View style={[styles.progressFill, { width: '50%' }]} />
          </View>
          <Text style={styles.progressText}>Step 2 of 4</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Tell us about your {type}</Text>
        <Text style={styles.subtitle}>
          Provide key details that will help potential tenants or buyers
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Listing Type</Text>
          <View style={styles.switchContainer}>
            <Text style={[styles.switchLabel, listingType === 'sale' && styles.switchLabelActive]}>
              For Sale
            </Text>
            <Switch
              value={listingType === 'rent'}
              onValueChange={(value) => setListingType(value ? 'rent' : 'sale')}
              trackColor={{ false: '#4A90E2', true: '#4A90E2' }}
              thumbColor="#fff"
            />
            <Text style={[styles.switchLabel, listingType === 'rent' && styles.switchLabelActive]}>
              For Rent
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Specifications</Text>
          
          <View style={styles.counterRow}>
            <View style={styles.counterItem}>
              <Bed size={24} color="#4A90E2" />
              <Text style={styles.counterLabel}>Bedrooms</Text>
              <View style={styles.counterControls}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setBeds(Math.max(0, beds - 1))}
                >
                  <Text style={styles.counterButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{beds}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setBeds(beds + 1)}
                >
                  <Text style={styles.counterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.counterItem}>
              <Bath size={24} color="#4A90E2" />
              <Text style={styles.counterLabel}>Bathrooms</Text>
              <View style={styles.counterControls}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setBaths(Math.max(0, baths - 0.5))}
                >
                  <Text style={styles.counterButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{baths}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setBaths(baths + 0.5)}
                >
                  <Text style={styles.counterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.counterRow}>
            <View style={styles.counterItem}>
              <HomeIcon size={24} color="#4A90E2" />
              <Text style={styles.counterLabel}>Den</Text>
              <View style={styles.counterControls}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setDen(Math.max(0, den - 1))}
                >
                  <Text style={styles.counterButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{den}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setDen(den + 1)}
                >
                  <Text style={styles.counterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.counterItem}>
              <Maximize size={24} color="#4A90E2" />
              <Text style={styles.counterLabel}>Square Feet</Text>
              <TextInput
                style={styles.sqftInput}
                placeholder="e.g. 1200"
                placeholderTextColor="#999"
                value={sqft}
                onChangeText={setSqft}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.inputContainer}>
            <MapPin size={20} color="#4A90E2" />
            <TextInput
              style={styles.input}
              placeholder="Enter address or neighborhood"
              placeholderTextColor="#999"
              value={location}
              onChangeText={setLocation}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {listingType === 'rent' ? 'Monthly Rent' : 'Sale Price'}
          </Text>
          <View style={styles.priceContainer}>
            <DollarSign size={28} color="#4A90E2" />
            <TextInput
              style={styles.priceInput}
              placeholder="0"
              placeholderTextColor="#D1D5DB"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
            {listingType === 'rent' && (
              <Text style={styles.priceUnit}>/month</Text>
            )}
          </View>
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F8FA',
    padding: 16,
    borderRadius: 14,
    gap: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#666',
  },
  switchLabelActive: {
    fontWeight: '600' as const,
    color: '#1a1a1a',
  },
  counterRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  counterItem: {
    flex: 1,
    backgroundColor: '#F5F8FA',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    gap: 8,
  },
  counterLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#666',
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  counterButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1a1a1a',
  },
  counterValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    minWidth: 32,
    textAlign: 'center',
  },
  sqftInput: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 80,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8FA',
    padding: 16,
    borderRadius: 14,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F8FA',
    padding: 24,
    borderRadius: 14,
    gap: 8,
  },
  priceInput: {
    fontSize: 40,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    minWidth: 120,
    textAlign: 'center',
  },
  priceUnit: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#666',
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
