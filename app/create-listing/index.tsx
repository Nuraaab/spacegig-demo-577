import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Home, Briefcase, X } from 'lucide-react-native';
import { useListing } from '@/contexts/ListingContext';

export default function CreateListingIntro() {
  const router = useRouter();
  const { updateFormData, nextStep } = useListing();

  const handleSelectCategory = (category: 'property' | 'job') => {
    updateFormData({ listingCategory: category });
    nextStep();
    router.push('/create-listing/steps' as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <X size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400' }}
          style={styles.heroImage}
        />

        <Text style={styles.title}>It&apos;s easy to get started on PostIt</Text>
        <Text style={styles.subtitle}>Create your listing in just a few simple steps</Text>

        <View style={styles.stepsContainer}>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Tell us what you are posting</Text>
              <Text style={styles.stepDescription}>Choose between property or job listing</Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Add details and photos</Text>
              <Text style={styles.stepDescription}>Fill in the information and upload images</Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Review and publish</Text>
              <Text style={styles.stepDescription}>Preview your listing and go live</Text>
            </View>
          </View>
        </View>

        <Text style={styles.questionTitle}>What are you posting?</Text>
        <Text style={styles.questionSubtitle}>Choose the type of listing you want to create</Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleSelectCategory('property')}
          >
            <Home size={48} color="#4A90E2" strokeWidth={2} />
            <Text style={styles.optionText}>Property</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleSelectCategory('job')}
          >
            <Briefcase size={48} color="#4A90E2" strokeWidth={2} />
            <Text style={styles.optionText}>Job</Text>
          </TouchableOpacity>
        </View>
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
    gap: 16,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
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
  questionTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  questionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  optionCard: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginTop: 12,
  },
});
