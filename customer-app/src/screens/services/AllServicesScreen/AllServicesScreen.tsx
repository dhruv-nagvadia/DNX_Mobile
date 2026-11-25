import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { Sparkles } from 'lucide-react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import { INK, LINK } from '@/utils/modernTheme';
// Same row as Home's "Popular services to book", so both look identical.
import { PopularServiceRow } from '@/screens/home/HomeScreen/HomeSections';
import { styles } from '@/screens/provider/AllBusinessesScreen/styles';
import { useBottomInsetStyle } from '@/hooks/useBottomInsetStyle';

import { useAllServicesScreen } from './useAllServicesScreen';

/** Full list behind Home's "Popular services to book" → View all. */
export default function AllServicesScreen() {
  const withBottomInset = useBottomInsetStyle();
  const {
    items,
    total,
    isLoading,
    isLoadingMore,
    isRefreshing,
    scopeNote,
    loadMore,
    refresh,
    onPress,
  } = useAllServicesScreen();

  const subtitle = isLoading
    ? undefined
    : `${total} ${total === 1 ? 'service' : 'services'} near you`;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Popular services" subtitle={subtitle} />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={LINK} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(s) => s.id}
          contentContainerStyle={withBottomInset(styles.content)}
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
              <Sparkles size={40} color={INK} strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>No services nearby yet</Text>
              <Text style={styles.emptyText}>Try changing your location from the Home screen.</Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <PopularServiceRow service={item} index={index} onPress={onPress} />
          )}
        />
      )}
    </View>
  );
}
