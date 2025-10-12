import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, Home, CheckCircle } from 'lucide-react-native';
import { useRef } from 'react';

export default function GetStartedScreen() {
  const router = useRouter();
  const homeButtonScale = useRef(new Animated.Value(1)).current;
  const closeButtonScale = useRef(new Animated.Value(1)).current;
  const startButtonScale = useRef(new Animated.Value(1)).current;

  const animateButton = (scale: Animated.Value, callback: () => void) => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.92,
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
            style={styles.iconButton} 
            onPress={() => animateButton(homeButtonScale, () => router.replace('/onboarding'))}
            activeOpacity={0.8}
          >
            <Home size={20} color="#4A90E2" />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={{ transform: [{ scale: closeButtonScale }] }}>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={() => animateButton(closeButtonScale, () => router.back())}
            activeOpacity={0.8}
          >
            <X size={20} color="#666" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={styles.content}>
        <View style={styles.heroSection}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800' }}
            style={styles.heroImage}
          />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Quick & Easy</Text>
          </View>
        </View>

        <Text style={styles.title}>List Your Property in Minutes</Text>
        <Text style={styles.subtitle}>
          Join thousands of property owners who trust us to connect them with the right tenants and buyers
        </Text>

        <View style={styles.stepsContainer}>
          <View style={styles.stepItem}>
            <View style={styles.stepIconContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Choose Property Type</Text>
              <Text style={styles.stepDescription}>Select from apartment, condo, room, or house</Text>
            </View>
            <CheckCircle size={20} color="#4CAF50" />
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepIconContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Add Property Details</Text>
              <Text style={styles.stepDescription}>Provide specifications, location, and pricing</Text>
            </View>
            <CheckCircle size={20} color="#4CAF50" />
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepIconContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Select Amenities</Text>
              <Text style={styles.stepDescription}>Choose available features and amenities</Text>
            </View>
            <CheckCircle size={16} color="#4CAF50" />
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepIconContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Upload Photos</Text>
              <Text style={styles.stepDescription}>Showcase your property with quality images</Text>
            </View>
            <CheckCircle size={16} color="#4CAF50" />
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepIconContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>5</Text>
              </View>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Review & Publish</Text>
              <Text style={styles.stepDescription}>Preview and publish your listing</Text>
            </View>
            <CheckCircle size={16} color="#4CAF50" />
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Your listing will be reviewed within 24 hours and go live once approved
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Animated.View style={{ flex: 1, transform: [{ scale: startButtonScale }] }}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => animateButton(startButtonScale, () => {
              router.push('/add-property-v2/property-type' as any);
            })}
            activeOpacity={0.9}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F8FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroSection: {
    position: 'relative',
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: 220,
    borderRadius: 20,
  },
  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: '#fff',
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
    marginBottom: 32,
    lineHeight: 24,
  },
  stepsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  stepIconContainer: {
    width: 48,
    height: 48,
  },
  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 20,
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
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  getStartedButton: {
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
  getStartedButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#fff',
  },
});
