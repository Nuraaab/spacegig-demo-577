import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Home, Briefcase, Search, PlusCircle, ChevronRight, Sparkles } from 'lucide-react-native';

export default function OnboardingScreen() {
  const router = useRouter();
  const addProperty2Scale = useRef(new Animated.Value(1)).current;
  const addJobScale = useRef(new Animated.Value(1)).current;
  const discoverPropertiesScale = useRef(new Animated.Value(1)).current;
  const discoverJobsScale = useRef(new Animated.Value(1)).current;

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(-20)).current;
  const card1_5Opacity = useRef(new Animated.Value(0)).current;
  const card1_5TranslateX = useRef(new Animated.Value(-50)).current;
  const card2Opacity = useRef(new Animated.Value(0)).current;
  const card2TranslateX = useRef(new Animated.Value(-50)).current;
  const card3Opacity = useRef(new Animated.Value(0)).current;
  const card3TranslateX = useRef(new Animated.Value(50)).current;
  const card4Opacity = useRef(new Animated.Value(0)).current;
  const card4TranslateX = useRef(new Animated.Value(50)).current;
  const sparkleRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(titleTranslateY, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.stagger(100, [
      Animated.parallel([
        Animated.timing(card1_5Opacity, {
          toValue: 1,
          duration: 500,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.spring(card1_5TranslateX, {
          toValue: 0,
          tension: 50,
          friction: 7,
          delay: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(card2Opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(card2TranslateX, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(card3Opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(card3TranslateX, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(card4Opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(card4TranslateX, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.loop(
      Animated.timing(sparkleRotate, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, [
    titleOpacity,
    titleTranslateY,
    card1_5Opacity,
    card1_5TranslateX,
    card2Opacity,
    card2TranslateX,
    card3Opacity,
    card3TranslateX,
    card4Opacity,
    card4TranslateX,
    sparkleRotate,
  ]);

  const sparkleRotation = sparkleRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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

  const handleAddProperty2 = () => {
    animateButton(addProperty2Scale, () => {
      router.push('/add-property-v2/property-type' as any);
    });
  };

  const handleAddJob = () => {
    animateButton(addJobScale, () => {
      router.push('/create-job/index' as any);
    });
  };

  const handleDiscoverProperties = () => {
    animateButton(discoverPropertiesScale, () => {
      router.replace('/(tabs)/(discover)/discover');
    });
  };

  const handleDiscoverJobs = () => {
    animateButton(discoverJobsScale, () => {
      router.replace('/(tabs)/(discover)/jobs');
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.header,
              {
                opacity: titleOpacity,
                transform: [{ translateY: titleTranslateY }],
              },
            ]}
          >
            <Animated.View
              style={{
                transform: [{ rotate: sparkleRotation }],
                marginBottom: 12,
              }}
            >
              <Sparkles size={40} color="#4A90E2" fill="#4A90E2" />
            </Animated.View>
            <Text style={styles.title}>What are you looking for?</Text>
            <Text style={styles.subtitle}>Choose an option to get started</Text>
          </Animated.View>

          <View style={styles.cardsContainer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Add Listings</Text>

              <Animated.View
                style={{
                  opacity: card1_5Opacity,
                  transform: [
                    { translateX: card1_5TranslateX },
                    { scale: addProperty2Scale },
                  ],
                }}
              >
                <TouchableOpacity
                  style={styles.card}
                  onPress={handleAddProperty2}
                  activeOpacity={0.9}
                >
                  <View style={styles.cardGradient}>
                    <View style={styles.cardIconContainer}>
                      <Home size={28} color="#fff" strokeWidth={2.5} />
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>Add Property</Text>
                      <Text style={styles.cardDescription}>
                        List your property for rent or sale
                      </Text>
                    </View>
                    <View style={styles.cardArrow}>
                      <PlusCircle size={24} color="#4A90E2" strokeWidth={2} />
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                style={{
                  opacity: card2Opacity,
                  transform: [
                    { translateX: card2TranslateX },
                    { scale: addJobScale },
                  ],
                }}
              >
                <TouchableOpacity
                  style={styles.card}
                  onPress={handleAddJob}
                  activeOpacity={0.9}
                >
                  <View style={styles.cardGradient}>
                    <View style={styles.cardIconContainer}>
                      <Briefcase size={28} color="#fff" strokeWidth={2.5} />
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>Add Job Opening</Text>
                      <Text style={styles.cardDescription}>
                        Post a job opportunity for candidates
                      </Text>
                    </View>
                    <View style={styles.cardArrow}>
                      <PlusCircle size={24} color="#4A90E2" strokeWidth={2} />
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <View style={styles.dividerCircle}>
                <Text style={styles.dividerText}>OR</Text>
              </View>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Discover</Text>

              <Animated.View
                style={{
                  opacity: card3Opacity,
                  transform: [
                    { translateX: card3TranslateX },
                    { scale: discoverPropertiesScale },
                  ],
                }}
              >
                <TouchableOpacity
                  style={styles.card}
                  onPress={handleDiscoverProperties}
                  activeOpacity={0.9}
                >
                  <View style={styles.cardGradient}>
                    <View style={styles.cardIconContainer}>
                      <Search size={28} color="#fff" strokeWidth={2.5} />
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>Discover Properties</Text>
                      <Text style={styles.cardDescription}>
                        Browse and find your perfect home
                      </Text>
                    </View>
                    <View style={styles.cardArrow}>
                      <ChevronRight size={28} color="#4A90E2" strokeWidth={2.5} />
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                style={{
                  opacity: card4Opacity,
                  transform: [
                    { translateX: card4TranslateX },
                    { scale: discoverJobsScale },
                  ],
                }}
              >
                <TouchableOpacity
                  style={styles.card}
                  onPress={handleDiscoverJobs}
                  activeOpacity={0.9}
                >
                  <View style={styles.cardGradient}>
                    <View style={styles.cardIconContainer}>
                      <Briefcase size={28} color="#fff" strokeWidth={2.5} />
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>Discover Job Openings</Text>
                      <Text style={styles.cardDescription}>
                        Explore career opportunities near you
                      </Text>
                    </View>
                    <View style={styles.cardArrow}>
                      <ChevronRight size={28} color="#4A90E2" strokeWidth={2.5} />
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
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
    fontWeight: '400' as const,
  },
  cardsContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 16,
    paddingLeft: 4,
  },
  card: {
    marginBottom: 14,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    minHeight: 100,
    backgroundColor: '#fff',
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
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
    fontWeight: '400' as const,
  },
  cardArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e5e5',
  },
  dividerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  dividerText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#666',
  },
});
