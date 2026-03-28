import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Sparkles } from 'lucide-react-native';

export default function DescriptionScreen() {
  const router = useRouter();
  const [description, setDescription] = useState<string>('');
  
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
      router.push('/add-property-v2/amenities' as any);
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
            <View style={[styles.progressFill, { width: '62.5%' }]} />
          </View>
          <Text style={styles.progressText}>Step 5 of 8</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.stepLabel}>STEP 5 OF 8</Text>
        <Text style={styles.title}>Describe your property</Text>
        <Text style={styles.subtitle}>
          Write a detailed description that highlights the best features of your property
        </Text>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Description</Text>
            <TouchableOpacity style={styles.aiButton}>
              <Sparkles size={16} color="#4A90E2" />
              <Text style={styles.aiButtonText}>Generate with AI</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.textArea}
            placeholder="Describe your property... Include details about the neighborhood, nearby amenities, unique features, and what makes this property special."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{description.length} characters</Text>
        </View>

        <View style={styles.tipsBox}>
          <Text style={styles.tipsTitle}>Tips for a great description:</Text>
          <Text style={styles.tipItem}>• Highlight unique features and amenities</Text>
          <Text style={styles.tipItem}>• Mention nearby attractions and transportation</Text>
          <Text style={styles.tipItem}>• Describe the neighborhood vibe</Text>
          <Text style={styles.tipItem}>• Be honest and accurate</Text>
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
    color: '#666',
    marginBottom: 32,
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1a1a1a',
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  aiButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#4A90E2',
  },
  textArea: {
    backgroundColor: '#F5F8FA',
    padding: 16,
    borderRadius: 14,
    fontSize: 16,
    color: '#1a1a1a',
    minHeight: 180,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  charCount: {
    fontSize: 13,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
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
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#fff',
  },
});
