import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Star } from 'lucide-react-native';
import { Token } from '@/types/token';
import { useTheme } from '@/contexts/ThemeContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { router } from 'expo-router';
import { Sparkline } from './Sparkline';
import Svg, { Path } from 'react-native-svg';

interface TokenCardProps {
  token: Token;
}

function SimpleSparkline({ data, color, width = 48, height = 20 }: { data: number[]; color: string; width?: number; height?: number }) {
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
}

export function TokenCard({ token }: TokenCardProps) {
  const { colors } = useTheme();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

  const isTokenFavorite = isFavorite(token.tokenAddress);

  const handleStarPress = (e: any) => {
    e.stopPropagation();
    if (isTokenFavorite) {
      removeFromFavorites(token.tokenAddress);
    } else {
      addToFavorites(token.tokenAddress);
    }
  };

  const handleCardPress = () => {
    router.push({
      pathname: '/token-detail',
      params: { token: JSON.stringify(token) }
    });
  };

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return colors.success;
    if (change < 0) return colors.error;
    return colors.textSecondary;
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 6,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    tokenInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    tokenIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: 12,
      backgroundColor: colors.border,
    },
    tokenDetails: {
      flex: 1,
    },
    tokenName: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 2,
    },
    tokenSymbol: {
      fontSize: 15,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    starButton: {
      padding: 8,
      borderRadius: 12,
      backgroundColor: colors.surface,
    },
    metricsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
    },
    metricColumn: {
      flex: 1,
      alignItems: 'flex-start',
    },
    metricLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
      fontWeight: '500',
    },
    metricValue: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
    },
    priceChangeValue: {
      fontSize: 15,
      fontWeight: '600',
    },
    priceValue: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.text,
    },
    tokenPrice: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.primary,
      marginTop: 2,
      marginBottom: 2,
    },
    metricsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
      gap: 8,
    },
    tokenInfoCentered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
    },
    tokenIconLarge: {
      width: 56,
      height: 56,
      borderRadius: 28,
      marginBottom: 4,
      backgroundColor: colors.border,
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 12,
      marginHorizontal: 10,
      marginVertical: 5,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 8,
    },
    rowIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      marginRight: 8,
      backgroundColor: colors.border,
    },
    rowTokenInfo: {
      flex: 2,
      flexDirection: 'column',
      justifyContent: 'center',
      marginRight: 6,
    },
    rowTokenName: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.text,
    },
    rowMarketCap: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    rowChangeContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowChange: {
      fontSize: 15,
      fontWeight: '600',
    },
    rowSparkline: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 4,
    },
    rowStarButton: {
      padding: 6,
      borderRadius: 10,
      backgroundColor: colors.surface,
      marginLeft: 4,
    },
  });

  return (
    <TouchableOpacity 
      style={styles.rowContainer} 
      onPress={handleCardPress}
      activeOpacity={0.7}
    >
      <Image
        source={{ 
          uri: token.icon || 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=400'
        }}
        style={styles.rowIcon}
      />
      <View style={styles.rowTokenInfo}>
        <Text style={styles.rowTokenName} numberOfLines={1}>{token.name}</Text>
        <Text style={styles.rowMarketCap} numberOfLines={1}>{token.marketCap}</Text>
      </View>
      <View style={styles.rowChangeContainer}>
        <Text style={[styles.rowChange, { color: getPriceChangeColor(token.priceChange24h) }]}> 
          {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
        </Text>
      </View>
      <View style={styles.rowSparkline}>
        <SimpleSparkline
          data={token.priceChange24h > 0 ? [10, 50, 20, 60, 40, 80] : [80, 40, 60, 20, 50, 10]}
          color={getPriceChangeColor(token.priceChange24h)}
          width={48}
          height={20}
        />
      </View>
      <TouchableOpacity style={styles.rowStarButton} onPress={handleStarPress}>
        <Star
          size={18}
          color={isTokenFavorite ? colors.warning : colors.textSecondary}
          fill={isTokenFavorite ? colors.warning : 'transparent'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}