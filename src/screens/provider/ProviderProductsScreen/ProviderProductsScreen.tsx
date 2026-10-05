import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ShoppingBag } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { StoreProductCard } from '@/components/StoreProductCard';
import { Color } from '@/utils/Theme';
import { ROUTES } from '@/navigation/routes';

import { useProviderProductsScreen } from './useProviderProductsScreen';
import { ProviderProductsNavigationProp } from './types';
import { styles } from './styles';

/** A store's product catalog — a flat grid for one category tile, or the
 * full catalog grouped by section when opened without a category filter. */
export default function ProviderProductsScreen() {
  const navigation = useNavigation<ProviderProductsNavigationProp>();
  const { title, provider, isLoading, groups, products, count } = useProviderProductsScreen();

  const renderCard = (p: (typeof products)[number]) => (
    <StoreProductCard
      key={p.id}
      product={p}
      providerId={provider!.id}
      providerName={provider!.businessName}
      categorySlug={provider!.category.slug}
      depositPercent={provider!.depositPercent}
      onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAILS, { providerId: provider!.id, productId: p.id })}
    />
  );

  return (
    <View style={styles.container}>
      <AppHeader title={title} />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Color.primary} />
        </View>
      ) : !provider || count === 0 ? (
        <View style={styles.center}>
          <ShoppingBag size={44} color={Color.placeholder} strokeWidth={1.4} />
          <Text style={styles.hint}>No products yet.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {groups ? (
            groups.map((g) => (
              <View key={g.section} style={styles.group}>
                <View style={styles.groupHead}>
                  <Text style={styles.groupTitle}>{g.section}</Text>
                  <Text style={styles.groupCount}>{g.items.length}</Text>
                </View>
                <View style={styles.grid}>{g.items.map(renderCard)}</View>
              </View>
            ))
          ) : (
            <View style={styles.grid}>{products.map(renderCard)}</View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
