import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoritesContextType {
  favorites: string[];
  addToFavorites: (tokenAddress: string) => void;
  removeFromFavorites: (tokenAddress: string) => void;
  isFavorite: (tokenAddress: string) => boolean;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('@favorites');
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(parsedFavorites);
      }
    } catch (error) {
      console.log('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFavorites = async (newFavorites: string[]) => {
    try {
      await AsyncStorage.setItem('@favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.log('Error saving favorites:', error);
    }
  };

  const addToFavorites = (tokenAddress: string) => {
    if (!favorites.includes(tokenAddress)) {
      const newFavorites = [...favorites, tokenAddress];
      setFavorites(newFavorites);
      saveFavorites(newFavorites);
    }
  };

  const removeFromFavorites = (tokenAddress: string) => {
    const newFavorites = favorites.filter(addr => addr !== tokenAddress);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const isFavorite = (tokenAddress: string) => {
    return favorites.includes(tokenAddress);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      isLoading
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}