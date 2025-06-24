import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  minMarketCap?: number;
  maxMarketCap?: number;
  minPriceChange?: number;
  maxPriceChange?: number;
  sortBy: 'price' | 'marketCap' | 'priceChange24h' | 'volume24h';
  sortOrder: 'asc' | 'desc';
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

const { height: screenHeight } = Dimensions.get('window');

export function FilterModal({ visible, onClose, onApply, currentFilters }: FilterModalProps) {
  const { colors } = useTheme();
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      sortBy: 'marketCap',
      sortOrder: 'desc',
    };
    setFilters(resetFilters);
  };

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const sortOptions = [
    { key: 'price', label: 'Price' },
    { key: 'marketCap', label: 'Market Cap' },
    { key: 'priceChange24h', label: '24h Change' },
    { key: 'volume24h', label: 'Volume' },
  ];

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modal: {
      backgroundColor: colors.cardBackground,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      height: screenHeight * 0.85,
      paddingTop: 8,
    },
    handle: {
      width: 40,
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
    },
    closeButton: {
      padding: 4,
    },
    scrollContainer: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    rangeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    rangeInput: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 48,
    },
    rangeSeparator: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    sortContainer: {
      gap: 12,
    },
    sortOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 56,
    },
    sortOptionActive: {
      backgroundColor: colors.primary + '15',
      borderColor: colors.primary,
    },
    sortOptionText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '500',
    },
    sortOptionTextActive: {
      color: colors.primary,
      fontWeight: '600',
    },
    orderContainer: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 12,
    },
    orderButton: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 52,
    },
    orderButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    orderButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    orderButtonTextActive: {
      color: '#FFFFFF',
    },
    footer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 20,
      paddingBottom: 40,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.cardBackground,
    },
    resetButton: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 52,
    },
    resetButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    applyButton: {
      flex: 2,
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
      minHeight: 52,
    },
    applyButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
        <View style={styles.modal}>
          <View style={styles.handle} />
          
          <View style={styles.header}>
            <Text style={styles.title}>Filter & Sort</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.scrollContainer} 
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Range ($)</Text>
              <View style={styles.rangeContainer}>
                <TextInput
                  style={styles.rangeInput}
                  placeholder="Min"
                  placeholderTextColor={colors.textSecondary}
                  value={filters.minPrice?.toString() || ''}
                  onChangeText={(text) => updateFilter('minPrice', text ? parseFloat(text) : undefined)}
                  keyboardType="numeric"
                />
                <Text style={styles.rangeSeparator}>to</Text>
                <TextInput
                  style={styles.rangeInput}
                  placeholder="Max"
                  placeholderTextColor={colors.textSecondary}
                  value={filters.maxPrice?.toString() || ''}
                  onChangeText={(text) => updateFilter('maxPrice', text ? parseFloat(text) : undefined)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Market Cap Range</Text>
              <View style={styles.rangeContainer}>
                <TextInput
                  style={styles.rangeInput}
                  placeholder="Min (M)"
                  placeholderTextColor={colors.textSecondary}
                  value={filters.minMarketCap ? (filters.minMarketCap / 1000000).toString() : ''}
                  onChangeText={(text) => updateFilter('minMarketCap', text ? parseFloat(text) * 1000000 : undefined)}
                  keyboardType="numeric"
                />
                <Text style={styles.rangeSeparator}>to</Text>
                <TextInput
                  style={styles.rangeInput}
                  placeholder="Max (M)"
                  placeholderTextColor={colors.textSecondary}
                  value={filters.maxMarketCap ? (filters.maxMarketCap / 1000000).toString() : ''}
                  onChangeText={(text) => updateFilter('maxMarketCap', text ? parseFloat(text) * 1000000 : undefined)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>24h Change Range (%)</Text>
              <View style={styles.rangeContainer}>
                <TextInput
                  style={styles.rangeInput}
                  placeholder="Min"
                  placeholderTextColor={colors.textSecondary}
                  value={filters.minPriceChange?.toString() || ''}
                  onChangeText={(text) => updateFilter('minPriceChange', text ? parseFloat(text) : undefined)}
                  keyboardType="numeric"
                />
                <Text style={styles.rangeSeparator}>to</Text>
                <TextInput
                  style={styles.rangeInput}
                  placeholder="Max"
                  placeholderTextColor={colors.textSecondary}
                  value={filters.maxPriceChange?.toString() || ''}
                  onChangeText={(text) => updateFilter('maxPriceChange', text ? parseFloat(text) : undefined)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort By</Text>
              <View style={styles.sortContainer}>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.sortOption,
                      filters.sortBy === option.key && styles.sortOptionActive,
                    ]}
                    onPress={() => updateFilter('sortBy', option.key)}
                  >
                    <Text
                      style={[
                        styles.sortOptionText,
                        filters.sortBy === option.key && styles.sortOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {filters.sortBy === option.key && (
                      <Check size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.orderContainer}>
                <TouchableOpacity
                  style={[
                    styles.orderButton,
                    filters.sortOrder === 'desc' && styles.orderButtonActive,
                  ]}
                  onPress={() => updateFilter('sortOrder', 'desc')}
                >
                  <Text
                    style={[
                      styles.orderButtonText,
                      filters.sortOrder === 'desc' && styles.orderButtonTextActive,
                    ]}
                  >
                    High to Low
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.orderButton,
                    filters.sortOrder === 'asc' && styles.orderButtonActive,
                  ]}
                  onPress={() => updateFilter('sortOrder', 'asc')}
                >
                  <Text
                    style={[
                      styles.orderButtonText,
                      filters.sortOrder === 'asc' && styles.orderButtonTextActive,
                    ]}
                  >
                    Low to High
                  </Text>
                </TouchableOpacity>
                </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}