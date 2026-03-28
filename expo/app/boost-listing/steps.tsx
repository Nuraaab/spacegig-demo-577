import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, CreditCard, Calendar, CheckCircle2, TrendingUp, Zap, Star, Crown, Eye, BarChart3 } from 'lucide-react-native';
import { useState, useRef } from 'react';
import { mockProperties } from '@/mocks/properties';
import { mockJobs } from '@/mocks/jobs';

export default function BoostListingSteps() {
  const router = useRouter();
  const { id, type, tier } = useLocalSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [startDate, setStartDate] = useState('');
  
  const backButtonScale = useRef(new Animated.Value(1)).current;
  const nextButtonScale = useRef(new Animated.Value(1)).current;

  const listing = type === 'properties' 
    ? mockProperties.find(p => p.id === id)
    : mockJobs.find(j => j.id === id);

  const boostTiers = {
    basic: { name: 'Basic Boost', price: 29.99, duration: 7, icon: Zap, color: '#4A90E2', bgColor: '#E8F4FF' },
    featured: { name: 'Featured Boost', price: 49.99, duration: 14, icon: Star, color: '#FF6B6B', bgColor: '#FFE8E8' },
    premium: { name: 'Premium Boost', price: 99.99, duration: 30, icon: Crown, color: '#FFD700', bgColor: '#FFF9E6' },
  };

  const selectedTier = boostTiers[tier as keyof typeof boostTiers];
  const Icon = selectedTier?.icon;

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

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
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        router.push('/boost-listing/success' as any);
      }
    });
  };

  const handleBack = () => {
    animateButton(backButtonScale, () => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      } else {
        router.back();
      }
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Review Your Boost</Text>
            <Text style={styles.stepSubtitle}>
              Make sure everything looks good before proceeding
            </Text>

            <View style={styles.listingCard}>
              {type === 'properties' && listing && 'images' in listing ? (
                <Image source={{ uri: listing.images[0] }} style={styles.listingImage} />
              ) : (
                <View style={styles.jobImagePlaceholder}>
                  <TrendingUp size={32} color="#4A90E2" />
                </View>
              )}
              <View style={styles.listingContent}>
                <Text style={styles.listingTitle} numberOfLines={1}>
                  {listing && 'title' in listing ? listing.title : ''}
                </Text>
                <Text style={styles.listingLocation}>
                  {type === 'properties' && listing && 'location' in listing
                    ? `${listing.location.city}, ${listing.location.state}`
                    : listing && 'company' in listing ? listing.company : ''}
                </Text>
              </View>
            </View>

            {selectedTier && Icon && (
              <View style={styles.tierCard}>
                <View style={[styles.tierIconContainer, { backgroundColor: selectedTier.bgColor }]}>
                  <Icon size={32} color={selectedTier.color} />
                </View>
                <View style={styles.tierContent}>
                  <Text style={styles.tierName}>{selectedTier.name}</Text>
                  <Text style={styles.tierPrice}>${selectedTier.price}</Text>
                  <Text style={styles.tierDuration}>{selectedTier.duration} days of boosting</Text>
                </View>
              </View>
            )}

            <View style={styles.benefitsCard}>
              <Text style={styles.benefitsTitle}>What you'll get:</Text>
              <View style={styles.benefitRow}>
                <Eye size={20} color="#4A90E2" />
                <Text style={styles.benefitText}>Increased visibility in search results</Text>
              </View>
              <View style={styles.benefitRow}>
                <BarChart3 size={20} color="#4A90E2" />
                <Text style={styles.benefitText}>Detailed analytics dashboard</Text>
              </View>
              <View style={styles.benefitRow}>
                <CheckCircle2 size={20} color="#4A90E2" />
                <Text style={styles.benefitText}>Priority customer support</Text>
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Schedule Your Boost</Text>
            <Text style={styles.stepSubtitle}>
              Choose when you want your boost to start
            </Text>

            <TouchableOpacity style={styles.scheduleOption}>
              <View style={styles.scheduleIconContainer}>
                <TrendingUp size={24} color="#4A90E2" />
              </View>
              <View style={styles.scheduleContent}>
                <Text style={styles.scheduleTitle}>Start Immediately</Text>
                <Text style={styles.scheduleSubtitle}>Your boost will begin right away</Text>
              </View>
              <View style={styles.radio}>
                <View style={styles.radioInner} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.scheduleOption, styles.scheduleOptionInactive]}>
              <View style={styles.scheduleIconContainer}>
                <Calendar size={24} color="#999" />
              </View>
              <View style={styles.scheduleContent}>
                <Text style={[styles.scheduleTitle, styles.scheduleTextInactive]}>
                  Schedule for Later
                </Text>
                <Text style={styles.scheduleSubtitle}>Choose a specific start date</Text>
              </View>
              <View style={styles.radioEmpty} />
            </TouchableOpacity>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Boost Duration:</Text>
                <Text style={styles.summaryValue}>{selectedTier?.duration} days</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Start Date:</Text>
                <Text style={styles.summaryValue}>Today</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>End Date:</Text>
                <Text style={styles.summaryValue}>
                  {new Date(Date.now() + (selectedTier?.duration || 0) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Payment Details</Text>
            <Text style={styles.stepSubtitle}>
              Enter your payment information to complete the boost
            </Text>

            <Text style={styles.fieldLabel}>Card Number</Text>
            <View style={styles.inputContainer}>
              <CreditCard size={20} color="#999" />
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>Expiry Date</Text>
                <View style={styles.inputContainer}>
                  <Calendar size={20} color="#999" />
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChangeText={setCardExpiry}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
              </View>

              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>CVC</Text>
                <View style={styles.inputContainer}>
                  <CreditCard size={20} color="#999" />
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    value={cardCvc}
                    onChangeText={setCardCvc}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>

            <Text style={styles.fieldLabel}>Cardholder Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                value={cardName}
                onChangeText={setCardName}
              />
            </View>

            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>${selectedTier?.price}</Text>
            </View>

            <Text style={styles.disclaimer}>
              By confirming, you agree to our Terms of Service and Privacy Policy. 
              Your boost will begin immediately after payment is processed.
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Animated.View style={{ transform: [{ scale: backButtonScale }] }}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.8}>
            <ChevronLeft size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </Animated.View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {renderStepContent()}
      </ScrollView>

      <View style={styles.footer}>
        <Animated.View style={{ flex: 1, transform: [{ scale: nextButtonScale }] }}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.nextButtonText}>
              {currentStep === totalSteps ? `Pay $${selectedTier?.price}` : 'Continue'}
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
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 2,
  },
  content: {
    padding: 20,
  },
  stepContainer: {
    gap: 20,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#1a1a1a',
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  listingCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  listingImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  jobImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listingContent: {
    flex: 1,
    marginLeft: 12,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  listingLocation: {
    fontSize: 14,
    color: '#666',
  },
  tierCard: {
    flexDirection: 'row',
    backgroundColor: '#F0F8FF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  tierIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tierContent: {
    flex: 1,
  },
  tierName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  tierPrice: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#4A90E2',
    marginBottom: 4,
  },
  tierDuration: {
    fontSize: 14,
    color: '#666',
  },
  benefitsCard: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 12,
    gap: 16,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    color: '#666',
  },
  scheduleOption: {
    flexDirection: 'row',
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  scheduleOptionInactive: {
    backgroundColor: '#f9f9f9',
    borderColor: '#e0e0e0',
  },
  scheduleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  scheduleTextInactive: {
    color: '#999',
  },
  scheduleSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4A90E2',
  },
  radioEmpty: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  summaryCard: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 12,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 15,
    color: '#666',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#1a1a1a',
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  totalCard: {
    backgroundColor: '#4A90E2',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#fff',
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#fff',
  },
});
