import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Users,
  FileText,
  Tag,
  Image as ImageIcon,
  Lock,
  Unlock,
  Check,
} from 'lucide-react-native';
import { useCommunity } from '@/contexts/CommunityContext';
import { useApp } from '@/contexts/AppContext';

type Step = 'name' | 'category' | 'description' | 'privacy' | 'image' | 'review';

const CATEGORIES = [
  'Faith & Spirituality',
  'Professional Networking',
  'Housing',
  'Health & Fitness',
  'Food & Culture',
  'Family & Parenting',
  'Education',
  'Entertainment',
  'Sports',
  'Technology',
  'Arts & Crafts',
  'Other',
];

export default function CreateGroupSteps() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { createGroup } = useCommunity();
  const { user } = useApp();
  const [currentStep, setCurrentStep] = useState<Step>('name');
  const [groupData, setGroupData] = useState({
    name: '',
    category: '',
    description: '',
    isOpen: true,
    coverImage: '',
  });

  const steps: Step[] = ['name', 'category', 'description', 'privacy', 'image', 'review'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
    } else {
      router.back();
    }
  };

  const handleCreateGroup = async () => {
    if (!user) return;

    await createGroup({
      name: groupData.name,
      description: groupData.description,
      category: groupData.category,
      coverImage: groupData.coverImage,
      isOpen: groupData.isOpen,
      adminIds: [user.id],
      subgroups: [],
    });

    router.push('/(tabs)/community');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'name':
        return groupData.name.trim().length > 0;
      case 'category':
        return groupData.category.length > 0;
      case 'description':
        return groupData.description.trim().length > 0;
      case 'privacy':
        return true;
      case 'image':
        return true;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'name':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Users size={48} color="#4A90E2" />
            </View>
            <Text style={styles.stepTitle}>Name Your Group</Text>
            <Text style={styles.stepDescription}>
              Choose a clear, descriptive name that helps people understand what your group is about
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., DMV Tech Professionals"
              placeholderTextColor="#999"
              value={groupData.name}
              onChangeText={(text) => setGroupData({ ...groupData, name: text })}
              autoFocus
              maxLength={50}
            />
            <Text style={styles.charCount}>{groupData.name.length}/50</Text>
          </View>
        );

      case 'category':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Tag size={48} color="#4A90E2" />
            </View>
            <Text style={styles.stepTitle}>Choose a Category</Text>
            <Text style={styles.stepDescription}>
              Select the category that best represents your group
            </Text>
            <ScrollView style={styles.categoryScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      groupData.category === category && styles.categoryButtonActive,
                    ]}
                    onPress={() => setGroupData({ ...groupData, category })}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        groupData.category === category && styles.categoryTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        );

      case 'description':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <FileText size={48} color="#4A90E2" />
            </View>
            <Text style={styles.stepTitle}>Describe Your Group</Text>
            <Text style={styles.stepDescription}>
              Help people understand what your group is about and what they can expect
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Share what makes your group special, topics you'll discuss, activities you'll do, and who should join..."
              placeholderTextColor="#999"
              value={groupData.description}
              onChangeText={(text) => setGroupData({ ...groupData, description: text })}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.charCount}>{groupData.description.length}/500</Text>
          </View>
        );

      case 'privacy':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Lock size={48} color="#4A90E2" />
            </View>
            <Text style={styles.stepTitle}>Set Privacy Level</Text>
            <Text style={styles.stepDescription}>
              Decide who can join your group and how
            </Text>
            <View style={styles.privacyOptions}>
              <TouchableOpacity
                style={[
                  styles.privacyCard,
                  groupData.isOpen && styles.privacyCardActive,
                ]}
                onPress={() => setGroupData({ ...groupData, isOpen: true })}
                activeOpacity={0.8}
              >
                <View style={styles.privacyIconContainer}>
                  <Unlock size={32} color={groupData.isOpen ? '#4A90E2' : '#666'} />
                </View>
                <Text
                  style={[
                    styles.privacyTitle,
                    groupData.isOpen && styles.privacyTitleActive,
                  ]}
                >
                  Open Group
                </Text>
                <Text style={styles.privacyDescription}>
                  Anyone can join instantly without approval
                </Text>
                {groupData.isOpen && (
                  <View style={styles.checkBadge}>
                    <Check size={16} color="#fff" strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.privacyCard,
                  !groupData.isOpen && styles.privacyCardActive,
                ]}
                onPress={() => setGroupData({ ...groupData, isOpen: false })}
                activeOpacity={0.8}
              >
                <View style={styles.privacyIconContainer}>
                  <Lock size={32} color={!groupData.isOpen ? '#4A90E2' : '#666'} />
                </View>
                <Text
                  style={[
                    styles.privacyTitle,
                    !groupData.isOpen && styles.privacyTitleActive,
                  ]}
                >
                  Private Group
                </Text>
                <Text style={styles.privacyDescription}>
                  People must request to join and wait for admin approval
                </Text>
                {!groupData.isOpen && (
                  <View style={styles.checkBadge}>
                    <Check size={16} color="#fff" strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'image':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <ImageIcon size={48} color="#4A90E2" />
            </View>
            <Text style={styles.stepTitle}>Add a Cover Image</Text>
            <Text style={styles.stepDescription}>
              Choose an image that represents your group (optional)
            </Text>
            
            {groupData.coverImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: groupData.coverImage }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setGroupData({ ...groupData, coverImage: '' })}
                  activeOpacity={0.8}
                >
                  <Text style={styles.removeImageText}>Remove Image</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <ImageIcon size={64} color="#ccc" />
                <Text style={styles.imagePlaceholderText}>No image selected</Text>
                <View style={styles.imageUrlInput}>
                  <TextInput
                    style={styles.input}
                    placeholder="Paste image URL (e.g., from Unsplash)"
                    placeholderTextColor="#999"
                    value={groupData.coverImage}
                    onChangeText={(text) => setGroupData({ ...groupData, coverImage: text })}
                    autoCapitalize="none"
                  />
                </View>
              </View>
            )}
            
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleNext}
              activeOpacity={0.7}
            >
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        );

      case 'review':
        return (
          <ScrollView style={styles.reviewScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.stepContainer}>
              <View style={styles.iconContainer}>
                <Check size={48} color="#4A90E2" />
              </View>
              <Text style={styles.stepTitle}>Review Your Group</Text>
              <Text style={styles.stepDescription}>
                Check everything looks good before creating your group
              </Text>

              <View style={styles.reviewCard}>
                {groupData.coverImage ? (
                  <Image source={{ uri: groupData.coverImage }} style={styles.reviewImage} />
                ) : (
                  <View style={[styles.reviewImage, styles.reviewImagePlaceholder]}>
                    <Users size={48} color="#ccc" />
                  </View>
                )}

                <View style={styles.reviewContent}>
                  <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Group Name</Text>
                    <Text style={styles.reviewValue}>{groupData.name}</Text>
                  </View>

                  <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Category</Text>
                    <Text style={styles.reviewValue}>{groupData.category}</Text>
                  </View>

                  <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Description</Text>
                    <Text style={styles.reviewValue}>{groupData.description}</Text>
                  </View>

                  <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Privacy</Text>
                    <View style={styles.privacyBadge}>
                      {groupData.isOpen ? (
                        <Unlock size={16} color="#10b981" />
                      ) : (
                        <Lock size={16} color="#f59e0b" />
                      )}
                      <Text style={styles.reviewValue}>
                        {groupData.isOpen ? 'Open' : 'Private'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setCurrentStep('name')}
                activeOpacity={0.7}
              >
                <Text style={styles.editButtonText}>Edit Details</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
            <ArrowLeft size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              Step {currentStepIndex + 1} of {steps.length}
            </Text>
          </View>
        </View>

        <View style={styles.content}>{renderStepContent()}</View>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          {currentStep === 'review' ? (
            <TouchableOpacity
              style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
              onPress={handleCreateGroup}
              disabled={!canProceed()}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>Create Group</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
              onPress={handleNext}
              disabled={!canProceed()}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>Continue</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    gap: 8,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500' as const,
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'center',
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#1a1a1a',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  textArea: {
    minHeight: 160,
    paddingTop: 16,
  },
  charCount: {
    fontSize: 13,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },
  categoryScroll: {
    flex: 1,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryButtonActive: {
    backgroundColor: '#E8F4FF',
    borderColor: '#4A90E2',
  },
  categoryText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#666',
  },
  categoryTextActive: {
    color: '#4A90E2',
  },
  privacyOptions: {
    gap: 16,
    flex: 1,
  },
  privacyCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 24,
    borderWidth: 3,
    borderColor: 'transparent',
    position: 'relative' as const,
  },
  privacyCardActive: {
    backgroundColor: '#E8F4FF',
    borderColor: '#4A90E2',
  },
  privacyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  privacyTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#666',
    marginBottom: 8,
  },
  privacyTitleActive: {
    color: '#1a1a1a',
  },
  privacyDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  checkBadge: {
    position: 'absolute' as const,
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    gap: 16,
  },
  imagePlaceholderText: {
    fontSize: 15,
    color: '#999',
    fontWeight: '500' as const,
  },
  imageUrlInput: {
    width: '100%',
    marginTop: 16,
  },
  imagePreviewContainer: {
    gap: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  removeImageButton: {
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#fee',
    alignItems: 'center',
  },
  removeImageText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#e11d48',
  },
  skipButton: {
    marginTop: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#4A90E2',
  },
  reviewScroll: {
    flex: 1,
  },
  reviewCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  reviewImage: {
    width: '100%',
    height: 180,
  },
  reviewImagePlaceholder: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewContent: {
    padding: 20,
    gap: 20,
  },
  reviewRow: {
    gap: 8,
  },
  reviewLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#999',
    textTransform: 'uppercase' as const,
  },
  reviewValue: {
    fontSize: 16,
    color: '#1a1a1a',
    lineHeight: 24,
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editButton: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    marginBottom: 24,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#4A90E2',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  nextButton: {
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
  nextButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#fff',
  },
});
