import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { Search, Star, BadgeCheck } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Color } from '@/utils/Theme';

import { useSearchScreen } from './useSearchScreen';
import { styles } from './styles';

/** Full-text provider search. */
export default function SearchScreen() {
  const { query, setQuery, providers, isFetching, hasQuery, onProviderPress } = useSearchScreen();

  return (
    <View style={styles.container}>
      <AppHeader title="Search" />

      <View style={styles.searchBar}>
        <Search size={18} color={Color.placeholder} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search salons, doctors, plumbers…"
          placeholderTextColor={Color.placeholder}
          value={query}
          onChangeText={setQuery}
          autoFocus
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>

      {!hasQuery ? (
        <View style={styles.center}>
          <Search size={44} color={Color.placeholder} strokeWidth={1.4} />
          <Text style={styles.hint}>Type at least 2 letters to search businesses.</Text>
        </View>
      ) : isFetching ? (
        <View style={styles.center}>
          <ActivityIndicator color={Color.primary} />
        </View>
      ) : providers.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.hint}>No businesses match “{query.trim()}”.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
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
        </ScrollView>
      )}
    </View>
  );
}
