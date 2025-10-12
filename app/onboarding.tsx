import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Home, Briefcase, Search, PlusCircle, ChevronRight, Sparkles } from 'lucide-react-native';

export default function OnboardingScreen() {
  const router = useRouter();
  const addPropertyScale = useRef(new Animated.Value(1)).current;
  const addJobScale = useRef(new Animated.Value(1)).current;
  const discoverPropertiesScale = useRef(new Animated.Value(1)).current;
  const discoverJobsScale = useRef(new Animated.Value(1)).current;

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(-20)).current;
  const card1Opacity = useRef(new Animated.Value(0)).current;
  const card1TranslateX = useRef(new Animated.Value(-50)).current;
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
        Animated.timing(card1Opacity, {
          toValue: 1,
          duration: 500,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.spring(card1TranslateX, {
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
    card1Opacity,
    card1TranslateX,
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

  const handleAddProperty = () => {
    animateButton(addPropertyScale, () => {
      router.push('/create-listing/index' as any);
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
      <LinearGradient
        colors={['#1e3a8a', '#3b82f6', '#60a5fa']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
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
              <Sparkles size={40} color="#fff" fill="#fff" />
            </Animated.View>
            <Text style={styles.title}>What are you looking for?</Text>
            <Text style={styles.subtitle}>Choose an option to get started</Text>
          </Animated.View>

          <View style={styles.cardsContainer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Add Listings</Text>

              <Animated.View
                style={{
                  opacity: card1Opacity,
                  transform: [
                    { translateX: card1TranslateX },
                    { scale: addPropertyScale },
                  ],
                }}
              >
                <TouchableOpacity
                  style={styles.card}
                  onPress={handleAddProperty}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={['#2563eb', '#1d4ed8']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardGradient}
                  >
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
                      <PlusCircle size={24} color="rgba(255,255,255,0.9)" strokeWidth={2} />
                    </View>
                  </LinearGradient>
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
                  <LinearGradient
                    colors={['#10b981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardGradient}
                  >
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
                      <PlusCircle size={24} color="rgba(255,255,255,0.9)" strokeWidth={2} />
                    </View>
                  </LinearGradient>
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
                  <LinearGradient
                    colors={['#3b82f6', '#2563eb']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardGradient}
                  >
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
                      <ChevronRight size={28} color="rgba(255,255,255,0.9)" strokeWidth={2.5} />
                    </View>
                  </LinearGradient>
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
                  <LinearGradient
                    colors={['#60a5fa', '#3b82f6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardGradient}
                  >
                    <View style={styles.cardIconContainer}>
                      <Briefcase size={28} color="#fff" strokeWidth={2.5} />
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>Job Openings</Text>
                      <Text style={styles.cardDescription}>
                        Explore career opportunities near you
                      </Text>
                    </View>
                    <View style={styles.cardArrow}>
                      <ChevronRight size={28} color="rgba(255,255,255,0.9)" strokeWidth={2.5} />
                    </View>
                  </LinearGradient>
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
    paddingTop: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 34,
    fontWeight: '800' as const,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  cardsContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 16,
    paddingLeft: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    marginBottom: 14,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    minHeight: 100,
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  cardArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  dividerLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#fff',
  },
});
