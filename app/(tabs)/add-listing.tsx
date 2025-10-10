import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddListingPlaceholder() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    router.replace('/create-listing');
  }, [router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
