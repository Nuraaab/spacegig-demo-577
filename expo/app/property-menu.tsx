import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, Home, Building, Building2, MapPin, HomeIcon, Bed } from 'lucide-react-native';
import { useRef } from 'react';
import { useListing } from '@/contexts/ListingContext';

export default function PropertyMenu() {
  const router = useRouter();
  const { updateFormData, resetForm } = useListing();
  const closeButtonScale = useRef(new Animated.Value(1)).current;
  const houseButtonScale = useRef(new Animated.Value(1)).current;
  const apartmentButtonScale = useRef(new Animated.Value(1)).current;
  const condoButtonScale = useRef(new Animated.Value(1)).current;
  const landButtonScale = useRef(new Animated.Value(1)).current;
  const commercialButtonScale = useRef(new Animated.Value(1)).current;
  const basementButtonScale = useRef(new Animated.Value(1)).current;
  const roomButtonScale = useRef(new Animated.Value(1)).current;

  const animateButton = (scale: Animated.Value, callback: () => void) => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.92,
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

  const handlePropertyTypeSelect = (propertyType: string, scale: Animated.Value) => {
    animateButton(scale, () => {
      resetForm();
      updateFormData({ 
        listingCategory: 'property',
        propertyType: propertyType as any
      });
      router.push('/create-listing/index' as any);
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>What are you posting?</Text>
        <Animated.View style={{ transform: [{ scale: closeButtonScale }] }}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => animateButton(closeButtonScale, () => router.back())}
            activeOpacity={0.8}
          >
            <X size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Select Property Type</Text>
        <Text style={styles.sectionSubtitle}>Choose the type of property you want to list</Text>

        <View style={styles.grid}>
          <Animated.View style={[styles.cardWrapper, { transform: [{ scale: houseButtonScale }] }]}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => handlePropertyTypeSelect('house', houseButtonScale)}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <Home size={40} color="#4A90E2" strokeWidth={2} />
              </View>
              <Text style={styles.cardTitle}>House</Text>
              <Text style={styles.cardDescription}>Single-family home</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.cardWrapper, { transform: [{ scale: apartmentButtonScale }] }]}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => handlePropertyTypeSelect('apartment', apartmentButtonScale)}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <Building size={40} color="#4A90E2" strokeWidth={2} />
              </View>
              <Text style={styles.cardTitle}>Apartment</Text>
              <Text style={styles.cardDescription}>Multi-unit building</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.cardWrapper, { transform: [{ scale: condoButtonScale }] }]}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => handlePropertyTypeSelect('condo', condoButtonScale)}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <Building2 size={40} color="#4A90E2" strokeWidth={2} />
              </View>
              <Text style={styles.cardTitle}>Condo</Text>
              <Text style={styles.cardDescription}>Condominium unit</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.cardWrapper, { transform: [{ scale: landButtonScale }] }]}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => handlePropertyTypeSelect('land', landButtonScale)}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <MapPin size={40} color="#4A90E2" strokeWidth={2} />
              </View>
              <Text style={styles.cardTitle}>Land</Text>
              <Text style={styles.cardDescription}>Vacant lot or plot</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.cardWrapper, { transform: [{ scale: commercialButtonScale }] }]}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => handlePropertyTypeSelect('commercial', commercialButtonScale)}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <Building size={40} color="#4A90E2" strokeWidth={2} />
              </View>
              <Text style={styles.cardTitle}>Commercial</Text>
              <Text style={styles.cardDescription}>Business property</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.cardWrapper, { transform: [{ scale: basementButtonScale }] }]}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => handlePropertyTypeSelect('basement', basementButtonScale)}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <HomeIcon size={40} color="#4A90E2" strokeWidth={2} />
              </View>
              <Text style={styles.cardTitle}>Basement</Text>
              <Text style={styles.cardDescription}>Lower level unit</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.cardWrapper, { transform: [{ scale: roomButtonScale }] }]}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => handlePropertyTypeSelect('room', roomButtonScale)}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <Bed size={40} color="#4A90E2" strokeWidth={2} />
              </View>
              <Text style={styles.cardTitle}>Room</Text>
              <Text style={styles.cardDescription}>Single room rental</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#1a1a1a',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  cardWrapper: {
    width: '47%',
  },
  card: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
});
