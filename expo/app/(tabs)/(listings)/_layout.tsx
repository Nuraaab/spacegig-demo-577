import { Stack } from 'expo-router';

export default function ListingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#1a1a1a',
        headerTitleStyle: {
          fontWeight: '700' as const,
        },
      }}
    />
  );
}
