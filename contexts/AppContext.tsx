import { useState, useEffect, useCallback, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Property, mockProperties } from '@/mocks/properties';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const [AppProvider, useApp] = createContextHook(() => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [properties] = useState<Property[]>(mockProperties);
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadStoredData = useCallback(async () => {
    try {
      const [storedAuth, storedUser, storedFavorites] = await Promise.all([
        AsyncStorage.getItem('isAuthenticated'),
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('favorites'),
      ]);

      if (storedAuth === 'true') {
        setIsAuthenticated(true);
      }
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStoredData();
  }, [loadStoredData]);

  const signIn = useCallback(async (provider: string) => {
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://i.pravatar.cc/150?img=12',
    };

    setUser(mockUser);
    setIsAuthenticated(true);

    await AsyncStorage.setItem('isAuthenticated', 'true');
    await AsyncStorage.setItem('user', JSON.stringify(mockUser));
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    setIsAuthenticated(false);

    await AsyncStorage.removeItem('isAuthenticated');
    await AsyncStorage.removeItem('user');
  }, []);

  const addToFavorites = useCallback(async (propertyId: string) => {
    const updatedFavorites = [...favorites, propertyId];
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  }, [favorites]);

  const removeFromFavorites = useCallback(async (propertyId: string) => {
    const updatedFavorites = favorites.filter((id) => id !== propertyId);
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  }, [favorites]);

  const nextProperty = useCallback(() => {
    if (currentPropertyIndex < properties.length - 1) {
      setCurrentPropertyIndex(currentPropertyIndex + 1);
    }
  }, [currentPropertyIndex, properties.length]);

  const getCurrentProperty = useCallback((): Property | null => {
    return properties[currentPropertyIndex] || null;
  }, [properties, currentPropertyIndex]);

  const getFavoriteProperties = useCallback((): Property[] => {
    return properties.filter((property) => favorites.includes(property.id));
  }, [properties, favorites]);

  const setAuthenticated = useCallback((value: boolean) => {
    setIsAuthenticated(value);
  }, []);

  return useMemo(() => ({
    isAuthenticated,
    user,
    favorites,
    properties,
    currentPropertyIndex,
    isLoading,
    signIn,
    signOut,
    addToFavorites,
    removeFromFavorites,
    nextProperty,
    getCurrentProperty,
    getFavoriteProperties,
    setAuthenticated,
  }), [isAuthenticated, user, favorites, properties, currentPropertyIndex, isLoading, signIn, signOut, addToFavorites, removeFromFavorites, nextProperty, getCurrentProperty, getFavoriteProperties, setAuthenticated]);
});
