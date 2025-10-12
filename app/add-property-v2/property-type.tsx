import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Home, Building, Building2, Bed } from 'lucide-react-native';

type PropertyType = 'apartment' | 'condo' | 'room' | 'house';

export default function PropertyTypeScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<PropertyType | null>(null);
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

  const propertyTypes = [
    {
      id: 'apartment' as PropertyType,
      title: 'Apartment',
      description: 'Multi-unit residential building',
      icon: Building,
      color: '#4A90E2',
    },
    {
      id: 'condo' as PropertyType,
      title: 'Condo',
      description: 'Individually owned unit in a complex',
      icon: Building2,
      color: '#7B68EE',
    },
    {
      id: 'room' as PropertyType,
      title: 'Room',
      description: 'Single room in a shared space',
      icon: Bed,
      color: '#FF6B9D',
    },
    {
      id: 'house' as PropertyType,
      title: 'House',
      description: 'Standalone residential property',
      icon: Home,
      color: '#4CAF50',
    },
  ];

  const handleNext = () => {
    if (!selectedType) return;
    animateButton(nextButtonScale, () => {
      router.push(`/add-property-v2/property-details?type=${selectedType}` as any);
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
            <View style={[styles.progressFill, { width: '25%' }]} />
          </View>
          <Text style={styles.progressText}>Step 1 of 4</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>What kind of property are you looking to list?</Text>
        <Text style={styles.subtitle}>
          Choose the type that best describes your property
        </Text>

        <View style={styles.cardsContainer}>
          {propertyTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            
            return (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.propertyCard,
                  isSelected && styles.propertyCardSelected,
                ]}
                onPress={() => setSelectedType(type.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: type.color }]}>
                  <Icon size={32} color="#fff" strokeWidth={2} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{type.title}</Text>
                  <Text style={styles.cardDescription}>{type.description}</Text>
                </View>
                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>💡 Not sure which to choose?</Text>
          <Text style={styles.tipText}>
            • <Text style={styles.tipBold}>Apartment:</Text> Part of a larger building with multiple units{'\n'}
            • <Text style={styles.tipBold}>Condo:</Text> You own the unit, shared common areas{'\n'}
            • <Text style={styles.tipBold}>Room:</Text> Renting out a single room in your property{'\n'}
            • <Text style={styles.tipBold}>House:</Text> Standalone single-family home
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Animated.View style={{ flex: 1, transform: [{ scale: nextButtonScale }] }}>
          <TouchableOpacity
            style={[styles.nextButton, !selectedType && styles.nextButtonDisabled]}
            onPress={handleNext}
            activeOpacity={0.9}
            disabled={!selectedType}
          >
            <Text style={[styles.nextButtonText, !selectedType && styles.nextButtonTextDisabled]}>
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
    marginBottom: 32,
    lineHeight: 24,
  },
  cardsContainer: {
    gap: 14,
    marginBottom: 24,
  },
  propertyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    gap: 16,
  },
  propertyCardSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#F0F8FF',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  radioOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#4A90E2',
  },
  radioInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4A90E2',
  },
  tipBox: {
    backgroundColor: '#F0F8FF',
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6EBFF',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  tipBold: {
    fontWeight: '600' as const,
    color: '#1a1a1a',
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
