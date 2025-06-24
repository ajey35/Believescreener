import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, Filter } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterPress: () => void;
}

export function SearchBar({ searchQuery, onSearchChange, onFilterPress }: SearchBarProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      marginVertical: 12,
      gap: 12,
    },
    searchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 16,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    searchIcon: {
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      height: 48,
      fontSize: 16,
      color: colors.text,
      fontWeight: '500',
    },
    filterButton: {
      width: 48,
      height: 48,
      backgroundColor: colors.surface,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
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
      <View style={styles.searchContainer}>
        <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tokens..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={onSearchChange}
          returnKeyType="search"
        />
      </View>
      <TouchableOpacity 
        style={styles.filterButton} 
        onPress={onFilterPress}
        activeOpacity={0.7}
      >
        <Filter size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}