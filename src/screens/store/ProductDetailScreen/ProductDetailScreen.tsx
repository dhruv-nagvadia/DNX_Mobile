import React from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Layers, Store } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { CategoryIcon } from '@/components/CategoryIcon';
import { CartHeaderButton } from '@/components/CartHeaderButton';
import { ProductAmountControl } from '@/components/ProductAmountControl';
import { Color } from '@/utils/Theme';
import { unitPriceLabel, stockLabel } from '@/utils/units';
import { useGetProviderByIdQuery } from '@/redux/api/provider/providerApi';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { styles } from './styles';

/** Full product detail: image, price, an amount picker (add to cart), then details. */
export default function ProductDetailScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, typeof ROUTES.PRODUCT_DETAILS>>();
  const { data: provider, isLoading } = useGetProviderByIdQuery(params.providerId);
  const product = provider?.products?.find((p) => p.id === params.productId);

  if (isLoading && !provider) {
    return (
      <View style={styles.container}>
        <AppHeader title="Product" right={<CartHeaderButton />} />
        <View style={styles.center}>
          <ActivityIndicator color={Color.primary} />
        </View>
      </View>
    );
  }

  if (!product || !provider) {
    return (
      <View style={styles.container}>
        <AppHeader title="Product" right={<CartHeaderButton />} />
        <View style={styles.center}>
          <Text style={styles.notFound}>This product is no longer available.</Text>
        </View>
      </View>
    );
  }

  const out = product.stockQty <= 0;

  return (
    <View style={styles.container}>
      <AppHeader title={product.name} right={<CartHeaderButton />} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={styles.imageWrap}>
          {product.imageUrl ? (
            <Image source={{ uri: product.imageUrl }} style={styles.image} />
          ) : (
            <CategoryIcon slug={provider.category.slug} size={72} strokeWidth={1.3} />
          )}
          {out && (
            <View style={styles.outBadge}>
              <Text style={styles.outText}>Out of stock</Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          {/* Identity */}
          <Text style={styles.name}>{product.name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.price}>
              {unitPriceLabel(product.priceMinor, product.priceQty, product.measure, product.currency)}
            </Text>
            {!!product.section && (
              <View style={styles.sectionChip}>
                <Layers size={12} color={Color.primaryDark} />
                <Text style={styles.sectionChipText}>{product.section}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.stock, out && styles.stockOut]}>{stockLabel(product.stockQty, product.measure)}</Text>

          {/* Add to cart — right up top, above the details */}
          <View style={styles.amountCard}>
            <Text style={styles.amountTitle}>Add to cart</Text>
            <Text style={styles.amountHint}>Pick the amount — switch the unit (e.g. g ↔ kg).</Text>
            <ProductAmountControl
              product={product}
              providerId={provider.id}
              providerName={provider.businessName}
            />
          </View>

          {/* Store */}
          <View style={styles.storeRow}>
            <Store size={15} color={Color.textSecondary} />
            <Text style={styles.storeLine}>Sold by {provider.businessName}</Text>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          {product.description ? (
            <Text style={styles.description}>{product.description}</Text>
          ) : (
            <Text style={styles.muted}>No description added for this product.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
