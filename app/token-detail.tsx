import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, LayoutAnimation } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, ExternalLink, Globe, Twitter, Send, BookOpen } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { tokenService } from '@/services/tokenService';
import { Token } from '@/types/token';
import { Sparkline } from '@/components/Sparkline';
import { Header } from '@/components/Header';

export default function TokenDetailScreen() {
  const { colors } = useTheme();
  const { token: tokenParam } = useLocalSearchParams<{ token: string }>();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const token: Token | null = tokenParam ? JSON.parse(tokenParam) : null;
  const [showMore, setShowMore] = useState(false);
  const [chartRange, setChartRange] = useState<'1H' | '24H' | '7D' | '30D'>('24H');

  if (!token) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.textSecondary }}>Token not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Mock chart data for toggles (replace with real data if available)
  const chartData = {
    '1H': [10, 12, 11, 13, 12, 14, 13, 15],
    '24H': [10, 15, 12, 18, 14, 20, 16, 22],
    '7D': [10, 20, 15, 25, 18, 28, 22, 30],
    '30D': [10, 30, 15, 35, 18, 38, 22, 40],
  };

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return colors.success;
    if (change < 0) return colors.error;
    return colors.textSecondary;
  };

  const handleStarPress = () => {
    if (!token) return;
    if (isFavorite(token.tokenAddress)) {
      removeFromFavorites(token.tokenAddress);
    } else {
      addToFavorites(token.tokenAddress);
    }
  };

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  const handleShowMore = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowMore((prev) => !prev);
  };

  const buyCount = token.transactions24h ? Math.round(token.transactions24h * 0.61) : 0;
  const sellCount = token.transactions24h ? token.transactions24h - buyCount : 0;
  const buyRatio = token.transactions24h ? Math.round((buyCount / token.transactions24h) * 100) : 0;
  const sellRatio = 100 - buyRatio;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    headerRow: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: colors.cardBackground, borderBottomWidth: 1, borderBottomColor: colors.border },
    icon: { width: 44, height: 44, borderRadius: 22, marginRight: 12, backgroundColor: colors.border },
    nameCol: { flex: 1, justifyContent: 'center' },
    tokenName: { fontSize: 20, fontWeight: 'bold', color: colors.text },
    tagline: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
    starButton: { padding: 8 },
    section: { backgroundColor: colors.cardBackground, borderRadius: 14, margin: 12, padding: 14, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 4 },
    statsCell: { width: '33%', alignItems: 'center', marginVertical: 6 },
    statsLabel: { fontSize: 13, color: colors.textSecondary },
    statsValue: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginTop: 2 },
    chartToggleRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 8, marginBottom: 2, gap: 8 },
    chartToggle: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: colors.surface, marginHorizontal: 2 },
    chartToggleActive: { backgroundColor: colors.primary },
    chartToggleText: { fontSize: 13, color: colors.textSecondary },
    chartToggleTextActive: { color: '#fff' },
    aboutTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 6 },
    aboutText: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
    showMore: { color: colors.primary, fontWeight: 'bold', marginTop: 6 },
    linksRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 4 },
    linkBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 18, marginBottom: 8 },
    linkText: { fontSize: 15, color: colors.primary, marginLeft: 6 },
    buySellRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
    buySellLabel: { fontSize: 14, color: colors.textSecondary },
    buySellValue: { fontSize: 15, fontWeight: 'bold', color: colors.text },
    buySellBar: { flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden', marginTop: 6, marginBottom: 2 },
    buyBar: { backgroundColor: colors.success, height: 12 },
    sellBar: { backgroundColor: colors.error, height: 12 },
    buySellRatioText: { fontSize: 13, color: colors.textSecondary, marginLeft: 6 },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* App Header */}
        <Header />
        {/* Header */}
        <View style={styles.headerRow}>
          <Image source={{ uri: token.icon || 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=400' }} style={styles.icon} />
          <View style={styles.nameCol}>
            <Text style={styles.tokenName}>{token.name}</Text>
            <Text style={styles.tagline} numberOfLines={1}>{token.description || 'No tagline available'}</Text>
          </View>
          <TouchableOpacity style={styles.starButton} onPress={handleStarPress}>
            <Star size={24} color={isFavorite(token.tokenAddress) ? colors.warning : colors.textSecondary} fill={isFavorite(token.tokenAddress) ? colors.warning : 'transparent'} />
          </TouchableOpacity>
        </View>

        {/* Key Stats Section */}
        <View style={styles.section}>
          <View style={styles.statsGrid}>
            <View style={styles.statsCell}><Text style={styles.statsLabel}>Price</Text><Text style={styles.statsValue}>{token.price}</Text></View>
            <View style={styles.statsCell}><Text style={styles.statsLabel}>24h Change</Text><Text style={[styles.statsValue, { color: getPriceChangeColor(token.priceChange24h) }]}>{token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%</Text></View>
            <View style={styles.statsCell}><Text style={styles.statsLabel}>Market Cap</Text><Text style={styles.statsValue}>{token.marketCap}</Text></View>
            <View style={styles.statsCell}><Text style={styles.statsLabel}>Volume</Text><Text style={styles.statsValue}>{tokenService.formatVolume(token.volume24h)}</Text></View>
            <View style={styles.statsCell}><Text style={styles.statsLabel}>Liquidity</Text><Text style={styles.statsValue}>{tokenService.formatLiquidity(token.liquidity)}</Text></View>
            <View style={styles.statsCell}><Text style={styles.statsLabel}>Txns (24h)</Text><Text style={styles.statsValue}>{token.transactions24h.toLocaleString()}</Text></View>
          </View>
        </View>

        {/* Chart Section */}
        <View style={styles.section}>
          <View style={styles.chartToggleRow}>
            {(['1H', '24H', '7D', '30D'] as const).map((range) => (
              <TouchableOpacity
                key={range}
                style={[styles.chartToggle, chartRange === range && styles.chartToggleActive]}
                onPress={() => setChartRange(range)}
              >
                <Text style={[styles.chartToggleText, chartRange === range && styles.chartToggleTextActive]}>{range}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Dummy Graph Placeholder */}
          <View style={{ alignItems: 'center', justifyContent: 'center', height: 120, marginTop: 8, marginBottom: 8, backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.textSecondary, fontSize: 16 }}>[Graph Coming Soon]</Text>
          </View>
        </View>

        {/* About the Token */}
        <View style={styles.section}>
          <Text style={styles.aboutTitle}>About the Token</Text>
          <Text style={styles.aboutText} numberOfLines={showMore ? undefined : 3}>{token.description || 'No description available.'}</Text>
          {token.description && token.description.length > 80 && (
            <TouchableOpacity onPress={handleShowMore}>
              <Text style={styles.showMore}>{showMore ? 'Show Less' : 'Show More'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Official Links */}
        {(token.links?.website || token.links?.twitter || token.links?.telegram) && (
          <View style={styles.section}>
            <View style={styles.linksRow}>
              {token.links.website && (
                <TouchableOpacity style={styles.linkBtn} onPress={() => handleLinkPress(token.links!.website!)}>
                  <Globe size={20} color={colors.primary} />
                  <Text style={styles.linkText}>Website</Text>
                  <ExternalLink size={16} color={colors.primary} style={{ marginLeft: 2 }} />
                </TouchableOpacity>
              )}
              {token.links.twitter && (
                <TouchableOpacity style={styles.linkBtn} onPress={() => handleLinkPress(token.links!.twitter!)}>
                  <Twitter size={20} color={colors.primary} />
                  <Text style={styles.linkText}>Twitter</Text>
                  <ExternalLink size={16} color={colors.primary} style={{ marginLeft: 2 }} />
                </TouchableOpacity>
              )}
              {token.links.telegram && (
                <TouchableOpacity style={styles.linkBtn} onPress={() => handleLinkPress(token.links!.telegram!)}>
                  <Send size={20} color={colors.primary} />
                  <Text style={styles.linkText}>Telegram</Text>
                  <ExternalLink size={16} color={colors.primary} style={{ marginLeft: 2 }} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Buy/Sell Activity */}
        <View style={styles.section}>
          <View style={styles.buySellRow}>
            <Text style={styles.buySellLabel}>🟢 Buys (24h): <Text style={styles.buySellValue}>{buyCount}</Text></Text>
            <Text style={styles.buySellLabel}>🔴 Sells: <Text style={styles.buySellValue}>{sellCount}</Text></Text>
          </View>
          <View style={styles.buySellBar}>
            <View style={[styles.buyBar, { width: `${buyRatio}%` }]} />
            <View style={[styles.sellBar, { width: `${sellRatio}%` }]} />
          </View>
          <Text style={styles.buySellRatioText}>📊 Buy/Sell Ratio: <Text style={{ color: colors.success }}>{buyRatio}%</Text>/<Text style={{ color: colors.error }}>{sellRatio}%</Text></Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}