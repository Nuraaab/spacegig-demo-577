import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, Building2, Briefcase } from 'lucide-react-native';
import { useListing } from '@/contexts/ListingContext';

export default function CreateListingIntro() {
  const router = useRouter();
  const { updateFormData, nextStep } = useListing();

  const handlePropertyListing = () => {
    updateFormData({ listingCategory: 'property' });
    nextStep();
    router.push('/create-listing/steps' as any);
  };

  const handleJobListing = () => {
    router.push('/create-job' as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <X size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>What would you like to add?</Text>
          <Text style={styles.subtitle}>Choose the type of listing you want to create</Text>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionCard}
              onPress={handlePropertyListing}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#E8F4FD' }]}>
                <Building2 size={32} color="#4A90E2" />
              </View>
              <Text style={styles.optionTitle}>Property Listing</Text>
              <Text style={styles.optionDescription}>
                List your property for rent or sale. Add photos, details, and pricing.
              </Text>
              <View style={styles.optionButton}>
                <Text style={styles.optionButtonText}>Create Property</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionCard}
              onPress={handleJobListing}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#FFF4E6' }]}>
                <Briefcase size={32} color="#FF9500" />
              </View>
              <Text style={styles.optionTitle}>Job Listing</Text>
              <Text style={styles.optionDescription}>
                Post a job opportunity. Find the right candidates for your team.
              </Text>
              <View style={[styles.optionButton, { backgroundColor: '#FF9500' }]}>
                <Text style={styles.optionButtonText}>Create Job</Text>
              </View>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 20,
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
  },
});
