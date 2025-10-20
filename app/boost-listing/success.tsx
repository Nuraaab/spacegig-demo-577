import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CheckCircle2, TrendingUp, Home } from 'lucide-react-native';
import { useEffect, useRef } from 'react';

export default function BoostSuccessScreen() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleViewListings = () => {
    router.push('/(tabs)/(listings)/listings' as any);
  };

  const handleGoHome = () => {
    router.push('/(tabs)/(discover)/discover' as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.iconContainer,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <CheckCircle2 size={80} color="#4CAF50" fill="#4CAF50" />
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <Text style={styles.title}>Boost Activated!</Text>
          <Text style={styles.subtitle}>
            Your listing is now boosted and will appear higher in search results
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <TrendingUp size={32} color="#4A90E2" />
              <Text style={styles.statValue}>5-10x</Text>
              <Text style={styles.statLabel}>More Visibility</Text>
            </View>
            <View style={styles.statCard}>
              <CheckCircle2 size={32} color="#4CAF50" />
              <Text style={styles.statValue}>Priority</Text>
              <Text style={styles.statLabel}>Placement</Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>What happens next?</Text>
            <Text style={styles.infoItem}>✓ Your listing is now live with boost</Text>
            <Text style={styles.infoItem}>✓ Track performance in analytics</Text>
            <Text style={styles.infoItem}>✓ Get notified of inquiries instantly</Text>
            <Text style={styles.infoItem}>✓ Manage your boost anytime</Text>
          </View>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleViewListings}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>View My Listings</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleGoHome}
          activeOpacity={0.8}
        >
          <Home size={20} color="#4A90E2" />
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  statCard: {
    backgroundColor: '#f9f9f9',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#F0F8FF',
    padding: 24,
    borderRadius: 16,
    width: '100%',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 16,
  },
  infoItem: {
    fontSize: 15,
    color: '#666',
    lineHeight: 28,
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#fff',
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#4A90E2',
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#4A90E2',
  },
});
