import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';

import { AppHeader } from '@/components/AppHeader';
import { StoreProductCard } from '@/components/StoreProductCard';
import { Color } from '@/utils/Theme';

import { useProductTypeScreen } from './useProductTypeScreen';
import { styles } from './styles';

/** JSX only — logic comes from useProductTypeScreen. */
export default function ProductTypeScreen() {
  const { title, products, isFetching, onProductPress } = useProductTypeScreen();

  return (
    <View style={styles.container}>
      <AppHeader title={title} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isFetching ? (
          <View style={styles.center}>
            <ActivityIndicator color={Color.primary} />
          </View>
        ) : products.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.stateText}>No products of this type yet — check back soon.</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {products.map((p) => (
              <StoreProductCard
                key={p.id}
                product={p}
                providerId={p.provider.id}
                providerName={p.provider.businessName}
                storeLabel={p.provider.city ? `${p.provider.businessName} · ${p.provider.city}` : p.provider.businessName}
                onPress={() => onProductPress(p)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
