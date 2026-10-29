import React from 'react';
import { RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

import { Color } from '@/utils/Theme';

import { useBusinessDetailScreen } from './useBusinessDetailScreen';
import { styles } from './styles';

export default function BusinessDetailScreen() {
  const {
    business,
    isStore,
    isLoading,
    refreshing,
    refresh,
    goToHours,
    goToCalendar,
    goToEdit,
    goToServices,
    goToProducts,
    goToStock,
    goToCoupons,
    goToReviews,
    goBack,
  } = useBusinessDetailScreen();

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={goBack} accessibilityRole="button">
            <ChevronLeft size={20} color={Color.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>
            {business?.businessName ?? 'Business'}
          </Text>
        </View>

        {business && (
          <View style={styles.card}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>
                {business.category.name}
                {business.subcategory ? ` · ${business.subcategory.name}` : ''}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{business.phone}</Text>
            </View>
            {!!business.addressLine && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Address</Text>
                <Text style={styles.detailValue}>
                  {business.addressLine}
                  {business.city ? `, ${business.city}` : ''}
                </Text>
              </View>
            )}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Rating</Text>
              <Text style={styles.detailValue}>
                {business.ratingCount > 0 ? `★ ${business.ratingAvg.toFixed(1)} (${business.ratingCount})` : '—'}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={goToEdit}>
            <Text style={styles.menuItemText}>Edit business details</Text>
            <ChevronRight size={18} color={Color.textSecondary} />
          </TouchableOpacity>
          {isStore ? (
            <>
              <TouchableOpacity style={styles.menuItem} onPress={goToProducts}>
                <Text style={styles.menuItemText}>Products</Text>
                <ChevronRight size={18} color={Color.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={goToStock}>
                <Text style={styles.menuItemText}>Stock</Text>
                <ChevronRight size={18} color={Color.textSecondary} />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.menuItem} onPress={goToServices}>
              <Text style={styles.menuItemText}>Services</Text>
              <ChevronRight size={18} color={Color.textSecondary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.menuItem} onPress={goToCoupons}>
            <Text style={styles.menuItemText}>Coupons</Text>
            <ChevronRight size={18} color={Color.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={goToReviews}>
            <Text style={styles.menuItemText}>Reviews</Text>
            <ChevronRight size={18} color={Color.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={goToHours}>
            <Text style={styles.menuItemText}>Weekly hours</Text>
            <ChevronRight size={18} color={Color.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={goToCalendar}>
            <Text style={styles.menuItemText}>Date overrides</Text>
            <ChevronRight size={18} color={Color.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
