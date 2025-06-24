import { TouchableOpacity, Text, StyleSheet, Linking } from 'react-native';
import { ExternalLink } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export function LaunchTokenButton() {
  const { colors } = useTheme();

  const handlePress = () => {
    Linking.openURL('https://believe.app');
  };

  const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 16,
      marginHorizontal: 16,
      marginVertical: 20,
      gap: 8,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
  });

  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>Launch your own token on believe.app</Text>
      <ExternalLink size={16} color="#FFFFFF" />
    </TouchableOpacity>
  );
}