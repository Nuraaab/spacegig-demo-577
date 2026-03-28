import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Home, Mail } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function AuthScreen() {
  const router = useRouter();
  const { signIn } = useApp();

  const handleSignIn = async (provider: string) => {
    await signIn(provider);
    router.replace('/(tabs)/(discover)/discover');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <Home size={60} color="#4A90E2" strokeWidth={2} />
        </View>
        <Text style={styles.title}>Welcome to PostIt</Text>
        <Text style={styles.subtitle}>
          Discover amazing properties and opportunities
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.googleButton]}
          onPress={() => handleSignIn('google')}
        >
          <View style={styles.buttonIcon}>
            <Text style={styles.googleIcon}>G</Text>
          </View>
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.appleButton]}
          onPress={() => handleSignIn('apple')}
        >
          <View style={styles.buttonIcon}>
            <Text style={styles.appleIcon}></Text>
          </View>
          <Text style={[styles.buttonText, styles.appleButtonText]}>
            Continue with Apple
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.emailButton]}
          onPress={() => handleSignIn('email')}
        >
          <View style={styles.buttonIcon}>
            <Mail size={24} color="#4A90E2" />
          </View>
          <Text style={[styles.buttonText, styles.emailButtonText]}>
            Continue with Email
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.terms}>
        By continuing, you agree to our Terms of Service and Privacy Policy
      </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 32,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  appleButton: {
    backgroundColor: '#000',
  },
  emailButton: {
    backgroundColor: '#F0F8FF',
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  buttonIcon: {
    marginRight: 12,
  },
  googleIcon: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#4285F4',
  },
  appleIcon: {
    fontSize: 24,
    color: '#fff',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
  },
  appleButtonText: {
    color: '#fff',
  },
  emailButtonText: {
    color: '#4A90E2',
  },
  terms: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});
