import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Upload, X, Camera, Image as ImageIcon } from 'lucide-react-native';

export default function PhotosScreen() {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);
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

  const samplePhotos = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
  ];

  const handleAddPhoto = () => {
    if (photos.length < 10) {
      const randomPhoto = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
      setPhotos([...photos, randomPhoto]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    animateButton(nextButtonScale, () => {
      router.push('/add-property-v2/review' as any);
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
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
          <Text style={styles.progressText}>Step 8 of 8</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.stepLabel}>STEP 8 OF 8</Text>
        <Text style={styles.title}>Add photos of your property</Text>
        <Text style={styles.subtitle}>
          High-quality photos help attract more interest. Add at least 5 photos.
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{photos.length}</Text>
            <Text style={styles.statLabel}>Photos Added</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>10</Text>
            <Text style={styles.statLabel}>Max Photos</Text>
          </View>
        </View>

        {photos.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <ImageIcon size={40} color="#4A90E2" strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyTitle}>No photos yet</Text>
            <Text style={styles.emptyDescription}>
              Add photos to showcase your property
            </Text>
          </View>
        ) : (
          <View style={styles.photosGrid}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoCard}>
                <Image source={{ uri: photo }} style={styles.photoImage} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemovePhoto(index)}
                >
                  <X size={16} color="#fff" strokeWidth={3} />
                </TouchableOpacity>
                {index === 0 && (
                  <View style={styles.coverBadge}>
                    <Text style={styles.coverBadgeText}>Cover</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={styles.uploadButtons}>
          <TouchableOpacity
            style={[styles.uploadButton, photos.length >= 10 && styles.uploadButtonDisabled]}
            onPress={handleAddPhoto}
            disabled={photos.length >= 10}
            activeOpacity={0.8}
          >
            <Camera size={20} color={photos.length >= 10 ? '#9CA3AF' : '#4A90E2'} />
            <Text style={[styles.uploadButtonText, photos.length >= 10 && styles.uploadButtonTextDisabled]}>
              Take Photo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.uploadButton, photos.length >= 10 && styles.uploadButtonDisabled]}
            onPress={handleAddPhoto}
            disabled={photos.length >= 10}
            activeOpacity={0.8}
          >
            <Upload size={20} color={photos.length >= 10 ? '#9CA3AF' : '#4A90E2'} />
            <Text style={[styles.uploadButtonText, photos.length >= 10 && styles.uploadButtonTextDisabled]}>
              Upload from Gallery
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tipsBox}>
          <Text style={styles.tipsTitle}>📸 Photo Tips</Text>
          <Text style={styles.tipItem}>• Use natural lighting when possible</Text>
          <Text style={styles.tipItem}>• Clean and declutter spaces before shooting</Text>
          <Text style={styles.tipItem}>• Capture all rooms and key features</Text>
          <Text style={styles.tipItem}>• Take photos from corners to show more space</Text>
          <Text style={styles.tipItem}>• Include outdoor areas and amenities</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Animated.View style={{ flex: 1, transform: [{ scale: nextButtonScale }] }}>
          <TouchableOpacity
            style={[styles.nextButton, photos.length < 1 && styles.nextButtonDisabled]}
            onPress={handleNext}
            activeOpacity={0.9}
            disabled={photos.length < 1}
          >
            <Text style={[styles.nextButtonText, photos.length < 1 && styles.nextButtonTextDisabled]}>
              Continue
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
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F8FA',
    padding: 20,
    borderRadius: 14,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#4A90E2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    marginBottom: 24,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  photoCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#4A90E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  coverBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#fff',
  },
  uploadButtons: {
    gap: 12,
    marginBottom: 24,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F8FF',
    padding: 18,
    borderRadius: 14,
    gap: 12,
    borderWidth: 2,
    borderColor: '#D6EBFF',
  },
  uploadButtonDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E5E7EB',
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#4A90E2',
  },
  uploadButtonTextDisabled: {
    color: '#9CA3AF',
  },
  tipsBox: {
    backgroundColor: '#F0F8FF',
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6EBFF',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  tipItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 4,
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
