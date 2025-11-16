import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { DollarSign, MapPin, Users, Home, Sparkles } from 'lucide-react-native';

type GenderPreference = 'any' | 'male' | 'female';
type LifestyleTag = 'clean' | 'night-owl' | 'early-bird' | 'social' | 'quiet' | 'pet-friendly' | 'no-pets';
type Amenity = 'gym' | 'parking' | 'laundry' | 'balcony' | 'dishwasher' | 'near-metro';

export default function RoommateFinderScreen() {
  const router = useRouter();
  const [budget, setBudget] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [genderPreference, setGenderPreference] = useState<GenderPreference>('any');
  const [selectedLifestyle, setSelectedLifestyle] = useState<LifestyleTag[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>([]);

  const lifestyleTags: { value: LifestyleTag; label: string }[] = [
    { value: 'clean', label: 'Clean' },
    { value: 'night-owl', label: 'Night Owl' },
    { value: 'early-bird', label: 'Early Bird' },
    { value: 'social', label: 'Social' },
    { value: 'quiet', label: 'Quiet' },
    { value: 'pet-friendly', label: 'Pet Friendly' },
    { value: 'no-pets', label: 'No Pets' },
  ];

  const amenities: { value: Amenity; label: string }[] = [
    { value: 'gym', label: 'Gym' },
    { value: 'parking', label: 'Parking' },
    { value: 'laundry', label: 'Laundry in Unit' },
    { value: 'balcony', label: 'Balcony' },
    { value: 'dishwasher', label: 'Dishwasher' },
    { value: 'near-metro', label: 'Near Metro' },
  ];

  const toggleLifestyle = (tag: LifestyleTag) => {
    setSelectedLifestyle((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleAmenity = (amenity: Amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleFindMatches = () => {
    router.push({
      pathname: '/roommate-matches' as any,
      params: {
        budget,
        location,
        gender: genderPreference,
        lifestyle: selectedLifestyle.join(','),
        amenities: selectedAmenities.join(','),
      },
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Find Roommate',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#1a1a1a',
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Users size={40} color="#4A90E2" strokeWidth={2} />
          </View>
          <Text style={styles.heroTitle}>Find Your Perfect Roommate</Text>
          <Text style={styles.heroSubtitle}>
            Answer a few questions and we&apos;ll match you with compatible roommates
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <DollarSign size={20} color="#4A90E2" />
              <Text style={styles.label}>Budget (Monthly)</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g., 1500"
              placeholderTextColor="#999"
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <MapPin size={20} color="#4A90E2" />
              <Text style={styles.label}>Preferred Location</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g., Washington, DC"
              placeholderTextColor="#999"
              value={location}
              onChangeText={setLocation}
            />
          </View>

          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Users size={20} color="#4A90E2" />
              <Text style={styles.label}>Gender Preference</Text>
            </View>
            <View style={styles.genderOptions}>
              {(['any', 'male', 'female'] as GenderPreference[]).map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderButton,
                    genderPreference === gender && styles.genderButtonActive,
                  ]}
                  onPress={() => setGenderPreference(gender)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      genderPreference === gender && styles.genderButtonTextActive,
                    ]}
                  >
                    {gender === 'any' ? 'Any' : gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Sparkles size={20} color="#4A90E2" />
              <Text style={styles.label}>Lifestyle Preferences</Text>
            </View>
            <View style={styles.tagContainer}>
              {lifestyleTags.map((tag) => (
                <TouchableOpacity
                  key={tag.value}
                  style={[
                    styles.tag,
                    selectedLifestyle.includes(tag.value) && styles.tagActive,
                  ]}
                  onPress={() => toggleLifestyle(tag.value)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.tagText,
                      selectedLifestyle.includes(tag.value) && styles.tagTextActive,
                    ]}
                  >
                    {tag.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Home size={20} color="#4A90E2" />
              <Text style={styles.label}>Desired Amenities</Text>
            </View>
            <View style={styles.tagContainer}>
              {amenities.map((amenity) => (
                <TouchableOpacity
                  key={amenity.value}
                  style={[
                    styles.tag,
                    selectedAmenities.includes(amenity.value) && styles.tagActive,
                  ]}
                  onPress={() => toggleAmenity(amenity.value)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.tagText,
                      selectedAmenities.includes(amenity.value) && styles.tagTextActive,
                    ]}
                  >
                    {amenity.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.findButton}
          onPress={handleFindMatches}
          activeOpacity={0.8}
        >
          <Text style={styles.findButtonText}>Find Matches</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  hero: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    padding: 20,
  },
  inputSection: {
    marginBottom: 28,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 15,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  genderOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#E8F4FF',
    borderColor: '#4A90E2',
  },
  genderButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#666',
  },
  genderButtonTextActive: {
    color: '#4A90E2',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  tagActive: {
    backgroundColor: '#E8F4FF',
    borderColor: '#4A90E2',
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#666',
  },
  tagTextActive: {
    color: '#4A90E2',
    fontWeight: '600' as const,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  findButton: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  findButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#fff',
  },
});
