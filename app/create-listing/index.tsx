import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, Home } from 'lucide-react-native';
import { useRef } from 'react';
import { useListing } from '@/contexts/ListingContext';

export default function CreateListingIntro() {
  const router = useRouter();
  const { updateFormData, resetForm } = useListing();
  const homeButtonScale = useRef(new Animated.Value(1)).current;
  const closeButtonScale = useRef(new Animated.Value(1)).current;
  const startButtonScale = useRef(new Animated.Value(1)).current;

  const animateButton = (scale: Animated.Value, callback: () => void) => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.9,
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

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Animated.View style={{ transform: [{ scale: homeButtonScale }] }}>
          <TouchableOpacity 
            style={styles.homeButton} 
            onPress={() => animateButton(homeButtonScale, () => router.replace('/(tabs)/(discover)/discover' as any))}
            activeOpacity={0.8}
          >
            <Home size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={{ transform: [{ scale: closeButtonScale }] }}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => animateButton(closeButtonScale, () => router.back())}
            activeOpacity={0.8}
          >
            <X size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={styles.content}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400' }}
          style={styles.heroImage}
        />

        <Text style={styles.title}>It&apos;s easy to get started on PostIt</Text>
        <Text style={styles.subtitle}>Create your property listing in just a few simple steps</Text>

        <View style={styles.stepsContainer}>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Tell us what you are posting</Text>
              <Text style={styles.stepDescription}>Choose between property or job listing</Text>
            </View>
            <View style={styles.checkmark} />
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Add details and photos</Text>
              <Text style={styles.stepDescription}>Fill in the information and upload images</Text>
            </View>
            <View style={styles.checkmark} />
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Review and publish</Text>
              <Text style={styles.stepDescription}>Preview your listing and go live</Text>
            </View>
            <View style={styles.checkmark} />
          </View>
        </View>

        <Animated.View style={{ transform: [{ scale: startButtonScale }] }}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => animateButton(startButtonScale, () => {
              resetForm();
              updateFormData({ listingCategory: 'property' });
              router.push('/create-listing/steps' as any);
            })}
            activeOpacity={0.8}
          >
            <Text style={styles.getStartedButtonText}>Get Started</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 8,
  },
  homeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  stepsContainer: {
    gap: 20,
    marginBottom: 40,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#4A90E2',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  getStartedButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 32,
  },
  getStartedButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#fff',
  },
});
