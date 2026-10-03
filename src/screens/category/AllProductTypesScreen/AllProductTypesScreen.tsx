import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AppHeader } from '@/components/AppHeader';
import { ProductTypeIcon } from '@/components/ProductTypeIcon';
import { Color, Spacing } from '@/utils/Theme';
import { PRODUCT_TYPE_TONES } from '@/utils/productTypeTones';
import { useGridItemWidth } from '@/utils/useGridItemWidth';
import { useGetProductTypesQuery } from '@/redux/api/productType/productTypeApi';
import { ProductType } from '@/redux/api/productType/types';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { styles } from './styles';

type Nav = { navigate: <T extends keyof RootStackParamList>(r: T, p?: RootStackParamList[T]) => void };

const PRODUCT_COLUMNS = 3;
const PRODUCT_GAP = Spacing.sm;

/** Every product type a customer can shop by, pooled across all stores —
 * same real-photo card look as Home's row, wrapped into a grid here since
 * this screen shows everything at once. */
export default function AllProductTypesScreen() {
  const navigation = useNavigation<Nav>();
  const { data: productTypes = [], isLoading } = useGetProductTypesQuery();
  // Exact width so columns + gaps fill the row edge-to-edge on any device,
  // instead of a fixed card width leaving a ragged gap at the row's end.
  const productCardWidth = useGridItemWidth(PRODUCT_COLUMNS, PRODUCT_GAP, Spacing.lg);

  const onPress = (t: ProductType) => navigation.navigate(ROUTES.PRODUCT_TYPE, { slug: t.slug, name: t.name });

  return (
    <View style={styles.container}>
      <AppHeader title="Shop by product" />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Color.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {productTypes.map((t, i) => {
              const tone = PRODUCT_TYPE_TONES[i % PRODUCT_TYPE_TONES.length];
              return (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.productCard, { width: productCardWidth, backgroundColor: tone.bg }]}
                  activeOpacity={0.85}
                  onPress={() => onPress(t)}
                >
                  {t.iconUrl ? (
                    <Image source={{ uri: t.iconUrl }} style={styles.productCardImage} resizeMode="contain" />
                  ) : (
                    <View style={styles.productCardIconFallback}>
                      <ProductTypeIcon slug={t.slug} size={28} color={tone.fg} />
                    </View>
                  )}
                  <Text style={styles.productCardName} numberOfLines={2}>
                    {t.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
