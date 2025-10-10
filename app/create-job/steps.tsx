import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Switch, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Building, 
  Users, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  ClipboardList,
  Globe,
  Clock,
  Calendar,
  Award,

  Mail,
  Phone,
  Link as LinkIcon,
  Heart,
  Gift,
  TrendingUp
} from 'lucide-react-native';
import { useState, useRef } from 'react';
import { JobOpening, Seniority, EmploymentType, Modality, PayCadence, JOB_CATEGORIES, COMMON_BENEFITS } from '@/mocks/jobs';

const SENIORITY_LEVELS: { value: Seniority; label: string }[] = [
  { value: 'intern', label: 'Intern' },
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid-Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
];

const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'temporary', label: 'Temporary' },
  { value: 'internship', label: 'Internship' },
];

const WORK_MODALITIES: { value: Modality; label: string }[] = [
  { value: 'onsite', label: 'Onsite' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
];

const PAY_CADENCES: { value: PayCadence; label: string }[] = [
  { value: 'hour', label: 'Hourly' },
  { value: 'week', label: 'Weekly' },
  { value: 'month', label: 'Monthly' },
  { value: 'year', label: 'Yearly' },
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export default function CreateJobSteps() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
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
  const [formData, setFormData] = useState<JobOpening>({
    company: {
      name: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      website: '',
    },
    role: {
      title: '',
      category: JOB_CATEGORIES[0] || '',
      seniority: 'mid',
      type: 'full_time',
      description: '',
    },
    location: {
      modality: 'onsite',
      primary: '',
      regions: ['United States'],
      schedule: { days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '9:00 AM', end: '5:00 PM', weekends: false },
    },
    compensation: {
      currency: 'USD',
      payType: 'salary',
      min: 0,
      max: 0,
      cadence: 'year',
      benefits: [],
      equity: '',
    },
    requirements: {
      years: '',
      mustHave: [''],
      niceToHave: [],
      certifications: [],
      authRequired: false,
    },
    screening: {
      method: 'in_app',
      resumeRequired: true,
      quickApply: false,
      questions: [],
    },
    status: 'draft',
  });

  const totalSteps = 7;
  const progress = (currentStep / totalSteps) * 100;



  const updateCompany = (updates: Partial<JobOpening['company']>) => {
    setFormData((prev) => ({ ...prev, company: { ...prev.company, ...updates } }));
  };

  const updateRole = (updates: Partial<JobOpening['role']>) => {
    setFormData((prev) => ({ ...prev, role: { ...prev.role, ...updates } }));
  };

  const updateLocation = (updates: Partial<JobOpening['location']>) => {
    setFormData((prev) => ({ ...prev, location: { ...prev.location, ...updates } }));
  };

  const updateCompensation = (updates: Partial<JobOpening['compensation']>) => {
    setFormData((prev) => ({ ...prev, compensation: { ...prev.compensation, ...updates } }));
  };

  const updateRequirements = (updates: Partial<JobOpening['requirements']>) => {
    setFormData((prev) => ({ ...prev, requirements: { ...prev.requirements, ...updates } }));
  };

  const updateScreening = (updates: Partial<JobOpening['screening']>) => {
    setFormData((prev) => ({ ...prev, screening: { ...prev.screening, ...updates } }));
  };

  const handleNext = () => {
    animateButton(nextButtonScale, () => {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
      } else {
        router.push('/publish-signup' as any);
      }
    });
  };

  const handleBack = () => {
    animateButton(backButtonScale, () => {
      if (currentStep > 1) {
        setCurrentStep((prev) => prev - 1);
      } else {
        router.back();
      }
    });
  };

  const handleBackFooter = () => {
    animateButton(backFooterScale, () => {
      if (currentStep > 1) {
        setCurrentStep((prev) => prev - 1);
      } else {
        router.back();
      }
    });
  };

  const addMustHaveSkill = () => {
    updateRequirements({ mustHave: [...formData.requirements.mustHave, ''] });
  };

  const updateMustHaveSkill = (index: number, value: string) => {
    const newSkills = [...formData.requirements.mustHave];
    newSkills[index] = value;
    updateRequirements({ mustHave: newSkills });
  };

  const removeMustHaveSkill = (index: number) => {
    const newSkills = formData.requirements.mustHave.filter((_, i) => i !== index);
    updateRequirements({ mustHave: newSkills });
  };

  const toggleBenefit = (benefit: string) => {
    const benefits = formData.compensation.benefits || [];
    if (benefits.includes(benefit)) {
      updateCompensation({ benefits: benefits.filter((b) => b !== benefit) });
    } else {
      updateCompensation({ benefits: [...benefits, benefit] });
    }
  };

  const toggleScheduleDay = (day: string) => {
    const days = formData.location.schedule?.days || [];
    if (days.includes(day)) {
      updateLocation({ schedule: { ...formData.location.schedule, days: days.filter((d) => d !== day) } });
    } else {
      updateLocation({ schedule: { ...formData.location.schedule, days: [...days, day] } });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepLabel}>STEP 1 OF {totalSteps}</Text>
            <Text style={styles.stepTitle}>Company & Contact</Text>
            <Text style={styles.stepSubtitle}>Tell us about your company</Text>

            <Text style={styles.fieldLabel}>Company Name *</Text>
            <View style={styles.inputContainer}>
              <Building size={20} color="#999" />
              <TextInput
                style={styles.input}
                placeholder="e.g. TechCorp Inc."
                value={formData.company.name}
                onChangeText={(text) => updateCompany({ name: text })}
              />
            </View>

            <Text style={styles.fieldLabel}>Contact Name *</Text>
            <View style={styles.inputContainer}>
              <Users size={20} color="#999" />
              <TextInput
                style={styles.input}
                placeholder="e.g. John Smith"
                value={formData.company.contactName}
                onChangeText={(text) => updateCompany({ contactName: text })}
              />
            </View>

            <Text style={styles.fieldLabel}>Contact Email *</Text>
            <View style={styles.inputContainer}>
              <Mail size={20} color="#999" />
              <TextInput
                style={styles.input}
                placeholder="e.g. john@company.com"
                value={formData.company.contactEmail}
                onChangeText={(text) => updateCompany({ contactEmail: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Text style={styles.fieldLabel}>Contact Phone (Optional)</Text>
            <View style={styles.inputContainer}>
              <Phone size={20} color="#999" />
              <TextInput
                style={styles.input}
                placeholder="e.g. (555) 123-4567"
                value={formData.company.contactPhone}
                onChangeText={(text) => updateCompany({ contactPhone: text })}
                keyboardType="phone-pad"
              />
            </View>

            <Text style={styles.fieldLabel}>Company Website (Optional)</Text>
            <View style={styles.inputContainer}>
              <LinkIcon size={20} color="#999" />
              <TextInput
                style={styles.input}
                placeholder="e.g. https://company.com"
                value={formData.company.website}
                onChangeText={(text) => updateCompany({ website: text })}
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepLabel}>STEP 2 OF {totalSteps}</Text>
            <Text style={styles.stepTitle}>Role Details</Text>
            <Text style={styles.stepSubtitle}>Describe the position</Text>

            <Text style={styles.fieldLabel}>Job Title *</Text>
            <View style={styles.inputContainer}>
              <Briefcase size={20} color="#999" />
              <TextInput
                style={styles.input}
                placeholder="e.g. Senior Software Engineer"
                value={formData.role.title}
                onChangeText={(text) => updateRole({ title: text })}
              />
            </View>

            <Text style={styles.fieldLabel}>Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              <View style={styles.categoryGrid}>
                {JOB_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      formData.role.category === cat && styles.categoryChipSelected,
                    ]}
                    onPress={() => updateRole({ category: cat })}
                  >
                    <Text style={[styles.categoryText, formData.role.category === cat && styles.categoryTextSelected]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <Text style={styles.fieldLabel}>Seniority Level *</Text>
            <View style={styles.optionsGrid}>
              {SENIORITY_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level.value}
                  style={[
                    styles.optionCard,
                    formData.role.seniority === level.value && styles.optionCardSelected,
                  ]}
                  onPress={() => updateRole({ seniority: level.value })}
                >
                  <Award size={20} color="#10B981" />
                  <Text style={styles.optionText}>{level.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Employment Type *</Text>
            <View style={styles.optionsGrid}>
              {EMPLOYMENT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.optionCard,
                    formData.role.type === type.value && styles.optionCardSelected,
                  ]}
                  onPress={() => updateRole({ type: type.value })}
                >
                  <Clock size={20} color="#10B981" />
                  <Text style={styles.optionText}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Job Description * (min 120 characters)</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
              value={formData.role.description}
              onChangeText={(text) => updateRole({ description: text })}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
            />
            <Text style={[styles.characterCount, formData.role.description.length < 120 && styles.characterCountError]}>
              {formData.role.description.length} / 120 characters
            </Text>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepLabel}>STEP 3 OF {totalSteps}</Text>
            <Text style={styles.stepTitle}>Location & Schedule</Text>
            <Text style={styles.stepSubtitle}>Where will this person work?</Text>

            <Text style={styles.fieldLabel}>Work Modality *</Text>
            <View style={styles.modalityGrid}>
              {WORK_MODALITIES.map((modality) => (
                <TouchableOpacity
                  key={modality.value}
                  style={[
                    styles.modalityCard,
                    formData.location.modality === modality.value && styles.modalityCardSelected,
                  ]}
                  onPress={() => updateLocation({ modality: modality.value })}
                >
                  <Globe size={24} color="#10B981" />
                  <Text style={styles.modalityText}>{modality.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {formData.location.modality !== 'remote' && (
              <>
                <Text style={styles.fieldLabel}>Primary Location *</Text>
                <View style={styles.inputContainer}>
                  <MapPin size={20} color="#999" />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. San Francisco, CA"
                    value={formData.location.primary}
                    onChangeText={(text) => updateLocation({ primary: text })}
                  />
                </View>
              </>
            )}

            <Text style={styles.fieldLabel}>Work Schedule</Text>
            <View style={styles.scheduleContainer}>
              <Text style={styles.scheduleLabel}>Working Days</Text>
              <View style={styles.daysGrid}>
                {WEEKDAYS.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayChip,
                      formData.location.schedule?.days.includes(day) && styles.dayChipSelected,
                    ]}
                    onPress={() => toggleScheduleDay(day)}
                  >
                    <Text style={[
                      styles.dayText,
                      formData.location.schedule?.days.includes(day) && styles.dayTextSelected,
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.timeRow}>
                <View style={styles.timeField}>
                  <Text style={styles.timeLabel}>Start Time</Text>
                  <TextInput
                    style={styles.timeInput}
                    placeholder="9:00 AM"
                    value={formData.location.schedule?.start}
                    onChangeText={(text) => updateLocation({ 
                      schedule: { 
                        days: formData.location.schedule?.days || [],
                        start: text,
                        end: formData.location.schedule?.end,
                        weekends: formData.location.schedule?.weekends
                      } 
                    })}
                  />
                </View>
                <View style={styles.timeField}>
                  <Text style={styles.timeLabel}>End Time</Text>
                  <TextInput
                    style={styles.timeInput}
                    placeholder="5:00 PM"
                    value={formData.location.schedule?.end}
                    onChangeText={(text) => updateLocation({ 
                      schedule: { 
                        days: formData.location.schedule?.days || [],
                        start: formData.location.schedule?.start,
                        end: text,
                        weekends: formData.location.schedule?.weekends
                      } 
                    })}
                  />
                </View>
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Weekend work required</Text>
                <Switch
                  value={formData.location.schedule?.weekends}
                  onValueChange={(value) => updateLocation({ 
                    schedule: { 
                      days: formData.location.schedule?.days || [],
                      start: formData.location.schedule?.start,
                      end: formData.location.schedule?.end,
                      weekends: value
                    } 
                  })}
                  trackColor={{ false: '#ccc', true: '#10B981' }}
                  thumbColor="#fff"
                />
              </View>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepLabel}>STEP 4 OF {totalSteps}</Text>
            <Text style={styles.stepTitle}>Compensation & Benefits</Text>
            <Text style={styles.stepSubtitle}>What will you offer?</Text>

            <Text style={styles.fieldLabel}>Pay Type *</Text>
            <View style={styles.payTypeRow}>
              <TouchableOpacity
                style={[
                  styles.payTypeButton,
                  formData.compensation.payType === 'hourly' && styles.payTypeButtonSelected,
                ]}
                onPress={() => updateCompensation({ payType: 'hourly', cadence: 'hour' })}
              >
                <Clock size={20} color={formData.compensation.payType === 'hourly' ? '#10B981' : '#999'} />
                <Text style={[
                  styles.payTypeText,
                  formData.compensation.payType === 'hourly' && styles.payTypeTextSelected,
                ]}>
                  Hourly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.payTypeButton,
                  formData.compensation.payType === 'salary' && styles.payTypeButtonSelected,
                ]}
                onPress={() => updateCompensation({ payType: 'salary', cadence: 'year' })}
              >
                <DollarSign size={20} color={formData.compensation.payType === 'salary' ? '#10B981' : '#999'} />
                <Text style={[
                  styles.payTypeText,
                  formData.compensation.payType === 'salary' && styles.payTypeTextSelected,
                ]}>
                  Salary
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Pay Range *</Text>
            <View style={styles.rangeContainer}>
              <View style={styles.rangeField}>
                <Text style={styles.rangeLabel}>Minimum</Text>
                <View style={styles.salaryContainer}>
                  <Text style={styles.salarySymbol}>$</Text>
                  <TextInput
                    style={styles.salaryInput}
                    placeholder="80,000"
                    value={formData.compensation.min > 0 ? formData.compensation.min.toString() : ''}
                    onChangeText={(text) => updateCompensation({ min: parseInt(text.replace(/,/g, '')) || 0 })}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <View style={styles.rangeField}>
                <Text style={styles.rangeLabel}>Maximum</Text>
                <View style={styles.salaryContainer}>
                  <Text style={styles.salarySymbol}>$</Text>
                  <TextInput
                    style={styles.salaryInput}
                    placeholder="120,000"
                    value={formData.compensation.max > 0 ? formData.compensation.max.toString() : ''}
                    onChangeText={(text) => updateCompensation({ max: parseInt(text.replace(/,/g, '')) || 0 })}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            <Text style={styles.fieldLabel}>Pay Cadence *</Text>
            <View style={styles.cadenceGrid}>
              {PAY_CADENCES.map((cadence) => (
                <TouchableOpacity
                  key={cadence.value}
                  style={[
                    styles.cadenceChip,
                    formData.compensation.cadence === cadence.value && styles.cadenceChipSelected,
                  ]}
                  onPress={() => updateCompensation({ cadence: cadence.value })}
                >
                  <Text style={[
                    styles.cadenceText,
                    formData.compensation.cadence === cadence.value && styles.cadenceTextSelected,
                  ]}>
                    {cadence.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Equity (Optional)</Text>
            <View style={styles.inputContainer}>
              <TrendingUp size={20} color="#999" />
              <TextInput
                style={styles.input}
                placeholder="e.g. 0.1% - 0.5%"
                value={formData.compensation.equity}
                onChangeText={(text) => updateCompensation({ equity: text })}
              />
            </View>

            <Text style={styles.fieldLabel}>Benefits</Text>
            <View style={styles.benefitsList}>
              {COMMON_BENEFITS.map((benefit) => {
                const isSelected = formData.compensation.benefits?.includes(benefit);
                return (
                  <TouchableOpacity
                    key={benefit}
                    style={[styles.benefitItem, isSelected && styles.benefitItemSelected]}
                    onPress={() => toggleBenefit(benefit)}
                    activeOpacity={0.7}
                  >
                    <Gift size={16} color={isSelected ? '#10B981' : '#999'} />
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

      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepLabel}>STEP 5 OF {totalSteps}</Text>
            <Text style={styles.stepTitle}>Requirements</Text>
            <Text style={styles.stepSubtitle}>What qualifications are needed?</Text>

            <Text style={styles.fieldLabel}>Years of Experience</Text>
            <View style={styles.inputContainer}>
              <Calendar size={20} color="#999" />
              <TextInput
                style={styles.input}
                placeholder="e.g. 2-4 years"
                value={formData.requirements.years}
                onChangeText={(text) => updateRequirements({ years: text })}
              />
            </View>

            <Text style={styles.fieldLabel}>Must-Have Skills * (at least 1)</Text>
            {formData.requirements.mustHave.map((skill, index) => (
              <View key={index} style={styles.skillRow}>
                <TextInput
                  style={styles.skillInput}
                  placeholder={`Skill ${index + 1}`}
                  value={skill}
                  onChangeText={(text) => updateMustHaveSkill(index, text)}
                />
                {formData.requirements.mustHave.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeMustHaveSkill(index)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}

            <TouchableOpacity style={styles.addButton} onPress={addMustHaveSkill}>
              <Text style={styles.addButtonText}>+ Add Skill</Text>
            </TouchableOpacity>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Work authorization required</Text>
              <Switch
                value={formData.requirements.authRequired}
                onValueChange={(value) => updateRequirements({ authRequired: value })}
                trackColor={{ false: '#ccc', true: '#10B981' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepLabel}>STEP 6 OF {totalSteps}</Text>
            <Text style={styles.stepTitle}>Screening & Application</Text>
            <Text style={styles.stepSubtitle}>How should candidates apply?</Text>

            <Text style={styles.fieldLabel}>Application Method *</Text>
            <TouchableOpacity
              style={[
                styles.methodCard,
                formData.screening.method === 'in_app' && styles.methodCardSelected,
              ]}
              onPress={() => updateScreening({ method: 'in_app' })}
            >
              <ClipboardList size={24} color="#10B981" />
              <View style={styles.methodContent}>
                <Text style={styles.methodTitle}>Apply in-app</Text>
                <Text style={styles.methodDescription}>Candidates apply directly through SpaceGig</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.methodCard,
                formData.screening.method === 'external' && styles.methodCardSelected,
              ]}
              onPress={() => updateScreening({ method: 'external' })}
            >
              <LinkIcon size={24} color="#10B981" />
              <View style={styles.methodContent}>
                <Text style={styles.methodTitle}>External URL</Text>
                <Text style={styles.methodDescription}>Redirect to your application page</Text>
              </View>
            </TouchableOpacity>

            {formData.screening.method === 'external' && (
              <View style={styles.inputContainer}>
                <LinkIcon size={20} color="#999" />
                <TextInput
                  style={styles.input}
                  placeholder="https://company.com/apply"
                  value={formData.screening.externalUrl}
                  onChangeText={(text) => updateScreening({ externalUrl: text })}
                  keyboardType="url"
                  autoCapitalize="none"
                />
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.methodCard,
                formData.screening.method === 'email' && styles.methodCardSelected,
              ]}
              onPress={() => updateScreening({ method: 'email' })}
            >
              <Mail size={24} color="#10B981" />
              <View style={styles.methodContent}>
                <Text style={styles.methodTitle}>Email applications</Text>
                <Text style={styles.methodDescription}>Receive applications via email</Text>
              </View>
            </TouchableOpacity>

            {formData.screening.method === 'email' && (
              <View style={styles.inputContainer}>
                <Mail size={20} color="#999" />
                <TextInput
                  style={styles.input}
                  placeholder="jobs@company.com"
                  value={formData.screening.email}
                  onChangeText={(text) => updateScreening({ email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            )}

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Resume required</Text>
              <Switch
                value={formData.screening.resumeRequired}
                onValueChange={(value) => updateScreening({ resumeRequired: value })}
                trackColor={{ false: '#ccc', true: '#10B981' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Enable quick apply</Text>
              <Switch
                value={formData.screening.quickApply}
                onValueChange={(value) => updateScreening({ quickApply: value })}
                trackColor={{ false: '#ccc', true: '#10B981' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        );

      case 7:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepLabel}>STEP 7 OF {totalSteps}</Text>
            <Text style={styles.stepTitle}>Review & Publish</Text>
            <Text style={styles.stepSubtitle}>Review your job listing before publishing</Text>

            <View style={styles.reviewCard}>
              <View style={styles.reviewIconContainer}>
                <Building size={20} color="#10B981" />
              </View>
              <View style={styles.reviewContent}>
                <Text style={styles.reviewLabel}>Company</Text>
                <Text style={styles.reviewValue}>{formData.company.name || 'Not set'}</Text>
              </View>
            </View>

            <View style={styles.reviewCard}>
              <View style={styles.reviewIconContainer}>
                <Briefcase size={20} color="#10B981" />
              </View>
              <View style={styles.reviewContent}>
                <Text style={styles.reviewLabel}>Role</Text>
                <Text style={styles.reviewValue}>
                  {formData.role.title || 'Not set'} • {formData.role.seniority}
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
                  {formData.location.modality === 'remote' 
                    ? 'Remote' 
                    : formData.location.primary || 'Not set'} • {formData.location.modality}
                </Text>
              </View>
            </View>

            <View style={styles.reviewCard}>
              <View style={styles.reviewIconContainer}>
                <DollarSign size={20} color="#10B981" />
              </View>
              <View style={styles.reviewContent}>
                <Text style={styles.reviewLabel}>Compensation</Text>
                <Text style={styles.reviewValue}>
                  ${formData.compensation.min.toLocaleString()} - ${formData.compensation.max.toLocaleString()} / {formData.compensation.cadence}
                </Text>
              </View>
            </View>

            <View style={styles.reviewCard}>
              <View style={styles.reviewIconContainer}>
                <Heart size={20} color="#10B981" />
              </View>
              <View style={styles.reviewContent}>
                <Text style={styles.reviewLabel}>Benefits</Text>
                <Text style={styles.reviewValue}>
                  {formData.compensation.benefits?.length || 0} selected
                </Text>
              </View>
            </View>

            <View style={styles.reviewCard}>
              <View style={styles.reviewIconContainer}>
                <CheckCircle2 size={20} color="#10B981" />
              </View>
              <View style={styles.reviewContent}>
                <Text style={styles.reviewLabel}>Requirements</Text>
                <Text style={styles.reviewValue}>
                  {formData.requirements.mustHave.filter(s => s.trim()).length} must-have skills
                </Text>
              </View>
            </View>

            <View style={styles.reviewCard}>
              <View style={styles.reviewIconContainer}>
                <ClipboardList size={20} color="#10B981" />
              </View>
              <View style={styles.reviewContent}>
                <Text style={styles.reviewLabel}>Application Method</Text>
                <Text style={styles.reviewValue}>
                  {formData.screening.method === 'in_app' ? 'In-app' : 
                   formData.screening.method === 'external' ? 'External URL' : 'Email'}
                </Text>
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
  categoryScroll: {
    marginBottom: 8,
  },
  categoryGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  categoryChipSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#10B981',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#666',
  },
  categoryTextSelected: {
    color: '#10B981',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    width: '48%',
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 8,
  },
  optionCardSelected: {
    borderColor: '#10B981',
    backgroundColor: '#D1FAE5',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600' as const,
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
  characterCountError: {
    color: '#f44',
  },
  modalityGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  modalityCard: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 8,
  },
  modalityCardSelected: {
    borderColor: '#10B981',
    backgroundColor: '#D1FAE5',
  },
  modalityText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1a1a1a',
  },
  scheduleContainer: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  scheduleLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1a1a1a',
  },
  daysGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  dayChip: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  dayChipSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#666',
  },
  dayTextSelected: {
    color: '#fff',
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeField: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#666',
    marginBottom: 8,
  },
  timeInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    color: '#1a1a1a',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500' as const,
  },
  payTypeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  payTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  payTypeButtonSelected: {
    borderColor: '#10B981',
    backgroundColor: '#D1FAE5',
  },
  payTypeText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#666',
  },
  payTypeTextSelected: {
    color: '#10B981',
  },
  rangeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  rangeField: {
    flex: 1,
  },
  rangeLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#666',
    marginBottom: 8,
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
  },
  salarySymbol: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginRight: 8,
  },
  salaryInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1a1a1a',
  },
  cadenceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cadenceChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  cadenceChipSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#10B981',
  },
  cadenceText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#666',
  },
  cadenceTextSelected: {
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
  skillRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  skillInput: {
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
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodCardSelected: {
    borderColor: '#10B981',
    backgroundColor: '#D1FAE5',
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: '#666',
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
