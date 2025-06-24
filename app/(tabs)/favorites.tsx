import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { TokenCard } from '@/components/TokenCard';
import { useTheme } from '@/contexts/ThemeContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { tokenService } from '@/services/tokenService';
import { Token } from '@/types/token';

export default function FavoritesScreen() {
  const { colors } = useTheme();
  const { favorites, isLoading: favoritesLoading } = useFavorites();
  const [favoriteTokens, setFavoriteTokens] = useState<Token[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Memoized filtered tokens
  const filteredTokens = useMemo(() => {
    if (searchQuery.trim() === '') {
      return favoriteTokens;
    }
    
    const query = searchQuery.toLowerCase();
    return favoriteTokens.filter(token =>
      token.name.toLowerCase().includes(query) ||
      token.symbol.toLowerCase().includes(query)
    );
  }, [searchQuery, favoriteTokens]);

  const loadFavoriteTokens = useCallback(async () => {
    if (favorites.length === 0) {
      setFavoriteTokens([]);
      return;
    }
    
    setLoading(true);
    try {
      // Get all enriched tokens and filter by favorites
      const allTokens = await tokenService.getEnrichedTokens(1, 100);
      const favTokens = allTokens.filter(token => favorites.includes(token.tokenAddress));
      setFavoriteTokens(favTokens);
    } catch (error) {
      console.error('Error loading favorite tokens:', error);
    } finally {
      setLoading(false);
    }
  }, [favorites]);

  const handleFilterPress = useCallback(() => {
    // TODO: Implement filter modal for favorites
    console.log('Filter pressed');
  }, []);

  const renderTokenCard = useCallback(({ item }: { item: Token }) => (
    <TokenCard token={item} />
  ), []);

  const renderHeader = useCallback(() => (
    <>
      <Header />
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterPress={handleFilterPress}
      />
    </>
  ), [searchQuery, handleFilterPress]);

  const renderEmpty = useCallback(() => {
    if (favoritesLoading || loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading favorites...
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {searchQuery ? 'No favorite tokens found matching your search' : 'No favorite tokens yet'}
        </Text>
        <Text style={[styles.emptySubText, { color: colors.textSecondary }]}>
          {!searchQuery && 'Star tokens from the main list to add them here'}
        </Text>
      </View>
    );
  }, [favoritesLoading, loading, searchQuery, colors]);

  const keyExtractor = useCallback((item: Token) => item.tokenAddress, []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 68,
    offset: 68 * index,
    index,
  }), []);

  useEffect(() => {
    if (!favoritesLoading) {
      loadFavoriteTokens();
    }
  }, [favorites, favoritesLoading, loadFavoriteTokens]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      paddingVertical: 40,
      alignItems: 'center',
      gap: 12,
    },
    loadingText: {
      fontSize: 16,
      fontWeight: '500',
    },
    emptyContainer: {
      paddingVertical: 40,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 17,
      textAlign: 'center',
      marginBottom: 8,
      fontWeight: '600',
    },
    emptySubText: {
      fontSize: 15,
      textAlign: 'center',
      fontWeight: '500',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredTokens}
        renderItem={renderTokenCard}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={filteredTokens.length === 0 ? { flex: 1 } : undefined}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={15}
        getItemLayout={getItemLayout}
      />
    </SafeAreaView>
  );
}