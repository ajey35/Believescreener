import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export const TokenDescriptionCard = memo(() => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    text: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 22,
      fontWeight: '500',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Get the full token details of the tokens that are launched from Belive platform
      </Text>
    </View>
  );
});