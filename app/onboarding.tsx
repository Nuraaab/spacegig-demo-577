import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Home, Briefcase, Search, PlusCircle } from 'lucide-react-native';

export default function OnboardingScreen() {
  const router = useRouter();

  const handleAddProperty = () => {
    router.push('/create-listing' as any);
  };

  const handleAddJob = () => {
    console.log('Add job opening');
  };

  const handleDiscoverProperties = () => {
    router.replace('/(tabs)/(discover)/discover');
  };

  const handleDiscoverJobs = () => {
    console.log('Discover job openings');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>What are you looking for?</Text>
        <Text style={styles.subtitle}>Choose an option to get started</Text>

        <View style={styles.categoriesContainer}>
          <View style={styles.category}>
            <Text style={styles.categoryTitle}>Add Listings</Text>
            
            <TouchableOpacity
              style={styles.optionCard}
              onPress={handleAddProperty}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
                <Home size={32} color="#4A90E2" strokeWidth={2} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Add Property</Text>
                <Text style={styles.optionDescription}>
                  List your property for rent or sale
                </Text>
              </View>
              <PlusCircle size={24} color="#4A90E2" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionCard}
              onPress={handleAddJob}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                <Briefcase size={32} color="#10B981" strokeWidth={2} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Add Job Opening</Text>
                <Text style={styles.optionDescription}>
                  Post a job opportunity for candidates
                </Text>
              </View>
              <PlusCircle size={24} color="#10B981" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.category}>
            <Text style={styles.categoryTitle}>Discover</Text>
            
            <TouchableOpacity
              style={styles.optionCard}
              onPress={handleDiscoverProperties}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
                <Search size={32} color="#FF9800" strokeWidth={2} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Discover Properties</Text>
                <Text style={styles.optionDescription}>
                  Browse and find your perfect home
                </Text>
              </View>
              <View style={styles.arrow}>
                <Text style={styles.arrowText}>→</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionCard}
              onPress={handleDiscoverJobs}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#F3E5F5' }]}>
                <Search size={32} color="#9C27B0" strokeWidth={2} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Job Openings</Text>
                <Text style={styles.optionDescription}>
                  Explore career opportunities near you
                </Text>
              </View>
              <View style={styles.arrow}>
                <Text style={styles.arrowText}>→</Text>
              </View>
            </TouchableOpacity>
          </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  categoriesContainer: {
    flex: 1,
  },
  category: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 16,
    paddingLeft: 4,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  arrow: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 24,
    color: '#999',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#999',
    marginHorizontal: 16,
  },
});
