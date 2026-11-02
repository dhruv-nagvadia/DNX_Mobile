import React from 'react';
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Briefcase, ChevronRight, Pencil, Plus, Star } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
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
          businesses.map((b) => {
            const isStore = b.type === 'STORE';
            const itemCount = isStore ? (b.products?.length ?? 0) : b.services.length;
            const itemLabel = isStore ? 'product' : 'service';
            // Subcategory only (falls back to category when there's no
            // subcategory) — matches the web app, not category + subcategory.
            const place = [b.subcategory?.name ?? b.category.name, b.city].filter(Boolean).join(' · ');
            return (
              <View key={b.id} style={styles.card}>
                <View style={styles.cardRow}>
                  <TouchableOpacity style={styles.cardMain} onPress={() => openBusiness(b.id)}>
                    {b.images?.[0] ? (
                      <Image source={{ uri: b.images[0] }} style={styles.iconImage} />
                    ) : (
                      <View style={styles.icon}>
                        <Briefcase size={20} color={Color.primary} />
                      </View>
                    )}
                    <View style={styles.main}>
                      <Text style={styles.name} numberOfLines={1}>
                        {b.businessName}
                      </Text>
                      <Text style={styles.meta} numberOfLines={1}>
                        {place}
                      </Text>
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

                <TouchableOpacity style={styles.infoRow} onPress={() => openBusiness(b.id)}>
                  <View style={styles.infoLeft}>
                    <Text style={styles.meta}>
                      {itemCount} {itemLabel}
                      {itemCount === 1 ? '' : 's'}
                    </Text>
                    <Text style={styles.dot}>·</Text>
                    <Star size={13} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.ratingText}>{b.ratingAvg.toFixed(1)}</Text>
                  </View>
                  {b.isBlocked ? (
                    <StatusBadge label="Blocked" tone="error" />
                  ) : b.isVerified ? (
                    <StatusBadge label="Verified" tone="success" />
                  ) : (
                    <StatusBadge label="Pending" tone="warning" />
                  )}
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
