import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  X,
  Heart,
  MapPin,
  DollarSign,
  Briefcase,
  Building,
  Home,
  TrendingUp,
  Zap,
  Crown,
  Eye,
} from 'lucide-react-native';
import { mockJobs } from '@/mocks/jobs';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function JobDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const homeButtonScale = useRef(new Animated.Value(1)).current;
  const closeButtonScale = useRef(new Animated.Value(1)).current;
  const favoriteButtonScale = useRef(new Animated.Value(1)).current;
  const applyButtonScale = useRef(new Animated.Value(1)).current;

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

  const job = mockJobs.find((j) => j.id === id);

  if (!job) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.homeButton} onPress={() => router.replace('/onboarding')}>
            <Home size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <X size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Job not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setCurrentImageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {job.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.image} />
            ))}
          </ScrollView>

          <View style={styles.imageIndicator}>
            {job.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentImageIndex && styles.activeDot,
                ]}
              />
            ))}
          </View>

          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Animated.View style={{ transform: [{ scale: homeButtonScale }] }}>
                <TouchableOpacity 
                  style={styles.homeButton} 
                  onPress={() => animateButton(homeButtonScale, () => router.replace('/onboarding'))}
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
            <Animated.View style={{ transform: [{ scale: favoriteButtonScale }] }}>
              <TouchableOpacity 
                style={styles.favoriteButton} 
                onPress={() => animateButton(favoriteButtonScale, handleToggleFavorite)}
                activeOpacity={0.8}
              >
                <Heart
                  size={24}
                  color={isFavorite ? '#FF6B6B' : '#1a1a1a'}
                  fill={isFavorite ? '#FF6B6B' : 'transparent'}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.salaryRow}>
            <View style={styles.salaryTag}>
              <DollarSign size={18} color="#fff" />
              <Text style={styles.salary}>
                ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
              </Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{job.jobType}</Text>
            </View>
          </View>

          <Text style={styles.title}>{job.title}</Text>

          <View style={styles.companyRow}>
            <Building size={18} color="#10B981" />
            <Text style={styles.company}>{job.company}</Text>
          </View>

          <View style={styles.locationRow}>
            <MapPin size={18} color="#666" />
            <Text style={styles.location}>
              {job.location.city}, {job.location.state}
              {job.location.remote && ' • Remote'}
            </Text>
          </View>

          <View style={styles.jobTypeContainer}>
            <View style={styles.jobTypeBadge}>
              <Briefcase size={16} color="#10B981" />
              <Text style={styles.jobTypeText}>{job.jobType}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{job.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            {job.requirements.map((req, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>{req}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Benefits</Text>
            <View style={styles.benefitsContainer}>
              {job.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitChip}>
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>

          {job.boost && job.boost.tier !== 'none' && (
            <View style={styles.boostSection}>
              <View style={styles.boostHeader}>
                <View style={[styles.boostBadge, styles[`boost${job.boost.tier.charAt(0).toUpperCase() + job.boost.tier.slice(1)}` as keyof typeof styles]]}>
                  {job.boost.tier === 'basic' && <TrendingUp size={16} color="#4A90E2" />}
                  {job.boost.tier === 'featured' && <Zap size={16} color="#F59E0B" />}
                  {job.boost.tier === 'premium' && <Crown size={16} color="#8B5CF6" />}
                  <Text style={[styles.boostBadgeText, styles[`boost${job.boost.tier.charAt(0).toUpperCase() + job.boost.tier.slice(1)}Text` as keyof typeof styles]]}>
                    {job.boost.tier.charAt(0).toUpperCase() + job.boost.tier.slice(1)} Boost
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.boostAnalyticsButton}
                  onPress={() => console.log('View analytics')}
                >
                  <Eye size={16} color="#666" />
                  <Text style={styles.boostAnalyticsText}>
                    {job.boost.views || 0} views
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.boostStats}>
                <View style={styles.boostStat}>
                  <Text style={styles.boostStatLabel}>Impressions</Text>
                  <Text style={styles.boostStatValue}>{job.boost.impressions || 0}</Text>
                </View>
                <View style={styles.boostStat}>
                  <Text style={styles.boostStatLabel}>Active Until</Text>
                  <Text style={styles.boostStatValue}>
                    {job.boost.endDate ? new Date(job.boost.endDate).toLocaleDateString() : 'N/A'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity 
            style={styles.boostListingButton}
            onPress={() => console.log('Boost job listing')}
            activeOpacity={0.8}
          >
            <TrendingUp size={20} color="#fff" />
            <Text style={styles.boostListingButtonText}>Boost This Job</Text>
          </TouchableOpacity>

          <Animated.View style={{ transform: [{ scale: applyButtonScale }] }}>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => animateButton(applyButtonScale, () => {})}
              activeOpacity={0.8}
            >
              <Text style={styles.applyButtonText}>Apply Now</Text>
            </TouchableOpacity>
          </Animated.View>
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
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  image: {
    width: SCREEN_WIDTH,
    height: 300,
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 24,
  },
  header: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    gap: 8,
  },
  homeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    padding: 20,
  },
  salaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  salaryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  salary: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
  badge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#10B981',
    textTransform: 'capitalize' as const,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  company: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#10B981',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  location: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  jobTypeContainer: {
    marginBottom: 24,
  },
  jobTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  jobTypeText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#10B981',
    textTransform: 'capitalize' as const,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingRight: 20,
  },
  bullet: {
    fontSize: 16,
    color: '#10B981',
    marginRight: 8,
    fontWeight: '700' as const,
  },
  listText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  benefitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  benefitChip: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  benefitText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500' as const,
  },
  applyButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
  boostSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  boostHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  boostBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  boostBasic: {
    backgroundColor: '#EFF6FF',
  },
  boostFeatured: {
    backgroundColor: '#FEF3C7',
  },
  boostPremium: {
    backgroundColor: '#F3E8FF',
  },
  boostBadgeText: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  boostBasicText: {
    color: '#4A90E2',
  },
  boostFeaturedText: {
    color: '#F59E0B',
  },
  boostPremiumText: {
    color: '#8B5CF6',
  },
  boostAnalyticsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  boostAnalyticsText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#666',
  },
  boostStats: {
    flexDirection: 'row',
    gap: 12,
  },
  boostStat: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
  },
  boostStatLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  boostStatValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1a1a1a',
  },
  boostListingButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  boostListingButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#fff',
  },
});
