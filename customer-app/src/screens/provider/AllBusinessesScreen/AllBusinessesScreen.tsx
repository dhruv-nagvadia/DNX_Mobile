import React from 'react';
import { ActivityIndicator, FlatList, Text, View, useWindowDimensions } from 'react-native';
import { Store } from 'lucide-react-native';

import { ServiceRow, StoreCard } from '@/components/BusinessCards';
import { ScreenHeader } from '@/components/ScreenHeader';
import { INK, LINK, ModernSize } from '@/utils/modernTheme';

import { useAllBusinessesScreen } from './useAllBusinessesScreen';
import { GAP, styles } from './styles';

const TITLES = { STORE: 'All stores', SERVICE: 'Popular services' } as const;

/** Full list behind Home's "View all": store cards 2 per row, or service rows. */
export default function AllBusinessesScreen() {
  const {
    type,
    title,
    categorySlug,
    items,
    total,
    isLoading,
    isLoadingMore,
    isRefreshing,
    scopeNote,
    loadMore,
    refresh,
    onPress,
  } = useAllBusinessesScreen();
  const isStore = type === 'STORE';
  // Home's "All stores" keeps the 2-up store cards; a category's list (e.g.
  // "Top rated in Food & Hospitality") uses rows for stores and services alike.
  const grid = isStore && !categorySlug;

  const { width } = useWindowDimensions();
  const cardW = Math.floor((width - ModernSize.gutter * 2 - GAP) / 2);

  const subtitle = isLoading
    ? undefined
    : `${total} ${isStore ? (total === 1 ? 'store' : 'stores') : total === 1 ? 'business' : 'businesses'} near you`;

  return (
    <View style={styles.container}>
      <ScreenHeader title={title ?? TITLES[type]} subtitle={subtitle} />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={LINK} />
        </View>
      ) : (
        <FlatList
          key={grid ? 'grid' : 'rows'}
          data={items}
          keyExtractor={(p) => p.id}
          numColumns={grid ? 2 : 1}
          columnWrapperStyle={grid ? styles.row : undefined}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          refreshing={isRefreshing}
          onRefresh={refresh}
          ListHeaderComponent={scopeNote ? <Text style={styles.scopeText}>{scopeNote}</Text> : null}
          ListFooterComponent={
            isLoadingMore ? <ActivityIndicator style={styles.footer} color={LINK} /> : null
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Store size={40} color={INK} strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>
                {isStore ? 'No stores nearby yet' : 'No services nearby yet'}
              </Text>
              <Text style={styles.emptyText}>Try changing your location from the Home screen.</Text>
            </View>
          }
          renderItem={({ item, index }) =>
            grid ? (
              <StoreCard store={item} width={cardW} index={index} onPress={onPress} />
            ) : (
              <ServiceRow
                provider={item}
                index={index}
                variant={isStore ? 'store' : 'service'}
                onPress={onPress}
              />
            )
          }
        />
      )}
    </View>
  );
}
