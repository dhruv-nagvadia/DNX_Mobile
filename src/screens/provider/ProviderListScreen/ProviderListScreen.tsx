import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Star, BadgeCheck } from 'lucide-react-native';

import { CategoryIcon } from '@/components/CategoryIcon';
import { Color } from '@/utils/Theme';

import { useProviderListScreen } from './useProviderListScreen';
import { styles } from './styles';

/** JSX only — logic comes from useProviderListScreen. */
export default function ProviderListScreen() {
  const { title, providers, total, isLoading, onProviderPress } = useProviderListScreen();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator color={Color.primary} />
          </View>
        ) : providers.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.stateText}>No businesses listed for {title} yet.{'\n'}Check back soon.</Text>
          </View>
        ) : (
          <>
            <Text style={styles.lead}>
              {total} {total === 1 ? 'business' : 'businesses'} available
            </Text>

            {providers.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => onProviderPress(p)}
              >
                <View style={styles.avatar}>
                  {p.images.length > 0 ? (
                    <Image source={{ uri: p.images[0] }} style={styles.avatarImg} />
                  ) : (
                    <CategoryIcon slug={p.category.slug} size={24} />
                  )}
                </View>
                <View style={styles.info}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name} numberOfLines={1}>
                      {p.businessName}
                    </Text>
                    {p.isVerified && <BadgeCheck size={15} color={Color.success} />}
                  </View>
                  <Text style={styles.meta} numberOfLines={1}>
                    {p.subcategory?.name ?? p.category.name}
                    {p.city ? ` · ${p.city}` : ''}
                  </Text>
                  <View style={styles.ratingRow}>
                    <Star size={13} color={Color.warning} fill={Color.warning} />
                    <Text style={styles.ratingText}>
                      {p.ratingAvg.toFixed(1)} ({p.ratingCount})
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}
