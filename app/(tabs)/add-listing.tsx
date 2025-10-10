import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useNavigationContainerRef } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddListingPlaceholder() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const navigationRef = useNavigationContainerRef();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (navigationRef?.isReady() && !hasNavigated) {
      setHasNavigated(true);
      router.replace('/create-listing');
    }
  }, [navigationRef, hasNavigated, router]);

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
