import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export function Header() {
  const { colors, theme, toggleTheme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: -0.5,
    },
    themeButton: {
      padding: 12,
      borderRadius: 16,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Belive Screener</Text>
      <TouchableOpacity 
        style={styles.themeButton} 
        onPress={toggleTheme}
        activeOpacity={0.7}
      >
        {theme === 'light' ? (
          <Moon size={20} color={colors.text} />
        ) : (
          <Sun size={20} color={colors.text} />
        )}
      </TouchableOpacity>
    </View>
  );
}