import React from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Layers, Star, Tag } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { CategoryIcon } from '@/components/CategoryIcon';
import { CartHeaderButton } from '@/components/CartHeaderButton';
import { ProductAmountControl } from '@/components/ProductAmountControl';
import { ReviewItem } from '@/components/ReviewItem';
import { Color } from '@/utils/Theme';
import { unitPriceLabel, stockLabel, formatMoney } from '@/utils/units';
import { useAppSelector } from '@/redux/hooks';
import {
  useGetProviderByIdQuery,
  useGetProductReviewsQuery,
} from '@/redux/api/provider/providerApi';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { styles } from './styles';

/** Full product detail: image, price, an amount picker (add to cart), then details. */
export default function ProductDetailScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, typeof ROUTES.PRODUCT_DETAILS>>();
  // Must match the exact query args used elsewhere (StoreDetailScreen,
  // ProviderProductsScreen) so they all share ONE RTK Query cache entry —
  // otherwise this screen can drift out of sync with a stale/separate fetch.
  const postalCode = useAppSelector((s) => s.location.current?.postalCode);
  const { data: provider, isLoading } = useGetProviderByIdQuery({ id: params.providerId, postalCode });
  const { data: reviews = [], isLoading: reviewsLoading } = useGetProductReviewsQuery(
    params.productId,
  );
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
          <Text style={styles.byLine}>by {provider.businessName}</Text>
          {(product.ratingCount ?? 0) > 0 && (
            <View style={styles.ratingRow}>
              <Star size={14} color={Color.warning} fill={Color.warning} />
              <Text style={styles.ratingText}>{(product.ratingAvg ?? 0).toFixed(1)}</Text>
              <Text style={styles.ratingCount}>
                ({product.ratingCount} review{product.ratingCount === 1 ? '' : 's'})
              </Text>
            </View>
          )}
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
          <Text style={[styles.stock, out && styles.stockOut]}>
            {stockLabel(product.stockQty, product.measure, product.unlimitedStock)}
          </Text>

          {/* Coupon — a preview; the code still has to be entered at checkout */}
          {product.coupon && (
            <View style={styles.couponCard}>
              <View style={styles.couponCardHead}>
                <Tag size={16} color={Color.success} />
                <Text style={styles.couponCardTitle}>Coupon available</Text>
              </View>
              <View style={styles.couponPriceRow}>
                <Text style={styles.priceStrike}>
                  {unitPriceLabel(product.priceMinor, product.priceQty, product.measure, product.currency)}
                </Text>
                <Text style={styles.priceDiscounted}>
                  {unitPriceLabel(product.coupon.finalPriceMinor, product.priceQty, product.measure, product.currency)}
                </Text>
              </View>
              <View style={styles.couponCodeRow}>
                <Text style={styles.couponCode}>{product.coupon.code}</Text>
                <Text style={styles.couponSavings}>
                  You save {formatMoney(product.coupon.discountMinor, product.currency)}
                </Text>
              </View>
              <Text style={styles.couponHint}>Enter this code at checkout to get this price.</Text>
            </View>
          )}

          {/* Add to cart — right up top, above the details */}
          <View style={styles.amountCard}>
            <Text style={styles.amountTitle}>Add to cart</Text>
            <Text style={styles.amountHint}>Pick the amount — switch the unit (e.g. g ↔ kg).</Text>
            <ProductAmountControl
              product={product}
              providerId={provider.id}
              providerName={provider.businessName}
              depositPercent={provider.depositPercent ?? 20}
              codEnabled={product.codEnabled}
              partialPayEnabled={product.partialPayEnabled}
            />
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          {product.description ? (
            <Text style={styles.description}>{product.description}</Text>
          ) : (
            <Text style={styles.muted}>No description added for this product.</Text>
          )}

          {/* Reviews */}
          <Text style={styles.sectionTitle}>Reviews</Text>
          {reviewsLoading ? (
            <ActivityIndicator color={Color.primary} />
          ) : reviews.length === 0 ? (
            <Text style={styles.muted}>No reviews yet. Be the first after you buy it.</Text>
          ) : (
            reviews.map((r) => <ReviewItem key={r.id} review={r} />)
          )}
        </View>
      </ScrollView>
    </View>
  );
}
