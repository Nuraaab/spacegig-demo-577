import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

export default function AddJobPlaceholder() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/create-job');
  }, [router]);

  return <View />;
}
