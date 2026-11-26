import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  View,
  useWindowDimensions,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import {
  ServiceCategoryTile,
  StoreCategoryCard,
  categoryGridMetrics,
  useCardWidth,
} from '@/components/BusinessCards';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useGetCategoriesQuery } from '@/redux/api/category/categoryApi';
import { Category } from '@/redux/api/category/types';
import { ROUTES, RootStackParamList } from '@/navigation/routes';
import { LINK, ModernSize } from '@/utils/modernTheme';
import { useBottomInsetStyle } from '@/hooks/useBottomInsetStyle';

import { GAP, styles } from './styles';

type Nav = {
  navigate: <T extends keyof RootStackParamList>(r: T, p?: RootStackParamList[T]) => void;
};

const TITLES = { SERVICE: 'All services', STORE: 'Shop by business' } as const;

/**
 * Every category of ONE type — whichever "View all" opened it. Uses the same
 * cards as Home: photo tiles for services (3 per row), photo cards with
 * the name on the photo for store categories (2 per row).
 */
export default function AllCategoriesScreen() {
  const withBottomInset = useBottomInsetStyle();
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'AllCategoriesScreen'>>();
  const type = params?.type ?? 'SERVICE';
  const isStore = type === 'STORE';

  const { data: categories = [], isLoading } = useGetCategoriesQuery();
  const filtered = useMemo(
    () => categories.filter((c) => (isStore ? c.type === 'STORE' : c.type !== 'STORE')),
    [categories, isStore],
  );

  const { width } = useWindowDimensions();
  const contentW = width - ModernSize.gutter * 2;
  // Service tiles: 3 per row like Home's grid. Store cards: same width as Home's rail.
  const { width: cardW, gap: serviceGap } = categoryGridMetrics(contentW, GAP);
  const storeCardW = useCardWidth();

  const onPress = (c: Category) =>
    navigation.navigate(ROUTES.CATEGORY, { slug: c.slug, name: c.name });
  const subtitle = isLoading
    ? undefined
    : `${filtered.length} ${isStore ? 'store types' : 'categories'}`;

  return (
    <View style={styles.container}>
      <ScreenHeader title={TITLES[type]} subtitle={subtitle} />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={LINK} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={withBottomInset(styles.content)} showsVerticalScrollIndicator={false}>
          <View style={[styles.grid, !isStore && { gap: serviceGap }]}>
            {filtered.map((c, i) =>
              isStore ? (
                <StoreCategoryCard
                  key={c.id}
                  category={c}
                  width={storeCardW}
                  index={i}
                  onPress={onPress}
                />
              ) : (
                <ServiceCategoryTile
                  key={c.id}
                  category={c}
                  width={cardW}
                  index={i}
                  onPress={onPress}
                />
              ),
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
