import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    text: string;
    textSecondary: string;
    border: string;
    cardBackground: string;
  };
}

const lightColors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  primary: '#007AFF',
  secondary: '#6B7280',
  accent: '#10B981',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  text: '#1D1D1F',
  textSecondary: '#8E8E93',
  border: '#E5E5EA',
  cardBackground: '#FFFFFF',
};

const darkColors = {
  background: '#000000',
  surface: '#1C1C1E',
  primary: '#007AFF',
  secondary: '#98989D',
  accent: '#30D158',
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  text: '#FFFFFF',
  textSecondary: '#98989D',
  border: '#38383A',
  cardBackground: '#1C1C1E',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('@theme', newTheme);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}