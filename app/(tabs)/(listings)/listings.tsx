import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Home, Briefcase, TrendingUp, X, Zap, Star, Crown, Calendar, Eye, BarChart3 } from 'lucide-react-native';
import { mockProperties, Property } from '@/mocks/properties';
import { mockJobs, Job } from '@/mocks/jobs';
import { useApp } from '@/contexts/AppContext';

type TabType = 'properties' | 'jobs';
type BoostTier = 'none' | 'basic' | 'featured' | 'premium';

interface BoostOption {
  tier: BoostTier;
  name: string;
  price: number;
  duration: number;
  features: string[];
  icon: typeof Zap;
  color: string;
  bgColor: string;
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
  },
];

export default function MyListingsScreen() {
  const router = useRouter();
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('properties');
  const [boostModalVisible, setBoostModalVisible] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Property | Job | null>(null);
  const [selectedBoostTier, setSelectedBoostTier] = useState<BoostTier>('basic');

  const userProperties = mockProperties.filter(p => p.ownerId === user?.id || Math.random() > 0.5);
  const userJobs = mockJobs.filter(j => j.ownerId === user?.id || Math.random() > 0.7);

  const handleBoostPress = (listing: Property | Job) => {
    setSelectedListing(listing);
    router.push(`/boost-listing?id=${listing.id}&type=${activeTab}` as any);
  };

  const handleConfirmBoost = () => {
    console.log('Boosting listing:', selectedListing?.id, 'with tier:', selectedBoostTier);
    setBoostModalVisible(false);
    setSelectedListing(null);
  };

  const renderBoostBadge = (boost?: { tier: string }) => {
    if (!boost || boost.tier === 'none') return null;

    const colors = {
      basic: { bg: '#E8F4FF', text: '#4A90E2' },
      featured: { bg: '#FFE8E8', text: '#FF6B6B' },
      premium: { bg: '#FFF9E6', text: '#FFD700' },
    };

    const color = colors[boost.tier as keyof typeof colors];
    if (!color) return null;

    return (
      <View style={[styles.boostBadge, { backgroundColor: color.bg }]}>
        <Zap size={12} color={color.text} fill={color.text} />
        <Text style={[styles.boostBadgeText, { color: color.text }]}>
          {boost.tier.toUpperCase()}
        </Text>
      </View>
    );
  };

  const renderPropertyCard = (property: Property) => (
    <View key={property.id} style={styles.listingCard}>
      <Image source={{ uri: property.images[0] }} style={styles.listingImage} />
      {renderBoostBadge(property.boost)}
      
      <View style={styles.listingContent}>
        <Text style={styles.listingTitle} numberOfLines={1}>{property.title}</Text>
        <Text style={styles.listingLocation}>{property.location.city}, {property.location.state}</Text>
        <Text style={styles.listingPrice}>{property.price_display}/mo</Text>
        
        {property.boost && property.boost.tier !== 'none' ? (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Eye size={14} color="#666" />
              <Text style={styles.statText}>{property.boost.views || 0} views</Text>
            </View>
            <View style={styles.statItem}>
              <BarChart3 size={14} color="#666" />
              <Text style={styles.statText}>{property.boost.impressions || 0} impressions</Text>
            </View>
          </View>
        ) : null}

        <TouchableOpacity 
          style={styles.boostButton}
          onPress={() => handleBoostPress(property)}
        >
          <TrendingUp size={18} color="#4A90E2" />
          <Text style={styles.boostButtonText}>
            {property.boost && property.boost.tier !== 'none' ? 'Upgrade Boost' : 'Boost Listing'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderJobCard = (job: Job) => (
    <View key={job.id} style={styles.listingCard}>
      <View style={styles.jobImagePlaceholder}>
        <Briefcase size={40} color="#4A90E2" />
      </View>
      {renderBoostBadge(job.boost)}
      
      <View style={styles.listingContent}>
        <Text style={styles.listingTitle} numberOfLines={1}>{job.title}</Text>
        <Text style={styles.listingLocation}>{job.company}</Text>
        <Text style={styles.listingPrice}>
          ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
        </Text>
        
        {job.boost && job.boost.tier !== 'none' ? (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Eye size={14} color="#666" />
              <Text style={styles.statText}>{job.boost.views || 0} views</Text>
            </View>
            <View style={styles.statItem}>
              <BarChart3 size={14} color="#666" />
              <Text style={styles.statText}>{job.boost.impressions || 0} impressions</Text>
            </View>
          </View>
        ) : null}

        <TouchableOpacity 
          style={styles.boostButton}
          onPress={() => handleBoostPress(job)}
        >
          <TrendingUp size={18} color="#4A90E2" />
          <Text style={styles.boostButtonText}>
            {job.boost && job.boost.tier !== 'none' ? 'Upgrade Boost' : 'Boost Listing'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'My Listings',
        headerBackTitle: 'Back',
      }} />

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'properties' && styles.tabActive]}
          onPress={() => setActiveTab('properties')}
        >
          <Home size={20} color={activeTab === 'properties' ? '#4A90E2' : '#999'} />
          <Text style={[styles.tabText, activeTab === 'properties' && styles.tabTextActive]}>
            Properties ({userProperties.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'jobs' && styles.tabActive]}
          onPress={() => setActiveTab('jobs')}
        >
          <Briefcase size={20} color={activeTab === 'jobs' ? '#4A90E2' : '#999'} />
          <Text style={[styles.tabText, activeTab === 'jobs' && styles.tabTextActive]}>
            Jobs ({userJobs.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'properties' ? (
          userProperties.length > 0 ? (
            userProperties.map(renderPropertyCard)
          ) : (
            <View style={styles.emptyState}>
              <Home size={64} color="#ccc" />
              <Text style={styles.emptyText}>No property listings yet</Text>
              <TouchableOpacity 
                style={styles.createButton}
                onPress={() => router.push('/add-property-v2/property-type' as any)}
              >
                <Text style={styles.createButtonText}>Create Property Listing</Text>
              </TouchableOpacity>
            </View>
          )
        ) : (
          userJobs.length > 0 ? (
            userJobs.map(renderJobCard)
          ) : (
            <View style={styles.emptyState}>
              <Briefcase size={64} color="#ccc" />
              <Text style={styles.emptyText}>No job listings yet</Text>
              <TouchableOpacity 
                style={styles.createButton}
                onPress={() => router.push('/create-job' as any)}
              >
                <Text style={styles.createButtonText}>Create Job Listing</Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </ScrollView>

      <Modal
        visible={boostModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setBoostModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Boost Your Listing</Text>
              <TouchableOpacity onPress={() => setBoostModalVisible(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalSubtitle}>
                Get more visibility and reach more potential customers
              </Text>

              {BOOST_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedBoostTier === option.tier;
                
                return (
                  <TouchableOpacity
                    key={option.tier}
                    style={[
                      styles.boostOption,
                      isSelected && styles.boostOptionSelected,
                      { borderColor: isSelected ? option.color : '#e0e0e0' }
                    ]}
                    onPress={() => setSelectedBoostTier(option.tier)}
                  >
                    <View style={[styles.boostIconContainer, { backgroundColor: option.bgColor }]}>
                      <Icon size={24} color={option.color} />
                    </View>
                    
                    <View style={styles.boostOptionContent}>
                      <Text style={styles.boostOptionName}>{option.name}</Text>
                      <View style={styles.boostPriceRow}>
                        <Text style={styles.boostOptionPrice}>${option.price}</Text>
                        <View style={styles.durationBadge}>
                          <Calendar size={12} color="#666" />
                          <Text style={styles.durationText}>{option.duration} days</Text>
                        </View>
                      </View>
                      
                      <View style={styles.featuresContainer}>
                        {option.features.map((feature, idx) => (
                          <Text key={idx} style={styles.featureText}>• {feature}</Text>
                        ))}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={handleConfirmBoost}
            >
              <Text style={styles.confirmButtonText}>
                Boost for ${BOOST_OPTIONS.find(o => o.tier === selectedBoostTier)?.price}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#999',
  },
  tabTextActive: {
    color: '#4A90E2',
  },
  scrollContent: {
    padding: 16,
  },
  listingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  listingImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  jobImagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boostBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  boostBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
  },
  listingContent: {
    padding: 16,
  },
  listingTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  listingLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  listingPrice: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#4A90E2',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 12,
    color: '#666',
  },
  boostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F8FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  boostButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#4A90E2',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1a1a1a',
  },
  modalScroll: {
    padding: 20,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  boostOption: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  boostOptionSelected: {
    backgroundColor: '#F8FBFF',
  },
  boostIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  boostOptionContent: {
    flex: 1,
  },
  boostOptionName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  boostPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  boostOptionPrice: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#4A90E2',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  durationText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600' as const,
  },
  featuresContainer: {
    marginTop: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  confirmButton: {
    margin: 20,
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
});
