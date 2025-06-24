import { View, StyleSheet, FlatList, RefreshControl, ActivityIndicator, Text } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { TokenDescriptionCard } from '@/components/TokenDescriptionCard';
import { SearchBar } from '@/components/SearchBar';
import { TokenCard } from '@/components/TokenCard';
import { LaunchTokenButton } from '@/components/LaunchTokenButton';
import { FilterModal, FilterOptions } from '@/components/FilterModal';
import { useTheme } from '@/contexts/ThemeContext';
import { tokenService } from '@/services/tokenService';
import { Token } from '@/types/token';

export default function TokensScreen() {
  const { colors } = useTheme();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'marketCap',
    sortOrder: 'desc',
  });

  useEffect(() => {
    loadTokens();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [searchQuery, tokens, filters]);

  const loadTokens = async (pageNumber = 1, refresh = false) => {
    if (loading && !refresh) return;

    setLoading(true);
    try {
      const newTokens = await tokenService.getEnrichedTokens(pageNumber, 15);
      
      if (refresh || pageNumber === 1) {
        setTokens(newTokens);
        setPage(2);
      } else {
        setTokens(prev => [...prev, ...newTokens]);
        setPage(prev => prev + 1);
      }

      setHasMore(newTokens.length === 15);
    } catch (error) {
      console.error('Error loading tokens:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFiltersAndSearch = () => {
    let filtered = [...tokens];

    // Apply search filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(token =>
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply price filters
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(token => {
        const price = parseFloat(token.price.replace('$', ''));
        return price >= filters.minPrice!;
      });
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(token => {
        const price = parseFloat(token.price.replace('$', ''));
        return price <= filters.maxPrice!;
      });
    }

    // Apply market cap filters
    if (filters.minMarketCap !== undefined) {
      filtered = filtered.filter(token => {
        const marketCap = parseMarketCapValue(token.marketCap);
        return marketCap >= filters.minMarketCap!;
      });
    }

    if (filters.maxMarketCap !== undefined) {
      filtered = filtered.filter(token => {
        const marketCap = parseMarketCapValue(token.marketCap);
        return marketCap <= filters.maxMarketCap!;
      });
    }

    // Apply price change filters
    if (filters.minPriceChange !== undefined) {
      filtered = filtered.filter(token => token.priceChange24h >= filters.minPriceChange!);
    }

    if (filters.maxPriceChange !== undefined) {
      filtered = filtered.filter(token => token.priceChange24h <= filters.maxPriceChange!);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: number, bValue: number;

      switch (filters.sortBy) {
        case 'price':
          aValue = parseFloat(a.price.replace('$', ''));
          bValue = parseFloat(b.price.replace('$', ''));
          break;
        case 'marketCap':
          aValue = parseMarketCapValue(a.marketCap);
          bValue = parseMarketCapValue(b.marketCap);
          break;
        case 'priceChange24h':
          aValue = a.priceChange24h;
          bValue = b.priceChange24h;
          break;
        case 'volume24h':
          aValue = a.volume24h;
          bValue = b.volume24h;
          break;
        default:
          return 0;
      }

      return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setFilteredTokens(filtered);
  };

  const parseMarketCapValue = (marketCap: string): number => {
    const value = parseFloat(marketCap.replace(/[$,]/g, ''));
    if (marketCap.includes('B')) return value * 1e9;
    if (marketCap.includes('M')) return value * 1e6;
    if (marketCap.includes('K')) return value * 1e3;
    return value;
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    loadTokens(1, true);
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadTokens(page);
    }
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const renderTokenCard = ({ item }: { item: Token }) => (
    <TokenCard token={item} />
  );

  const renderHeader = () => (
    <>
      <Header />
      <TokenDescriptionCard />
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterPress={handleFilterPress}
      />
    </>
  );

  const renderFooter = () => (
    <>
      {loading && tokens.length > 0 && (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
      <LaunchTokenButton />
    </>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {searchQuery ? 'No tokens found matching your search' : 'No tokens available'}
      </Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    footerLoader: {
      paddingVertical: 16,
      alignItems: 'center',
    },
    emptyContainer: {
      paddingVertical: 32,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
    },
  });

  if (loading && tokens.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredTokens}
        renderItem={renderTokenCard}
        keyExtractor={(item) => item.tokenAddress}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
      />
      
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
      />
    </SafeAreaView>
  );
}