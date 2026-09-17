import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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

/** Every category the customer can browse — SERVICE and STORE both, in one grid. */
export default function AllCategoriesScreen() {
  const navigation = useNavigation<Nav>();
  const { data: categories = [], isLoading } = useGetCategoriesQuery();
  // Exact width so 4 columns + gaps fill the row edge-to-edge on any device.
  const catCardWidth = useGridItemWidth(CAT_COLUMNS, CAT_GAP, Spacing.lg);

  const onPress = (c: Category) => navigation.navigate(ROUTES.CATEGORY, { slug: c.slug, name: c.name });

  return (
    <View style={styles.container}>
      <AppHeader title="All categories" />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Color.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {categories.map((c) => (
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
