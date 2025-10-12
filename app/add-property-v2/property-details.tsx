import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Bed, Bath, Home as HomeIcon, Maximize2, Check } from 'lucide-react-native';

export default function PropertyDetailsScreen() {
  const router = useRouter();
  const { type, listingType } = useLocalSearchParams();
  const [beds, setBeds] = useState<number>(1);
  const [baths, setBaths] = useState<number>(1);
  const [den, setDen] = useState<number>(0);
  const [furnished, setFurnished] = useState<'furnished' | 'unfurnished'>('unfurnished');
  const [sqft, setSqft] = useState<string>('');
  
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
      router.push('/add-property-v2/location-price' as any);
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
            <View style={[styles.progressFill, { width: '37.5%' }]} />
          </View>
          <Text style={styles.progressText}>Step 3 of 8</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.stepLabel}>STEP 3 OF 8</Text>
        <Text style={styles.title}>Property specifications</Text>
        <Text style={styles.subtitle}>
          Tell us about the size and features
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Beds</Text>
          <View style={styles.counterContainer}>
            <Bed size={20} color="#666" />
            <Text style={styles.counterValue}>{beds}</Text>
            <View style={styles.counterControls}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setBeds(Math.max(0, beds - 1))}
              >
                <Text style={styles.counterButtonText}>−</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setBeds(beds + 1)}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Baths</Text>
          <View style={styles.counterContainer}>
            <Bath size={20} color="#666" />
            <Text style={styles.counterValue}>{baths}</Text>
            <View style={styles.counterControls}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setBaths(Math.max(0, baths - 1))}
              >
                <Text style={styles.counterButtonText}>−</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setBaths(baths + 1)}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Den</Text>
          <View style={styles.counterContainer}>
            <HomeIcon size={20} color="#666" />
            <Text style={styles.counterValue}>{den}</Text>
            <View style={styles.counterControls}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setDen(Math.max(0, den - 1))}
              >
                <Text style={styles.counterButtonText}>−</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setDen(den + 1)}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.furnishingRow}>
            <Text style={styles.sectionTitle}>Furnishing</Text>
            <TouchableOpacity
              style={styles.modernToggle}
              onPress={() => setFurnished(furnished === 'furnished' ? 'unfurnished' : 'furnished')}
              activeOpacity={0.8}
            >
              <Animated.View style={[
                styles.toggleTrack,
                furnished === 'furnished' && styles.toggleTrackActive,
              ]}>
                <Animated.View style={[
                  styles.toggleThumb,
                  furnished === 'furnished' && styles.toggleThumbActive,
                ]}>
                  {furnished === 'furnished' && (
                    <Check size={16} color="#00C853" strokeWidth={3} />
                  )}
                </Animated.View>
              </Animated.View>
            </TouchableOpacity>
          </View>
          <Text style={styles.furnishingLabel}>
            {furnished === 'furnished' ? 'Furnished' : 'Unfurnished'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Size (sq ft)</Text>
          <View style={styles.inputContainer}>
            <Maximize2 size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="e.g. 1500"
              placeholderTextColor="#999"
              value={sqft}
              onChangeText={setSqft}
              keyboardType="numeric"
            />
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
            <Text style={styles.nextButtonText}>Next</Text>
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8FA',
    padding: 20,
    borderRadius: 14,
    gap: 16,
  },
  counterValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    flex: 1,
  },
  counterControls: {
    flexDirection: 'row',
    gap: 12,
  },
  counterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  counterButtonText: {
    fontSize: 24,
    fontWeight: '400' as const,
    color: '#1a1a1a',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8FA',
    padding: 20,
    borderRadius: 14,
    gap: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500' as const,
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
  furnishingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  furnishingLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500' as const,
  },
  modernToggle: {
    width: 60,
    height: 34,
  },
  toggleTrack: {
    width: 60,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    padding: 2,
  },
  toggleTrackActive: {
    backgroundColor: '#00C853',
  },
  toggleThumb: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
});
