import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronDown } from 'lucide-react-native';

export default function AddressScreen() {
  const router = useRouter();
  const [country, setCountry] = useState<string>('United States');
  const [street, setStreet] = useState<string>('');
  const [apt, setApt] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [zip, setZip] = useState<string>('');
  
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
            <View style={[styles.progressFill, { width: '87.5%' }]} />
          </View>
          <Text style={styles.progressText}>Step 7 of 8</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.stepLabel}>STEP 7 OF 8</Text>
        <Text style={styles.title}>Provide a few final details</Text>
        <Text style={styles.subtitle}>
          What&apos;s your residential address?
        </Text>
        <Text style={styles.note}>
          Guests won&apos;t see this information.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Country / region</Text>
          <TouchableOpacity style={styles.selectContainer}>
            <Text style={styles.selectText}>{country}</Text>
            <ChevronDown size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Street address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter street address"
            placeholderTextColor="#999"
            value={street}
            onChangeText={setStreet}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Apt, suite, unit (if applicable)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter apartment, suite, or unit"
            placeholderTextColor="#999"
            value={apt}
            onChangeText={setApt}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.halfSection}>
            <Text style={styles.sectionTitle}>City / town</Text>
            <TextInput
              style={styles.input}
              placeholder="City"
              placeholderTextColor="#999"
              value={city}
              onChangeText={setCity}
            />
          </View>

          <View style={styles.halfSection}>
            <Text style={styles.sectionTitle}>State / territory</Text>
            <TextInput
              style={styles.input}
              placeholder="State"
              placeholderTextColor="#999"
              value={state}
              onChangeText={setState}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ZIP code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter ZIP code"
            placeholderTextColor="#999"
            value={zip}
            onChangeText={setZip}
            keyboardType="numeric"
          />
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
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  note: {
    fontSize: 14,
    color: '#999',
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F8FA',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500' as const,
  },
  input: {
    backgroundColor: '#F5F8FA',
    padding: 16,
    borderRadius: 14,
    fontSize: 16,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  halfSection: {
    flex: 1,
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
