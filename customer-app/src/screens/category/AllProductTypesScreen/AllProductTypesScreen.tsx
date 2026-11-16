import React from 'react';
import { ActivityIndicator, ScrollView, View, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { CARD_GAP, ProductTypeCard } from '@/components/BusinessCards';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useGetProductTypesQuery } from '@/redux/api/productType/productTypeApi';
import { ProductType } from '@/redux/api/productType/types';
import { ROUTES, RootStackParamList } from '@/navigation/routes';
import { LINK, ModernSize } from '@/utils/modernTheme';

import { styles } from './styles';

type Nav = {
  navigate: <T extends keyof RootStackParamList>(r: T, p?: RootStackParamList[T]) => void;
};

/** Every product type — the same pastel-backed photo card as Home's "Shop by product", 3 per row. */
export default function AllProductTypesScreen() {
  const navigation = useNavigation<Nav>();
  const { data: productTypes = [], isLoading } = useGetProductTypesQuery();

  // Three per row — close to Home's product card (~133pt) and evenly spaced.
  const { width } = useWindowDimensions();
  const cardW = Math.floor((width - ModernSize.gutter * 2 - CARD_GAP * 2) / 3);

  const onPress = (t: ProductType) =>
    navigation.navigate(ROUTES.PRODUCT_TYPE, { slug: t.slug, name: t.name });

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Shop by product"
        subtitle={isLoading ? undefined : `${productTypes.length} product types`}
      />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={LINK} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {productTypes.map((t, i) => (
              <ProductTypeCard key={t.id} type={t} width={cardW} index={i} onPress={onPress} />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
