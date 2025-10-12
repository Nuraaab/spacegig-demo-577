import { useState, useRef, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  PanResponder,
  Animated,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Heart, X, MapPin, DollarSign, Briefcase, Search, SlidersHorizontal, Home, LayoutGrid, Layers } from 'lucide-react-native';
import { mockJobs } from '@/mocks/jobs';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

export default function JobsDiscoverScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'stack' | 'grid'>('stack');
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState<{ min: number; max: number }>({ min: 0, max: 500000 });
  const [remoteOnly, setRemoteOnly] = useState<boolean>(false);

  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const jobTypes = useMemo(() => {
    const types = new Set<string>();
    mockJobs.forEach(job => types.add(job.jobType));
    return Array.from(types);
  }, []);

  const locations = useMemo(() => {
    const locs = new Set<string>();
    mockJobs.forEach(job => locs.add(`${job.location.city}, ${job.location.state}`));
    return Array.from(locs);
  }, []);

  const filteredJobs = useMemo(() => {
    return mockJobs.filter(job => {
      if (selectedJobTypes.length > 0 && !selectedJobTypes.includes(job.jobType)) {
        return false;
      }
      if (selectedLocations.length > 0 && !selectedLocations.includes(`${job.location.city}, ${job.location.state}`)) {
        return false;
      }
      if (job.salary.max < salaryRange.min || job.salary.min > salaryRange.max) {
        return false;
      }
      if (remoteOnly && !job.location.remote) {
        return false;
      }
      if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !job.company.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [selectedJobTypes, selectedLocations, salaryRange, remoteOnly, searchQuery]);

  const job = filteredJobs[currentIndex];

  const toggleJobType = (type: string) => {
    setSelectedJobTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]
    );
  };

  const clearFilters = () => {
    setSelectedJobTypes([]);
    setSelectedLocations([]);
    setSalaryRange({ min: 0, max: 500000 });
    setRemoteOnly(false);
  };

  const activeFiltersCount = selectedJobTypes.length + selectedLocations.length + (remoteOnly ? 1 : 0);

  const handleSwipeComplete = (direction: 'left' | 'right') => {
    if (direction === 'right' && job) {
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2000);
    }
    setCurrentIndex((prev) => Math.min(prev + 1, mockJobs.length));
    position.setValue({ x: 0, y: 0 });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          Animated.spring(position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gesture.dy },
            useNativeDriver: false,
          }).start(() => handleSwipeComplete('right'));
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          Animated.spring(position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gesture.dy },
            useNativeDriver: false,
          }).start(() => handleSwipeComplete('left'));
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const likeButtonScale = useRef(new Animated.Value(1)).current;
  const passButtonScale = useRef(new Animated.Value(1)).current;
  const homeButtonScale = useRef(new Animated.Value(1)).current;
  const filterButtonScale = useRef(new Animated.Value(1)).current;
  const viewButtonScale = useRef(new Animated.Value(1)).current;

  const animateButton = (scale: Animated.Value, callback: () => void) => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.85,
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

  const handleLike = () => {
    animateButton(likeButtonScale, () => {
      Animated.spring(position, {
        toValue: { x: SCREEN_WIDTH + 100, y: 0 },
        useNativeDriver: false,
      }).start(() => handleSwipeComplete('right'));
    });
  };

  const handlePass = () => {
    animateButton(passButtonScale, () => {
      Animated.spring(position, {
        toValue: { x: -SCREEN_WIDTH - 100, y: 0 },
        useNativeDriver: false,
      }).start(() => handleSwipeComplete('left'));
    });
  };

  if (!job && viewMode === 'stack') {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Discover Jobs',
            headerLeft: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginLeft: 8 }}>
                <TouchableOpacity
                  onPress={() => router.replace('/onboarding')}
                >
                  <Home size={24} color="#1a1a1a" />
                </TouchableOpacity>
              </View>
            ),

          }}
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No more jobs to show</Text>
          <Text style={styles.emptySubtext}>Check back later for new opportunities</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Discover Jobs',
          headerLeft: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginLeft: 8 }}>
              <Animated.View style={{ transform: [{ scale: homeButtonScale }] }}>
                <TouchableOpacity
                  onPress={() => animateButton(homeButtonScale, () => router.replace('/onboarding'))}
                  activeOpacity={0.8}
                >
                  <Home size={24} color="#1a1a1a" />
                </TouchableOpacity>
              </Animated.View>

            </View>
          ),

        }}
      />

      <View style={[styles.searchContainer, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerButtons}>
          <Animated.View style={{ transform: [{ scale: homeButtonScale }] }}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => animateButton(homeButtonScale, () => router.replace('/onboarding'))}
              activeOpacity={0.8}
            >
              <Home size={20} color="#1a1a1a" />
            </TouchableOpacity>
          </Animated.View>

        </View>
        <View style={styles.searchBar}>
          <Search size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Animated.View style={{ transform: [{ scale: viewButtonScale }] }}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => animateButton(viewButtonScale, () => setViewMode(viewMode === 'stack' ? 'grid' : 'stack'))}
            activeOpacity={0.8}
          >
            {viewMode === 'stack' ? (
              <LayoutGrid size={20} color="#10B981" />
            ) : (
              <Layers size={20} color="#10B981" />
            )}
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={{ transform: [{ scale: filterButtonScale }] }}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => animateButton(filterButtonScale, () => setShowFilters(!showFilters))}
            activeOpacity={0.8}
          >
            <SlidersHorizontal size={20} color="#10B981" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {viewMode === 'stack' ? (
        <>
          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }],
              },
            ]}
            {...panResponder.panHandlers}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push(`/job/${job.id}` as any)}
              style={styles.cardTouchable}
            >
            <ScrollView
              style={styles.cardScrollView}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            >
              <Image source={{ uri: job.images[0] }} style={styles.image} />

              <Animated.View style={[styles.likeLabel, { opacity: likeOpacity }]}>
                <Text style={styles.likeLabelText}>INTERESTED</Text>
              </Animated.View>

              <Animated.View style={[styles.nopeLabel, { opacity: nopeOpacity }]}>
                <Text style={styles.nopeLabelText}>PASS</Text>
              </Animated.View>

              <View style={styles.cardContent}>
                <View style={styles.salaryTag}>
                  <DollarSign size={16} color="#fff" />
                  <Text style={styles.salary}>
                    ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                  </Text>
                </View>

                <Text style={styles.title}>{job.title}</Text>
                <Text style={styles.company}>{job.company}</Text>

                <View style={styles.locationRow}>
                  <MapPin size={16} color="#666" />
                  <Text style={styles.location}>
                    {job.location.city}, {job.location.state}
                    {job.location.remote && ' • Remote'}
                  </Text>
                </View>

                <View style={styles.jobTypeContainer}>
                  <View style={styles.jobTypeBadge}>
                    <Briefcase size={14} color="#10B981" />
                    <Text style={styles.jobTypeText}>{job.jobType}</Text>
                  </View>
                </View>

                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{job.description}</Text>

                <Text style={styles.sectionTitle}>Requirements</Text>
                {job.requirements.map((req, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listText}>{req}</Text>
                  </View>
                ))}

                <Text style={styles.sectionTitle}>Benefits</Text>
                <View style={styles.benefitsContainer}>
                  {job.benefits.map((benefit, index) => (
                    <View key={index} style={styles.benefitChip}>
                      <Text style={styles.benefitText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.buttonsContainer}>
            <Animated.View style={{ transform: [{ scale: passButtonScale }] }}>
              <TouchableOpacity style={[styles.actionButton, styles.passButton]} onPress={handlePass} activeOpacity={0.8}>
                <X size={32} color="#FF6B6B" strokeWidth={3} />
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={{ transform: [{ scale: likeButtonScale }] }}>
              <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={handleLike} activeOpacity={0.8}>
                <Heart size={32} color="#10B981" strokeWidth={3} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </>
      ) : (
        <ScrollView
          style={styles.gridContainer}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredJobs.map((jobItem) => (
            <TouchableOpacity
              key={jobItem.id}
              style={styles.gridCard}
              onPress={() => router.push(`/job/${jobItem.id}` as any)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: jobItem.images[0] }} style={styles.gridImage} />
              <View style={styles.gridCardContent}>
                <View style={styles.gridSalaryTag}>
                  <DollarSign size={12} color="#fff" />
                  <Text style={styles.gridSalary}>
                    ${jobItem.salary.min.toLocaleString()}-${jobItem.salary.max.toLocaleString()}
                  </Text>
                </View>
                <Text style={styles.gridTitle} numberOfLines={2}>{jobItem.title}</Text>
                <Text style={styles.gridCompany} numberOfLines={1}>{jobItem.company}</Text>
                <View style={styles.gridLocationRow}>
                  <MapPin size={12} color="#666" />
                  <Text style={styles.gridLocation} numberOfLines={1}>
                    {jobItem.location.city}, {jobItem.location.state}
                  </Text>
                </View>
                <View style={styles.gridJobTypeBadge}>
                  <Briefcase size={10} color="#10B981" />
                  <Text style={styles.gridJobTypeText}>{jobItem.jobType}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {showConfirmation && (
        <View style={styles.confirmation}>
          <Heart size={24} color="#fff" fill="#fff" />
          <Text style={styles.confirmationText}>Added to favorites!</Text>
        </View>
      )}

      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              {activeFiltersCount > 0 && (
                <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>Clear All</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setShowFilters(false)} style={styles.closeButton}>
                <X size={24} color="#1a1a1a" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Job Type</Text>
                <View style={styles.filterChips}>
                  {jobTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.filterChip,
                        selectedJobTypes.includes(type) && styles.filterChipActive,
                      ]}
                      onPress={() => toggleJobType(type)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedJobTypes.includes(type) && styles.filterChipTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Location</Text>
                <View style={styles.filterChips}>
                  {locations.map((location) => (
                    <TouchableOpacity
                      key={location}
                      style={[
                        styles.filterChip,
                        selectedLocations.includes(location) && styles.filterChipActive,
                      ]}
                      onPress={() => toggleLocation(location)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedLocations.includes(location) && styles.filterChipTextActive,
                        ]}
                      >
                        {location}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Salary Range</Text>
                <View style={styles.salaryInputs}>
                  <View style={styles.salaryInputContainer}>
                    <Text style={styles.salaryLabel}>Min</Text>
                    <TextInput
                      style={styles.salaryInput}
                      value={salaryRange.min.toString()}
                      onChangeText={(text) => {
                        const value = parseInt(text) || 0;
                        setSalaryRange(prev => ({ ...prev, min: value }));
                      }}
                      keyboardType="numeric"
                      placeholder="0"
                    />
                  </View>
                  <Text style={styles.salaryDivider}>-</Text>
                  <View style={styles.salaryInputContainer}>
                    <Text style={styles.salaryLabel}>Max</Text>
                    <TextInput
                      style={styles.salaryInput}
                      value={salaryRange.max.toString()}
                      onChangeText={(text) => {
                        const value = parseInt(text) || 500000;
                        setSalaryRange(prev => ({ ...prev, max: value }));
                      }}
                      keyboardType="numeric"
                      placeholder="500000"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.filterSection}>
                <TouchableOpacity
                  style={styles.remoteToggle}
                  onPress={() => setRemoteOnly(!remoteOnly)}
                >
                  <View style={styles.remoteToggleLeft}>
                    <Text style={styles.filterSectionTitle}>Remote Only</Text>
                    <Text style={styles.remoteToggleSubtext}>Show only remote positions</Text>
                  </View>
                  <View style={[styles.toggleSwitch, remoteOnly && styles.toggleSwitchActive]}>
                    <View style={[styles.toggleThumb, remoteOnly && styles.toggleThumbActive]} />
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => {
                  setCurrentIndex(0);
                  setShowFilters(false);
                }}
              >
                <Text style={styles.applyButtonText}>
                  Show {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 48,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    position: 'absolute',
    top: 140,
    left: 20,
    right: 20,
    height: SCREEN_HEIGHT * 0.6,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  cardScrollView: {
    flex: 1,
  },
  cardTouchable: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 200,
  },
  likeLabel: {
    position: 'absolute',
    top: 50,
    right: 40,
    borderWidth: 4,
    borderColor: '#10B981',
    borderRadius: 8,
    padding: 8,
    transform: [{ rotate: '20deg' }],
    backgroundColor: '#fff',
  },
  likeLabelText: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#10B981',
  },
  nopeLabel: {
    position: 'absolute',
    top: 50,
    left: 40,
    borderWidth: 4,
    borderColor: '#FF6B6B',
    borderRadius: 8,
    padding: 8,
    transform: [{ rotate: '-20deg' }],
    backgroundColor: '#fff',
  },
  nopeLabelText: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FF6B6B',
  },
  cardContent: {
    padding: 20,
  },
  salaryTag: {
    position: 'absolute',
    top: -30,
    right: 20,
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  salary: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  company: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#10B981',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  jobTypeContainer: {
    marginBottom: 16,
  },
  jobTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  jobTypeText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#10B981',
    textTransform: 'capitalize' as const,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingRight: 20,
  },
  bullet: {
    fontSize: 14,
    color: '#10B981',
    marginRight: 8,
    fontWeight: '700' as const,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  benefitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  benefitChip: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  benefitText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500' as const,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  passButton: {
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  likeButton: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  confirmation: {
    position: 'absolute',
    top: 100,
    left: '50%',
    transform: [{ translateX: -100 }],
    width: 200,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  gridContainer: {
    flex: 1,
  },
  gridContent: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  gridCard: {
    width: (SCREEN_WIDTH - 48) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridImage: {
    width: '100%',
    height: 120,
  },
  gridCardContent: {
    padding: 12,
  },
  gridSalaryTag: {
    position: 'absolute',
    top: -16,
    right: 8,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  gridSalary: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#fff',
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 4,
    marginTop: 4,
  },
  gridCompany: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#10B981',
    marginBottom: 6,
  },
  gridLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  gridLocation: {
    fontSize: 11,
    color: '#666',
    flex: 1,
  },
  gridJobTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  gridJobTypeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#10B981',
    textTransform: 'capitalize' as const,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    flex: 1,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 12,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#10B981',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterScroll: {
    flex: 1,
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterChipActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#10B981',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#666',
    textTransform: 'capitalize' as const,
  },
  filterChipTextActive: {
    color: '#10B981',
  },
  salaryInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  salaryInputContainer: {
    flex: 1,
  },
  salaryLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#666',
    marginBottom: 8,
  },
  salaryInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  salaryDivider: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#666',
    marginTop: 24,
  },
  remoteToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  remoteToggleLeft: {
    flex: 1,
  },
  remoteToggleSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  toggleSwitch: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    padding: 2,
    justifyContent: 'center',
  },
  toggleSwitchActive: {
    backgroundColor: '#10B981',
  },
  toggleThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  applyButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#fff',
  },
});
