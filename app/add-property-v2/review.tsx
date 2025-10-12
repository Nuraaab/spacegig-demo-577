import { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Bed, Bath, Maximize, DollarSign, CheckCircle, Home as HomeIcon, Edit } from 'lucide-react-native';

export default function ReviewScreen() {
  const router = useRouter();
  const backButtonScale = useRef(new Animated.Value(1)).current;
  const publishButtonScale = useRef(new Animated.Value(1)).current;

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

  const handlePublish = () => {
    animateButton(publishButtonScale, () => {
      router.push('/publish-success' as any);
    });
  };

  const samplePhotos = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  ];

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
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
          <Text style={styles.progressText}>Step 4 of 4</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <CheckCircle size={48} color="#4CAF50" />
          <Text style={styles.title}>Review Your Listing</Text>
          <Text style={styles.subtitle}>
            Make sure everything looks good before publishing
          </Text>
        </View>

        <View style={styles.previewCard}>
          <Image source={{ uri: samplePhotos[0] }} style={styles.coverImage} />
          <View style={styles.photosCount}>
            <Text style={styles.photosCountText}>{samplePhotos.length} photos</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Property Details</Text>
            <TouchableOpacity style={styles.editButton}>
              <Edit size={16} color="#4A90E2" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <HomeIcon size={20} color="#4A90E2" />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Type</Text>
                  <Text style={styles.detailValue}>Apartment</Text>
                </View>
              </View>
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <DollarSign size={20} color="#4A90E2" />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Price</Text>
                  <Text style={styles.detailValue}>$2,500/mo</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.specsRow}>
              <View style={styles.specItem}>
                <Bed size={20} color="#666" />
                <Text style={styles.specText}>2 beds</Text>
              </View>
              <View style={styles.specItem}>
                <Bath size={20} color="#666" />
                <Text style={styles.specText}>2 baths</Text>
              </View>
              <View style={styles.specItem}>
                <Maximize size={20} color="#666" />
                <Text style={styles.specText}>1200 sqft</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.locationRow}>
              <MapPin size={20} color="#4A90E2" />
              <Text style={styles.locationText}>Downtown, Toronto, ON</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <TouchableOpacity style={styles.editButton}>
              <Edit size={16} color="#4A90E2" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.photosGrid}>
            {samplePhotos.map((photo, index) => (
              <View key={index} style={styles.photoThumbnail}>
                <Image source={{ uri: photo }} style={styles.thumbnailImage} />
                {index === 0 && (
                  <View style={styles.coverBadge}>
                    <Text style={styles.coverBadgeText}>Cover</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>✨ What happens next?</Text>
          <Text style={styles.infoText}>
            • Your listing will be reviewed by our team{'\n'}
            • You&apos;ll receive a notification once it&apos;s approved{'\n'}
            • Approved listings go live within 24 hours{'\n'}
            • You can edit or unpublish anytime
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Animated.View style={{ flex: 1, transform: [{ scale: publishButtonScale }] }}>
          <TouchableOpacity
            style={styles.publishButton}
            onPress={handlePublish}
            activeOpacity={0.9}
          >
            <Text style={styles.publishButtonText}>Publish Listing</Text>
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
    backgroundColor: '#4CAF50',
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
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  previewCard: {
    position: 'relative',
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  coverImage: {
    width: '100%',
    height: 240,
  },
  photosCount: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  photosCountText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#fff',
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#1a1a1a',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#4A90E2',
  },
  detailsCard: {
    backgroundColor: '#F5F8FA',
    padding: 20,
    borderRadius: 14,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 20,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
  },
  divider: {
    height: 1,
    backgroundColor: '#D1D5DB',
    marginVertical: 16,
  },
  specsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  specText: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: '#666',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: '#1a1a1a',
    flex: 1,
  },
  photosGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  photoThumbnail: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  coverBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: '#4A90E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  coverBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: '#fff',
  },
  infoBox: {
    backgroundColor: '#F0F8FF',
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6EBFF',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  publishButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  publishButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#fff',
  },
});
