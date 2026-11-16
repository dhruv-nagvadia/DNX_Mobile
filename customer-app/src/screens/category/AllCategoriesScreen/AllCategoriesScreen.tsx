import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { StoreCategoryCard, useCardWidth } from '@/components/BusinessCards';
import { CategoryIcon } from '@/components/CategoryIcon';
import { GradientBackground } from '@/components/GradientBackground';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useGetCategoriesQuery } from '@/redux/api/category/categoryApi';
import { Category } from '@/redux/api/category/types';
import { ROUTES, RootStackParamList } from '@/navigation/routes';
import { TILE_CYCLE } from '@/utils/homeTiles';
import { LINK, ModernSize } from '@/utils/modernTheme';

import { GAP, styles } from './styles';

type Nav = {
  navigate: <T extends keyof RootStackParamList>(r: T, p?: RootStackParamList[T]) => void;
};

const TITLES = { SERVICE: 'All services', STORE: 'Shop by business' } as const;

/**
 * Every category of ONE type — whichever "View all" opened it. Uses the same
 * cards as Home: pastel icon tiles for services (4 per row), photo cards with
 * the name on the photo for store categories (2 per row).
 */
export default function AllCategoriesScreen() {
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
  // Service tiles: 4 per row like Home's grid. Store cards: same width as Home's rail.
  const cardW = Math.floor((contentW - GAP * 3) / 4);
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
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
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
                <TouchableOpacity
                  key={c.id}
                  style={[
                    styles.catTile,
                    { width: cardW, borderColor: TILE_CYCLE[i % TILE_CYCLE.length].border },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => onPress(c)}
                >
                  <GradientBackground colors={TILE_CYCLE[i % TILE_CYCLE.length].colors} />
                  <CategoryIcon
                    slug={c.slug}
                    size={26}
                    color={TILE_CYCLE[i % TILE_CYCLE.length].icon}
                    strokeWidth={1.7}
                  />
                  <Text style={styles.catName} numberOfLines={2}>
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
