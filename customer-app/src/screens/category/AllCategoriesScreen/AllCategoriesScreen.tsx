import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { AppHeader } from '@/components/AppHeader';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Color, Spacing } from '@/utils/Theme';
import { useGridItemWidth } from '@/utils/useGridItemWidth';
import { useGetCategoriesQuery } from '@/redux/api/category/categoryApi';
import { Category } from '@/redux/api/category/types';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { styles } from './styles';

type Nav = { navigate: <T extends keyof RootStackParamList>(r: T, p?: RootStackParamList[T]) => void };

const CAT_COLUMNS = 4;
const CAT_GAP = Spacing.sm;

const TITLES = { SERVICE: 'All services', STORE: 'All stores' } as const;

/** Every category of ONE type — whichever you tapped "View all" from. No
 * toggle here: this screen shows exactly what it was opened for. */
export default function AllCategoriesScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'AllCategoriesScreen'>>();
  const type = params?.type ?? 'SERVICE';

  const { data: categories = [], isLoading } = useGetCategoriesQuery();
  const filtered = useMemo(
    () => categories.filter((c) => (type === 'STORE' ? c.type === 'STORE' : c.type !== 'STORE')),
    [categories, type],
  );
  // Exact width so columns + gaps fill the row edge-to-edge on any device.
  const catCardWidth = useGridItemWidth(CAT_COLUMNS, CAT_GAP, Spacing.lg);

  const onPress = (c: Category) => navigation.navigate(ROUTES.CATEGORY, { slug: c.slug, name: c.name });

  return (
    <View style={styles.container}>
      <AppHeader title={TITLES[type]} />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Color.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {filtered.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[styles.catCard, { width: catCardWidth }]}
                activeOpacity={0.8}
                onPress={() => onPress(c)}
              >
                <View style={styles.catTile}>
                  <CategoryIcon slug={c.slug} size={26} />
                </View>
                <Text style={styles.catName} numberOfLines={2}>
                  {c.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
