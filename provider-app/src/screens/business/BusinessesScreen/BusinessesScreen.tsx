import React from 'react';
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Briefcase, ChevronRight, Pencil, Plus, Star } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { EmptyState } from '@/components/EmptyState';
import { Color } from '@/utils/Theme';

import { useBusinessesScreen } from './useBusinessesScreen';
import { styles } from './styles';

export default function BusinessesScreen() {
  const { businesses, isLoading, refreshing, refresh, openBusiness, addBusiness, editBusiness } =
    useBusinessesScreen();

  return (
    <View style={styles.root}>
      <AppHeader
        title="My businesses"
        right={
          <TouchableOpacity style={styles.addBtn} onPress={addBusiness} accessibilityRole="button">
            <Plus size={18} color={Color.primary} />
          </TouchableOpacity>
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
      >
        {businesses.length === 0 && !isLoading ? (
          <EmptyState
            icon={<Briefcase size={48} color={Color.placeholder} strokeWidth={1.4} />}
            title="No businesses yet"
            body="Add your first business to start taking bookings or orders."
          />
        ) : (
          businesses.map((b) => (
            <View key={b.id} style={styles.card}>
              <TouchableOpacity style={styles.cardMain} onPress={() => openBusiness(b.id)}>
                {b.images?.[0] ? (
                  <Image source={{ uri: b.images[0] }} style={styles.iconImage} />
                ) : (
                  <View style={styles.icon}>
                    <Briefcase size={20} color={Color.primary} />
                  </View>
                )}
                <View style={styles.main}>
                  <View style={styles.cardTop}>
                    <Text style={styles.name} numberOfLines={1}>
                      {b.businessName}
                    </Text>
                    {b.isVerified && (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>Verified</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.meta}>
                    {b.category.name}
                    {b.subcategory ? ` · ${b.subcategory.name}` : ''}
                  </Text>
                  {b.ratingCount > 0 ? (
                    <View style={styles.ratingRow}>
                      <Star size={13} color={Color.warning} fill={Color.warning} />
                      <Text style={styles.ratingText}>
                        {b.ratingAvg.toFixed(1)} ({b.ratingCount})
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.meta}>No reviews yet</Text>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => editBusiness(b.id)}
                accessibilityRole="button"
                accessibilityLabel="Edit business"
              >
                <Pencil size={16} color={Color.primary} />
              </TouchableOpacity>
              <ChevronRight size={18} color={Color.placeholder} />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
