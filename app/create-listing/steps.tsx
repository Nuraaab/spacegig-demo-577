import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Switch, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Home, Building, Building2, MapPin, Bed, Bath, HomeIcon, Maximize, Sparkles, Image as ImageIcon, FileText, DollarSign, CheckCircle2 } from 'lucide-react-native';
import { useRef } from 'react';
import { useListing } from '@/contexts/ListingContext';
import { PROPERTY_TYPES, AMENITIES } from '@/mocks/properties';

export default function CreateListingSteps() {
  const router = useRouter();
  const { currentStep, formData, updateFormData, nextStep, previousStep, submitListing } = useListing();
  const backButtonScale = useRef(new Animated.Value(1)).current;
  const nextButtonScale = useRef(new Animated.Value(1)).current;
  const backFooterScale = useRef(new Animated.Value(1)).current;

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

  const totalSteps = 8;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    animateButton(nextButtonScale, () => {
      if (currentStep < totalSteps) {
        nextStep();
      } else {
        router.push('/publish-signup' as any);
      }
    });
  };

  const handleBack = () => {
    animateButton(backButtonScale, () => {
      if (currentStep > 1) {
        previousStep();
      } else {
        router.back();
      }
    });
  };

  const handleBackFooter = () => {
    animateButton(backFooterScale, () => {
      if (currentStep > 1) {
        previousStep();
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
            <Text style={styles.stepLabel}>STEP 1 OF {totalSteps}</Text>
            <Text style={styles.stepTitle}>What are you posting?</Text>
            <Text style={styles.stepSubtitle}>Choose the type of listing you want to create</Text>

            <View style={styles.optionsGrid}>
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  formData.listingCategory === 'property' && styles.optionCardSelected,
                ]}
                onPress={() => updateFormData({ listingCategory: 'property' })}
              >
                <Home size={48} color="#4A90E2" />
                <Text style={styles.optionText}>Property</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionCard,
                  formData.listingCategory === 'job' && styles.optionCardSelected,
                ]}
                onPress={() => updateFormData({ listingCategory: 'job' })}
              >
                <Building size={48} color="#4A90E2" />
                <Text style={styles.optionText}>Job</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepLabel}>STEP 2 OF {totalSteps}</Text>
            <Text style={styles.stepTitle}>What type of property?</Text>
            <Text style={styles.stepSubtitle}>Choose the property type you&apos;re listing</Text>

            <Text style={styles.fieldLabel}>Listing Type</Text>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Sale</Text>
              <Switch
                value={formData.listingType === 'rent'}
                onValueChange={(value) => updateFormData({ listingType: value ? 'rent' : 'sale' })}
                trackColor={{ false: '#ccc', true: '#4A90E2' }}
                thumbColor="#fff"
              />
              <Text style={styles.switchLabel}>Rent</Text>
            </View>

            <Text style={styles.fieldLabel}>Property Type</Text>
            <View style={styles.propertyTypeGrid}>
              {PROPERTY_TYPES.filter((type) => {
                if (formData.listingType === 'sale') {
                  return type.value !== 'basement' && type.value !== 'room';
                }
                return true;
              }).map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.propertyTypeCard,
                    formData.propertyType === type.value && styles.propertyTypeCardSelected,
                  ]}
                  onPress={() => updateFormData({ propertyType: type.value })}
                >
                  {type.value === 'house' && <Home size={32} color="#4A90E2" />}
                  {type.value === 'apartment' && <Building size={32} color="#4A90E2" />}
                  {type.value === 'condo' && <Building2 size={32} color="#4A90E2" />}
                  {type.value === 'land' && <MapPin size={32} color="#4A90E2" />}
                  {type.value === 'commercial' && <Building size={32} color="#4A90E2" />}
                  {type.value === 'basement' && <HomeIcon size={32} color="#4A90E2" />}
                  {type.value === 'room' && <Bed size={32} color="#4A90E2" />}
                  <Text style={styles.propertyTypeText}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepLabel}>STEP 3 OF {totalSteps}</Text>
            <Text style={styles.stepTitle}>Property specifications</Text>
            <Text style={styles.stepSubtitle}>Tell us about the size and features</Text>

            <Text style={styles.fieldLabel}>Beds</Text>
            <View style={styles.counterContainer}>
              <Bed size={24} color="#4A90E2" />
              <Text style={styles.counterValue}>{formData.beds}</Text>
              <View style={styles.counterButtons}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => updateFormData({ beds: Math.max(0, formData.beds - 1) })}
                >
                  <Text style={styles.counterButtonText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => updateFormData({ beds: formData.beds + 1 })}
                >
                  <Text style={styles.counterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.fieldLabel}>Baths</Text>
            <View style={styles.counterContainer}>
              <Bath size={24} color="#4A90E2" />
              <Text style={styles.counterValue}>{formData.baths}</Text>
              <View style={styles.counterButtons}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => updateFormData({ baths: Math.max(0, formData.baths - 0.5) })}
                >
                  <Text style={styles.counterButtonText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => updateFormData({ baths: formData.baths + 0.5 })}
                >
                  <Text style={styles.counterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.fieldLabel}>Den</Text>
            <View style={styles.counterContainer}>
              <HomeIcon size={24} color="#4A90E2" />
              <Text style={styles.counterValue}>{formData.den}</Text>
              <View style={styles.counterButtons}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => updateFormData({ den: Math.max(0, formData.den - 1) })}
                >
                  <Text style={styles.counterButtonText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => updateFormData({ den: formData.den + 1 })}
                >
                  <Text style={styles.counterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.fieldLabel}>Size (sq ft)</Text>
            <View style={styles.inputContainer}>
              <Maximize size={20} color="#999" />
              <TextInput
                style={styles.input}
                placeholder="e.g. 1500"
                value={formData.sqft}
                onChangeText={(text) => updateFormData({ sqft: text })}
                keyboardType="numeric"
              />
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepLabel}>STEP 4 OF {totalSteps}</Text>
            <Text style={styles.stepTitle}>Location & Price</Text>
            <Text style={styles.stepSubtitle}>Where is your property located and what&apos;s the price?</Text>

            <Text style={styles.fieldLabel}>Location</Text>
            <View style={styles.inputContainer}>
              <MapPin size={20} color="#999" />
              <TextInput
                style={styles.input}
                placeholder="Search for a location"
                value={formData.location}
                onChangeText={(text) => updateFormData({ location: text })}
              />
            </View>

            <Text style={styles.fieldLabel}>Now, set a monthly price</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.priceSymbol}>$</Text>
              <TextInput
                style={styles.priceInput}
                value={formData.price}
                onChangeText={(text) => updateFormData({ price: text })}
                keyboardType="numeric"
              />
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepLabel}>STEP 5 OF {totalSteps}</Text>
            <Text style={styles.stepTitle}>Describe your property</Text>
            <Text style={styles.stepSubtitle}>
              Write a detailed description that highlights the best features of your property
            </Text>

            <View style={styles.descriptionHeader}>
              <Text style={styles.fieldLabel}>Description</Text>
              <TouchableOpacity style={styles.aiButton}>
                <Sparkles size={16} color="#4A90E2" />
                <Text style={styles.aiButtonText}>Generate with AI</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.textArea}
              placeholder="Describe your property... Include details about the neighborhood, nearby amenities, unique features, and what makes this property special."
              value={formData.description}
              onChangeText={(text) => updateFormData({ description: text })}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>{formData.description.length} characters</Text>

            <View style={styles.tipsBox}>
              <Text style={styles.tipsTitle}>Tips for a great description:</Text>
              <Text style={styles.tipItem}>• Highlight unique features and amenities</Text>
              <Text style={styles.tipItem}>• Mention nearby attractions and transportation</Text>
              <Text style={styles.tipItem}>• Describe the neighborhood vibe</Text>
              <Text style={styles.tipItem}>• Be honest and accurate</Text>
            </View>
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepLabel}>STEP 6 OF {totalSteps}</Text>
            <Text style={styles.stepTitle}>What amenities do you offer?</Text>
            <Text style={styles.stepSubtitle}>Select all the amenities available at your property</Text>

            <View style={styles.amenitiesList}>
              {AMENITIES.map((amenity) => {
                const isSelected = formData.amenities.includes(amenity.name);
                const Icon = amenity.icon;
                return (
                  <TouchableOpacity
                    key={amenity.name}
                    style={[styles.amenityItem, isSelected && styles.amenityItemSelected]}
                    onPress={() => {
                      if (isSelected) {
                        updateFormData({
                          amenities: formData.amenities.filter((a) => a !== amenity.name),
                        });
                      } else {
                        updateFormData({ amenities: [...formData.amenities, amenity.name] });
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Icon size={20} color={isSelected ? '#4A90E2' : '#999'} />
                    <Text style={[styles.amenityText, isSelected && styles.amenityTextSelected]}>{amenity.name}</Text>
                    <View style={styles.checkbox}>
                      {isSelected && <View style={styles.checkboxInner} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      case 7:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepLabel}>STEP 7 OF {totalSteps}</Text>
            <Text style={styles.stepTitle}>Provide a few final details</Text>
            <Text style={styles.stepSubtitle}>What&apos;s your residential address?</Text>
            <Text style={styles.privacyNote}>Guests won&apos;t see this information.</Text>

            <Text style={styles.fieldLabel}>Country / region</Text>
            <TextInput
              style={styles.textInput}
              value={formData.country}
              onChangeText={(text) => updateFormData({ country: text })}
            />

            <Text style={styles.fieldLabel}>Street address</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter street address"
              value={formData.streetAddress}
              onChangeText={(text) => updateFormData({ streetAddress: text })}
            />

            <Text style={styles.fieldLabel}>Apt, suite, unit (if applicable)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter apartment, suite, or unit"
              value={formData.apt}
              onChangeText={(text) => updateFormData({ apt: text })}
            />

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>City / town</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="City"
                  value={formData.city}
                  onChangeText={(text) => updateFormData({ city: text })}
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>State / territory</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="State"
                  value={formData.state}
                  onChangeText={(text) => updateFormData({ state: text })}
                />
              </View>
            </View>

            <Text style={styles.fieldLabel}>ZIP code</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter ZIP code"
              value={formData.zipCode}
              onChangeText={(text) => updateFormData({ zipCode: text })}
              keyboardType="numeric"
            />
          </View>
        );

      case 8:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepLabel}>STEP 8 OF {totalSteps}</Text>
            <Text style={styles.stepTitle}>Review and publish</Text>
            <Text style={styles.stepSubtitle}>Review your listing before publishing</Text>

            <View style={styles.reviewCard}>
              <View style={styles.reviewIconContainer}>
                <ImageIcon size={20} color="#4A90E2" />
              </View>
              <View style={styles.reviewContent}>
                <Text style={styles.reviewLabel}>Photos</Text>
                <Text style={styles.reviewValue}>Ready to upload</Text>
              </View>
            </View>

            <View style={styles.reviewCard}>
              <View style={styles.reviewIconContainer}>
                <FileText size={20} color="#4A90E2" />
              </View>
              <View style={styles.reviewContent}>
                <Text style={styles.reviewLabel}>Details</Text>
                <Text style={styles.reviewValue}>
                  {formData.propertyType} • {formData.beds} beds • {formData.baths} baths
                </Text>
              </View>
            </View>

            <View style={styles.reviewCard}>
              <View style={styles.reviewIconContainer}>
                <DollarSign size={20} color="#4A90E2" />
              </View>
              <View style={styles.reviewContent}>
                <Text style={styles.reviewLabel}>Price</Text>
                <Text style={styles.reviewValue}>${formData.price}/{formData.listingType === 'rent' ? 'month' : 'sale'}</Text>
              </View>
            </View>

            <View style={styles.reviewCard}>
              <View style={styles.reviewIconContainer}>
                <CheckCircle2 size={20} color="#4A90E2" />
              </View>
              <View style={styles.reviewContent}>
                <Text style={styles.reviewLabel}>Amenities</Text>
                <Text style={styles.reviewValue}>{formData.amenities.length} selected</Text>
              </View>
            </View>
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
        <Animated.View style={{ transform: [{ scale: backFooterScale }] }}>
          <TouchableOpacity style={styles.backFooterButton} onPress={handleBackFooter} activeOpacity={0.8}>
            <Text style={styles.backFooterButtonText}>Back</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={{ flex: 1, transform: [{ scale: nextButtonScale }] }}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.nextButtonText}>
              {currentStep === totalSteps ? 'Publish' : 'Next'}
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
  stepLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#999',
    letterSpacing: 1,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#1a1a1a',
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  optionsGrid: {
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
  optionCardSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#E6F3FF',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginTop: 12,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  propertyTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  propertyTypeCard: {
    width: '48%',
    backgroundColor: '#F0F8FF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  propertyTypeCardSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#E6F3FF',
  },
  propertyTypeText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginTop: 8,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  counterValue: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#1a1a1a',
  },
  counterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  counterButtonText: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#1a1a1a',
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
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F8FF',
    padding: 32,
    borderRadius: 12,
  },
  priceSymbol: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: '#1a1a1a',
  },
  priceInput: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    minWidth: 100,
  },
  descriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  aiButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#4A90E2',
  },
  textArea: {
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#1a1a1a',
    minHeight: 150,
  },
  characterCount: {
    fontSize: 14,
    color: '#999',
    textAlign: 'right',
  },
  tipsBox: {
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  tipItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  amenitiesList: {
    gap: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  amenityItemSelected: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0ea5e9',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4A90E2',
  },
  amenityText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  amenityTextSelected: {
    color: '#1a1a1a',
    fontWeight: '600' as const,
  },
  privacyNote: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic' as const,
  },
  textInput: {
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
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
  reviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  reviewIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewContent: {
    flex: 1,
  },
  reviewLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#666',
    marginBottom: 4,
  },
  reviewValue: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
    alignItems: 'center',
  },
  backFooterButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  backFooterButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1a1a1a',
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
