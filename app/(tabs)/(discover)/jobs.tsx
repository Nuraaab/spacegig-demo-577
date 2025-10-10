import { useState, useRef } from 'react';
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
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Heart, X, MapPin, DollarSign, Briefcase, Search, SlidersHorizontal, Home } from 'lucide-react-native';
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

  const job = mockJobs[currentIndex];

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

  if (!job) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Discover Jobs',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.replace('/onboarding')}
                style={{ marginLeft: 8 }}
              >
                <Home size={24} color="#1a1a1a" />
              </TouchableOpacity>
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
            <Animated.View style={{ transform: [{ scale: homeButtonScale }], marginLeft: 8 }}>
              <TouchableOpacity
                onPress={() => animateButton(homeButtonScale, () => router.replace('/onboarding'))}
                activeOpacity={0.8}
              >
                <Home size={24} color="#1a1a1a" />
              </TouchableOpacity>
            </Animated.View>
          ),
        }}
      />

      <View style={[styles.searchContainer, { paddingTop: insets.top + 12 }]}>
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

      {showConfirmation && (
        <View style={styles.confirmation}>
          <Heart size={24} color="#fff" fill="#fff" />
          <Text style={styles.confirmationText}>Added to favorites!</Text>
        </View>
      )}
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
    gap: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
});
