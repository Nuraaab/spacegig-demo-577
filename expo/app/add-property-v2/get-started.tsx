import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Home, Briefcase } from 'lucide-react-native';
import { useState, useRef } from 'react';

type PostingType = 'property' | 'job';

export default function GetStartedScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<PostingType | null>(null);
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
    if (!selectedType) return;
    if (selectedType === 'property') {
      animateButton(nextButtonScale, () => {
        router.push('/add-property-v2/property-type' as any);
      });
    }
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

      <View style={styles.content}>
        <Text style={styles.title}>What are you posting?</Text>
        <Text style={styles.subtitle}>
          Choose the type of listing you want to create
        </Text>

        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={[
              styles.card,
              selectedType === 'property' && styles.cardSelected,
            ]}
            onPress={() => setSelectedType('property')}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Home size={48} color="#4A90E2" strokeWidth={1.5} />
            </View>
            <Text style={styles.cardTitle}>Property</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.card,
              selectedType === 'job' && styles.cardSelected,
            ]}
            onPress={() => setSelectedType('job')}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Briefcase size={48} color="#4A90E2" strokeWidth={1.5} />
            </View>
            <Text style={styles.cardTitle}>Job</Text>
          </TouchableOpacity>
        </View>
      </View>

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
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 12,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 48,
    lineHeight: 24,
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    gap: 16,
  },
  cardSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#F0F8FF',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
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
