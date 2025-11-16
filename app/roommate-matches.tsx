import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Heart, MessageCircle, MapPin, DollarSign, Sparkles, RefreshCw, Check } from 'lucide-react-native';
import { mockCommunityUsers, type CommunityUser } from '@/mocks/community';

export default function RoommateMatchesScreen() {
  const router = useRouter();
  const [isMatching, setIsMatching] = useState<boolean>(true);
  const [matches, setMatches] = useState<CommunityUser[]>([]);

  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    spin.start();

    const timer = setTimeout(() => {
      spin.stop();
      
      const filteredMatches = mockCommunityUsers.filter(user => user.lookingForRoommate);
      setMatches(filteredMatches);
      setIsMatching(false);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 3000);

    return () => {
      clearTimeout(timer);
      spin.stop();
    };
  }, [spinValue, fadeAnim]);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleStartOver = () => {
    router.back();
  };

  const handleLike = (userId: string) => {
    console.log('Liked user:', userId);
  };

  const handleMessage = (userId: string) => {
    console.log('Message user:', userId);
  };

  if (isMatching) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Finding Matches',
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTintColor: '#1a1a1a',
          }}
        />
        <View style={styles.matchingContainer}>
          <Animated.View style={[styles.matchingIcon, { transform: [{ rotate }] }]}>
            <RefreshCw size={60} color="#4A90E2" strokeWidth={2} />
          </Animated.View>
          <Text style={styles.matchingTitle}>Finding Your Perfect Matches...</Text>
          <Text style={styles.matchingSubtitle}>
            Analyzing profiles based on your preferences
          </Text>
        </View>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Stack.Screen
        options={{
          title: 'Your Matches',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#1a1a1a',
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.successBanner}>
          <View style={styles.successIcon}>
            <Check size={32} color="#10b981" strokeWidth={3} />
          </View>
          <View style={styles.successContent}>
            <Text style={styles.successTitle}>🎉 {matches.length} Matches Found!</Text>
            <Text style={styles.successSubtitle}>
              We found {matches.length} compatible roommate{matches.length !== 1 ? 's' : ''} for you
            </Text>
          </View>
        </View>

        <View style={styles.matchesSection}>
          {matches.map((user) => (
            <View key={user.id} style={styles.matchCard}>
              <Image source={{ uri: user.avatar }} style={styles.matchAvatar} />
              
              <View style={styles.matchContent}>
                <Text style={styles.matchName}>{user.name}</Text>
                
                <View style={styles.matchDetail}>
                  <MapPin size={14} color="#666" />
                  <Text style={styles.matchDetailText}>{user.location}</Text>
                </View>

                {user.budget && (
                  <View style={styles.matchDetail}>
                    <DollarSign size={14} color="#666" />
                    <Text style={styles.matchDetailText}>
                      ${user.budget.toLocaleString()}/month
                    </Text>
                  </View>
                )}

                <Text style={styles.matchBio} numberOfLines={2}>
                  {user.bio}
                </Text>

                {user.lifestyle && user.lifestyle.length > 0 && (
                  <View style={styles.tagsRow}>
                    <Sparkles size={14} color="#4A90E2" />
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.tagsContent}
                    >
                      {user.lifestyle.slice(0, 3).map((tag, index) => (
                        <View key={index} style={styles.matchTag}>
                          <Text style={styles.matchTagText}>{tag}</Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <View style={styles.matchActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleLike(user.id)}
                  activeOpacity={0.7}
                >
                  <Heart size={22} color="#4A90E2" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonPrimary]}
                  onPress={() => handleMessage(user.id)}
                  activeOpacity={0.7}
                >
                  <MessageCircle size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.resetSection}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleStartOver}
            activeOpacity={0.7}
          >
            <RefreshCw size={20} color="#4A90E2" />
            <Text style={styles.resetButtonText}>Start Over</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  matchingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  matchingIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  matchingTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  matchingSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    flex: 1,
  },
  successBanner: {
    backgroundColor: '#E8F9F1',
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContent: {
    flex: 1,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#059669',
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#047857',
  },
  matchesSection: {
    padding: 16,
    paddingTop: 8,
  },
  matchCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  matchAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    alignSelf: 'center',
  },
  matchContent: {
    marginBottom: 16,
  },
  matchName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
  },
  matchDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  matchDetailText: {
    fontSize: 14,
    color: '#666',
  },
  matchBio: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagsContent: {
    gap: 8,
  },
  matchTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#E8F4FF',
  },
  matchTagText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#4A90E2',
  },
  matchActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: '#4A90E2',
  },
  resetSection: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#4A90E2',
  },
});
