import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Briefcase, MapPin, DollarSign, CheckCircle2, Users, Clock } from 'lucide-react-native';
import { useState } from 'react';

type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';

interface JobFormData {
  title: string;
  company: string;
  description: string;
  salaryMin: string;
  salaryMax: string;
  jobType: JobType;
  location: string;
  remote: boolean;
  requirements: string[];
  benefits: string[];
  city: string;
  state: string;
  country: string;
}

const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
];

const COMMON_BENEFITS = [
  'Health insurance',
  'Dental insurance',
  'Vision insurance',
  '401(k) matching',
  'Remote work',
  'Flexible hours',
  'Unlimited PTO',
  'Paid time off',
  'Professional development',
  'Stock options',
  'Gym membership',
  'Commuter benefits',
];

export default function CreateJobSteps() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    company: '',
    description: '',
    salaryMin: '',
    salaryMax: '',
    jobType: 'full-time',
    location: '',
    remote: false,
    requirements: [''],
    benefits: [],
    city: '',
    state: '',
    country: 'United States',
  });

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (updates: Partial<JobFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      router.push('/publish-signup' as any);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  const addRequirement = () => {
    updateFormData({ requirements: [...formData.requirements, ''] });
  };

  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    updateFormData({ requirements: newRequirements });
  };

  const removeRequirement = (index: number) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    updateFormData({ requirements: newRequirements });
  };

  const toggleBenefit = (benefit: string) => {
    if (formData.benefits.includes(benefit)) {
      updateFormData({ benefits: formData.benefits.filter((b) => b !== benefit) });
    } else {
      updateFormData({ benefits: [...formData.benefits, benefit] });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepLabel}>STEP 1 OF {totalSteps}</Text>
            <Text style={styles.stepTitle}>Job title and company</Text>
            <Text style={styles.stepSubtitle}>What position are you hiring for?</Text>

            <Text style={styles.fieldLabel}>Job Title</Text>
            <View style={styles.inputContainer}>
              <Briefcase size={20} color="#999" />
              <TextInput
                style={styles.input}
                placeholder="e.g. Senior Software Engineer"
                value={formData.title}
                onChangeText={(text) => updateFormData({ title: text })}
              />
            </View>

            <Text style={styles.fieldLabel}>Company Name</Text>
            <View style={styles.inputContainer}>
              <Users size={20} color="#999" />
              <TextInput
                style={styles.input}
                placeholder="e.g. TechCorp Inc."
                value={formData.company}
                onChangeText={(text) => updateFormData({ company: text })}
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepLabel}>STEP 2 OF {totalSteps}</Text>
            <Text style={styles.stepTitle}>Job type and location</Text>
            <Text style={styles.stepSubtitle}>Tell us about the work arrangement</Text>

            <Text style={styles.fieldLabel}>Job Type</Text>
            <View style={styles.jobTypeGrid}>
              {JOB_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.jobTypeCard,
                    formData.jobType === type.value && styles.jobTypeCardSelected,
                  ]}
                  onPress={() => updateFormData({ jobType: type.value })}
                >
                  <Clock size={24} color="#10B981" />
                  <Text style={styles.jobTypeText}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Location</Text>
            <View style={styles.inputContainer}>
              <MapPin size={20} color="#999" />
              <TextInput
                style={styles.input}
                placeholder="e.g. San Francisco, CA"
                value={formData.location}
                onChangeText={(text) => updateFormData({ location: text })}
              />
            </View>

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Remote work available</Text>
              <Switch
                value={formData.remote}
                onValueChange={(value) => updateFormData({ remote: value })}
                trackColor={{ false: '#ccc', true: '#10B981' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepLabel}>STEP 3 OF {totalSteps}</Text>
            <Text style={styles.stepTitle}>Salary range</Text>
            <Text style={styles.stepSubtitle}>What is the compensation for this role?</Text>

            <Text style={styles.fieldLabel}>Minimum Salary (Annual)</Text>
            <View style={styles.salaryContainer}>
              <Text style={styles.salarySymbol}>$</Text>
              <TextInput
                style={styles.salaryInput}
                placeholder="80,000"
                value={formData.salaryMin}
                onChangeText={(text) => updateFormData({ salaryMin: text })}
                keyboardType="numeric"
              />
            </View>

            <Text style={styles.fieldLabel}>Maximum Salary (Annual)</Text>
            <View style={styles.salaryContainer}>
              <Text style={styles.salarySymbol}>$</Text>
              <TextInput
                style={styles.salaryInput}
                placeholder="120,000"
                value={formData.salaryMax}
                onChangeText={(text) => updateFormData({ salaryMax: text })}
                keyboardType="numeric"
              />
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepLabel}>STEP 4 OF {totalSteps}</Text>
            <Text style={styles.stepTitle}>Job description</Text>
            <Text style={styles.stepSubtitle}>
              Describe the role and what you&apos;re looking for
            </Text>

            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
              value={formData.description}
              onChangeText={(text) => updateFormData({ description: text })}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>{formData.description.length} characters</Text>
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepLabel}>STEP 5 OF {totalSteps}</Text>
            <Text style={styles.stepTitle}>Requirements</Text>
            <Text style={styles.stepSubtitle}>What qualifications are needed?</Text>

            <Text style={styles.fieldLabel}>Job Requirements</Text>
            {formData.requirements.map((req, index) => (
              <View key={index} style={styles.requirementRow}>
                <TextInput
                  style={styles.requirementInput}
                  placeholder={`Requirement ${index + 1}`}
                  value={req}
                  onChangeText={(text) => updateRequirement(index, text)}
                />
                {formData.requirements.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeRequirement(index)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}

            <TouchableOpacity style={styles.addButton} onPress={addRequirement}>
              <Text style={styles.addButtonText}>+ Add Requirement</Text>
            </TouchableOpacity>

            <Text style={styles.fieldLabel}>Benefits</Text>
            <View style={styles.benefitsList}>
              {COMMON_BENEFITS.map((benefit) => {
                const isSelected = formData.benefits.includes(benefit);
                return (
                  <TouchableOpacity
                    key={benefit}
                    style={[styles.benefitItem, isSelected && styles.benefitItemSelected]}
                    onPress={() => toggleBenefit(benefit)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.benefitText, isSelected && styles.benefitTextSelected]}>
                      {benefit}
                    </Text>
                    <View style={styles.checkbox}>
                      {isSelected && <View style={styles.checkboxInner} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepLabel}>STEP 6 OF {totalSteps}</Text>
            <Text style={styles.stepTitle}>Review and publish</Text>
            <Text style={styles.stepSubtitle}>Review your job listing before publishing</Text>

            <View style={styles.reviewCard}>
              <View style={styles.reviewIconContainer}>
                <Briefcase size={20} color="#10B981" />
              </View>
              <View style={styles.reviewContent}>
                <Text style={styles.reviewLabel}>Job Title</Text>
                <Text style={styles.reviewValue}>{formData.title || 'Not set'}</Text>
              </View>
            </View>

            <View style={styles.reviewCard}>
              <View style={styles.reviewIconContainer}>
                <Users size={20} color="#10B981" />
              </View>
              <View style={styles.reviewContent}>
                <Text style={styles.reviewLabel}>Company</Text>
                <Text style={styles.reviewValue}>{formData.company || 'Not set'}</Text>
              </View>
            </View>

            <View style={styles.reviewCard}>
              <View style={styles.reviewIconContainer}>
                <DollarSign size={20} color="#10B981" />
              </View>
              <View style={styles.reviewContent}>
                <Text style={styles.reviewLabel}>Salary Range</Text>
                <Text style={styles.reviewValue}>
                  ${formData.salaryMin || '0'} - ${formData.salaryMax || '0'}
                </Text>
              </View>
            </View>

            <View style={styles.reviewCard}>
              <View style={styles.reviewIconContainer}>
                <MapPin size={20} color="#10B981" />
              </View>
              <View style={styles.reviewContent}>
                <Text style={styles.reviewLabel}>Location</Text>
                <Text style={styles.reviewValue}>
                  {formData.location || 'Not set'}
                  {formData.remote && ' • Remote'}
                </Text>
              </View>
            </View>

            <View style={styles.reviewCard}>
              <View style={styles.reviewIconContainer}>
                <CheckCircle2 size={20} color="#10B981" />
              </View>
              <View style={styles.reviewContent}>
                <Text style={styles.reviewLabel}>Benefits</Text>
                <Text style={styles.reviewValue}>{formData.benefits.length} selected</Text>
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
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {renderStepContent()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backFooterButton} onPress={handleBack}>
          <Text style={styles.backFooterButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentStep === totalSteps ? 'Publish' : 'Next'}
          </Text>
        </TouchableOpacity>
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
    backgroundColor: '#10B981',
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
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  jobTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  jobTypeCard: {
    width: '48%',
    backgroundColor: '#E8F5E9',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  jobTypeCardSelected: {
    borderColor: '#10B981',
    backgroundColor: '#D1FAE5',
  },
  jobTypeText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginTop: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500' as const,
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 20,
    borderRadius: 12,
  },
  salarySymbol: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginRight: 8,
  },
  salaryInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#1a1a1a',
  },
  textArea: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#1a1a1a',
    minHeight: 200,
  },
  characterCount: {
    fontSize: 14,
    color: '#999',
    textAlign: 'right',
  },
  requirementRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  requirementInput: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 24,
    color: '#f44',
    fontWeight: '600' as const,
  },
  addButton: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#10B981',
    borderStyle: 'dashed' as const,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#10B981',
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  benefitItemSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#10B981',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
  },
  benefitText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  benefitTextSelected: {
    color: '#1a1a1a',
    fontWeight: '600' as const,
  },
  reviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
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
    backgroundColor: '#10B981',
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
