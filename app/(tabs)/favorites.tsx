import { View, StyleSheet, FlatList, Text, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
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
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!favoritesLoading) {
      loadFavoriteTokens();
    }
  }, [favorites, favoritesLoading]);

  useEffect(() => {
    // Filter tokens based on search query
    if (searchQuery.trim() === '') {
      setFilteredTokens(favoriteTokens);
    } else {
      const filtered = favoriteTokens.filter(token =>
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTokens(filtered);
    }
  }, [searchQuery, favoriteTokens]);

  const loadFavoriteTokens = async () => {
    if (favorites.length === 0) {
      setFavoriteTokens([]);
      setFilteredTokens([]);
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
  };

  const handleFilterPress = () => {
    // TODO: Implement filter modal for favorites
    console.log('Filter pressed');
  };

  const renderTokenCard = ({ item }: { item: Token }) => (
    <TokenCard token={item} />
  );

  const renderHeader = () => (
    <>
      <Header />
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterPress={handleFilterPress}
      />
    </>
  );

  const renderEmpty = () => {
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
  };

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
        keyExtractor={(item) => item.tokenAddress}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={filteredTokens.length === 0 ? { flex: 1 } : undefined}
      />
    </SafeAreaView>
  );
}