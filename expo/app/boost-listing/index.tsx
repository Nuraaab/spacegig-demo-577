import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { TrendingUp, Zap, Star, Crown, ArrowRight, Home, Briefcase } from 'lucide-react-native';
import { mockProperties } from '@/mocks/properties';
import { mockJobs } from '@/mocks/jobs';

interface BoostOption {
  tier: 'basic' | 'featured' | 'premium';
  name: string;
  price: number;
  duration: number;
  features: string[];
  icon: typeof Zap;
  color: string;
  bgColor: string;
  borderColor: string;
}

const BOOST_OPTIONS: BoostOption[] = [
  {
    tier: 'basic',
    name: 'Basic Boost',
    price: 29.99,
    duration: 7,
    features: [
      'Appear in top 20% of listings',
      '2x more views',
      '7 days visibility',
      'Basic analytics'
    ],
    icon: Zap,
    color: '#4A90E2',
    bgColor: '#E8F4FF',
    borderColor: '#4A90E2',
  },
  {
    tier: 'featured',
    name: 'Featured Boost',
    price: 49.99,
    duration: 14,
    features: [
      'Featured badge',
      'Top 10% placement',
      '5x more views',
      '14 days visibility',
      'Priority support'
    ],
    icon: Star,
    color: '#FF6B6B',
    bgColor: '#FFE8E8',
    borderColor: '#FF6B6B',
  },
  {
    tier: 'premium',
    name: 'Premium Boost',
    price: 99.99,
    duration: 30,
    features: [
      'Premium badge',
      'Always in top 5',
      '10x more views',
      '30 days visibility',
      'Dedicated support',
      'Detailed analytics'
    ],
    icon: Crown,
    color: '#FFD700',
    bgColor: '#FFF9E6',
    borderColor: '#FFD700',
  },
];

export default function BoostListingScreen() {
  const router = useRouter();
  const { id, type } = useLocalSearchParams();

  const listing = type === 'properties' 
    ? mockProperties.find(p => p.id === id)
    : mockJobs.find(j => j.id === id);

  if (!listing) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Listing not found</Text>
      </SafeAreaView>
    );
  }

  const handleSelectTier = (tier: 'basic' | 'featured' | 'premium') => {
    router.push(`/boost-listing/steps?id=${id}&type=${type}&tier=${tier}` as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <TrendingUp size={48} color="#4A90E2" />
          </View>
          <Text style={styles.title}>Boost Your Listing</Text>
          <Text style={styles.subtitle}>
            Get more visibility and reach more potential customers with our boost plans
          </Text>
        </View>

        <View style={styles.listingPreview}>
          {type === 'properties' && 'images' in listing ? (
            <Image source={{ uri: listing.images[0] }} style={styles.previewImage} />
          ) : (
            <View style={styles.jobImagePlaceholder}>
              <Briefcase size={32} color="#4A90E2" />
            </View>
          )}
          <View style={styles.previewContent}>
            <Text style={styles.previewTitle} numberOfLines={1}>
              {'title' in listing ? listing.title : ''}
            </Text>
            <Text style={styles.previewSubtitle}>
              {type === 'properties' && 'location' in listing
                ? `${listing.location.city}, ${listing.location.state}`
                : 'company' in listing ? listing.company : ''}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Choose Your Boost Plan</Text>

        {BOOST_OPTIONS.map((option) => {
          const Icon = option.icon;
          
          return (
            <TouchableOpacity
              key={option.tier}
              style={styles.boostCard}
              onPress={() => handleSelectTier(option.tier)}
              activeOpacity={0.7}
            >
              <View style={[styles.boostIconContainer, { backgroundColor: option.bgColor }]}>
                <Icon size={32} color={option.color} />
              </View>
              
              <View style={styles.boostContent}>
                <View style={styles.boostHeader}>
                  <Text style={styles.boostName}>{option.name}</Text>
                  <View style={[styles.durationBadge, { backgroundColor: option.bgColor }]}>
                    <Text style={[styles.durationText, { color: option.color }]}>
                      {option.duration} days
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.boostPrice}>${option.price}</Text>
                
                <View style={styles.featuresContainer}>
                  {option.features.map((feature, idx) => (
                    <View key={idx} style={styles.featureRow}>
                      <Text style={styles.featureBullet}>✓</Text>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <ArrowRight size={24} color="#999" />
            </TouchableOpacity>
          );
        })}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>How boosting works:</Text>
          <Text style={styles.infoText}>
            • Your listing appears higher in search results{'\n'}
            • Gets shown to more potential customers{'\n'}
            • Includes special badges to stand out{'\n'}
            • Detailed analytics to track performance{'\n'}
            • Cancel anytime with prorated refund
          </Text>
        </View>
      </ScrollView>
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
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  scrollContent: {
    padding: 20,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
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
  },
  listingPreview: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 32,
    alignItems: 'center',
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  jobImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContent: {
    flex: 1,
    marginLeft: 12,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  previewSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 20,
  },
  boostCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  boostIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  boostContent: {
    flex: 1,
  },
  boostHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  boostName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1a1a1a',
  },
  durationBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  boostPrice: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#4A90E2',
    marginBottom: 12,
  },
  featuresContainer: {
    gap: 6,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureBullet: {
    fontSize: 14,
    color: '#4A90E2',
    marginRight: 8,
    fontWeight: '700' as const,
  },
  featureText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  infoBox: {
    backgroundColor: '#F0F8FF',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});
