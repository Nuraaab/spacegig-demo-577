import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Edit3 } from 'lucide-react-native';

export default function LocationPriceScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<string>('');
  const [price, setPrice] = useState<string>('0');
  
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
      router.push('/add-property-v2/description' as any);
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
          <Text style={styles.progressText}>Step 4 of 8</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.stepLabel}>STEP 4 OF 8</Text>
        <Text style={styles.title}>Location & Price</Text>
        <Text style={styles.subtitle}>
          Where is your property located and what&apos;s the price?
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.inputContainer}>
            <MapPin size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Search for a location"
              placeholderTextColor="#999"
              value={location}
              onChangeText={setLocation}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Now, set a monthly price</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <Text style={styles.priceValue}>{price}</Text>
            <TouchableOpacity style={styles.editButton}>
              <Edit3 size={20} color="#666" />
            </TouchableOpacity>
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
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 12,
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
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F8FA',
    padding: 32,
    borderRadius: 14,
    gap: 8,
  },
  dollarSign: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: '#1a1a1a',
  },
  priceValue: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    flex: 1,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
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
