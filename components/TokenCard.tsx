import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Star } from 'lucide-react-native';
import { Token } from '@/types/token';
import { useTheme } from '@/contexts/ThemeContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

interface TokenCardProps {
  token: Token;
}

const SimpleSparkline = memo(({ data, color, width = 48, height = 20 }: { 
  data: number[]; 
  color: string; 
  width?: number; 
  height?: number; 
}) => {
  if (!data || data.length < 2) return <View style={{ width, height }} />;
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  
  const path = `M ${points}`;
  
  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Path d={path} fill="none" stroke={color} strokeWidth="1.5" />
      </Svg>
    </View>
  );
});

export const TokenCard = memo(({ token }: TokenCardProps) => {
  const { colors } = useTheme();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

  const isTokenFavorite = isFavorite(token.tokenAddress);

  const handleStarPress = React.useCallback((e: any) => {
    e.stopPropagation();
    if (isTokenFavorite) {
      removeFromFavorites(token.tokenAddress);
    } else {
      addToFavorites(token.tokenAddress);
    }
  }, [isTokenFavorite, token.tokenAddress, addToFavorites, removeFromFavorites]);

  const handleCardPress = React.useCallback(() => {
    router.push({
      pathname: '/token-detail',
      params: { token: JSON.stringify(token) }
    });
  }, [token]);

  const getPriceChangeColor = React.useCallback((change: number) => {
    if (change > 0) return colors.success;
    if (change < 0) return colors.error;
    return colors.textSecondary;
  }, [colors]);

  const priceChangeColor = getPriceChangeColor(token.priceChange24h);
  const sparklineData = token.priceChange24h > 0 
    ? [10, 50, 20, 60, 40, 80] 
    : [80, 40, 60, 20, 50, 10];

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginHorizontal: 16,
      marginVertical: 4,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    icon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      marginRight: 12,
      backgroundColor: colors.border,
    },
    tokenInfo: {
      flex: 2,
      justifyContent: 'center',
    },
    tokenName: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 2,
    },
    marketCap: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    changeContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    change: {
      fontSize: 14,
      fontWeight: '600',
    },
    sparklineContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 8,
    },
    starButton: {
      padding: 8,
      borderRadius: 12,
      backgroundColor: colors.surface,
      marginLeft: 8,
    },
  });

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handleCardPress}
      activeOpacity={0.7}
    >
      <Image
        source={{ 
          uri: token.icon || 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=400'
        }}
        style={styles.icon}
      />
      
      <View style={styles.tokenInfo}>
        <Text style={styles.tokenName} numberOfLines={1}>
          {token.name}
        </Text>
        <Text style={styles.marketCap} numberOfLines={1}>
          {token.marketCap}
        </Text>
      </View>
      
      <View style={styles.changeContainer}>
        <Text style={[styles.change, { color: priceChangeColor }]}> 
          {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
        </Text>
      </View>
      
      <View style={styles.sparklineContainer}>
        <SimpleSparkline
          data={sparklineData}
          color={priceChangeColor}
          width={48}
          height={20}
        />
      </View>
      
      <TouchableOpacity style={styles.starButton} onPress={handleStarPress}>
        <Star
          size={18}
          color={isTokenFavorite ? colors.warning : colors.textSecondary}
          fill={isTokenFavorite ? colors.warning : 'transparent'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
});