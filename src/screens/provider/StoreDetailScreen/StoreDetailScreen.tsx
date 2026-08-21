import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Plus, Minus, ShoppingBag, Star, BadgeCheck } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { CategoryIcon } from '@/components/CategoryIcon';
import { BusinessContact } from '@/components/BusinessContact';
import { ReviewItem } from '@/components/ReviewItem';
import { Color } from '@/utils/Theme';
import { formatAmount, stockLabel, priceLabel, amountPrice, formatMoney } from '@/utils/units';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCartQty } from '@/redux/slices/cartSlice';
import { useGetProviderReviewsQuery } from '@/redux/api/provider/providerApi';
import { ROUTES } from '@/navigation/routes';
import { Provider, Product } from '@/redux/api/provider/types';

// Shared look with the service detail page.
import { styles as ds } from '../ProviderDetailScreen/styles';
import { styles } from './styles';

const SCREEN_W = Dimensions.get('window').width;

/** Store detail — service-style header/gallery + an e-commerce catalog by section. */
export function StoreDetail({ provider }: { provider: Provider }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<{ navigate: (r: string, p?: object) => void }>();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((s) => s.cart.items);
  const { data: reviews = [] } = useGetProviderReviewsQuery(provider.id);

  const [activeImage, setActiveImage] = useState(0);
  const products = provider.products ?? [];

  // Group products into storefront sections (uncategorised → "More products").
  const productGroups = useMemo(() => {
    const map = new Map<string, Product[]>();
    for (const p of products) {
      const key = p.section?.trim() || 'More products';
      const arr = map.get(key) ?? [];
      arr.push(p);
      map.set(key, arr);
    }
    return Array.from(map.entries()).map(([section, items]) => ({ section, items }));
  }, [products]);

  const qtyOf = (productId: string) => cartItems.find((i) => i.productId === productId)?.quantity ?? 0;

  const changeQty = (p: Product, quantity: number) =>
    dispatch(
      setCartQty({
        item: {
          productId: p.id,
          providerId: provider.id,
          providerName: provider.businessName,
          name: p.name,
          measure: p.measure,
          priceMinor: p.priceMinor,
          priceQty: p.priceQty,
          currency: p.currency,
          stockQty: p.stockQty,
          stepQty: p.stepQty,
        },
        quantity: Math.max(0, Math.min(quantity, p.stockQty)),
      }),
    );

  const cartCount = cartItems.filter((i) => i.quantity > 0).length;
  const cartTotal = cartItems.reduce((s, i) => s + amountPrice(i.quantity, i.priceQty, i.priceMinor), 0);

  const onGalleryScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setActiveImage(Math.round(e.nativeEvent.contentOffset.x / SCREEN_W));

  const renderProductCard = (p: Product) => {
    const qty = qtyOf(p.id);
    const out = p.stockQty <= 0;
    return (
      <View key={p.id} style={styles.eCard}>
        <View style={styles.eImageWrap}>
          {p.imageUrl ? (
            <Image source={{ uri: p.imageUrl }} style={styles.eImage} />
          ) : (
            <CategoryIcon slug={provider.category.slug} size={32} />
          )}
          {out && (
            <View style={styles.eOutBadge}>
              <Text style={styles.eOutText}>Out of stock</Text>
            </View>
          )}
        </View>
        <View style={styles.eBody}>
          <Text style={styles.eName} numberOfLines={2}>
            {p.name}
          </Text>
          <Text style={styles.ePrice}>{priceLabel(p.priceMinor, p.priceQty, p.measure, p.currency)}</Text>
          <Text style={[styles.eStock, out && styles.eStockOut]}>{stockLabel(p.stockQty, p.measure)}</Text>

          {qty === 0 ? (
            <TouchableOpacity
              style={[styles.eAddBtn, out && styles.disabled]}
              activeOpacity={0.85}
              disabled={out}
              onPress={() => changeQty(p, p.stepQty)}
            >
              <Plus size={14} color={Color.white} />
              <Text style={styles.eAddText}>Add {formatAmount(p.stepQty, p.measure)}</Text>
            </TouchableOpacity>
          ) : (
            <>
              <View style={styles.eStepper}>
                <TouchableOpacity style={styles.eStepBtn} onPress={() => changeQty(p, qty - p.stepQty)}>
                  <Minus size={14} color={Color.primary} />
                </TouchableOpacity>
                <Text style={styles.eQty}>{formatAmount(qty, p.measure)}</Text>
                <TouchableOpacity
                  style={[styles.eStepBtn, qty + p.stepQty > p.stockQty && styles.disabled]}
                  disabled={qty + p.stepQty > p.stockQty}
                  onPress={() => changeQty(p, qty + p.stepQty)}
                >
                  <Plus size={14} color={Color.primary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.eLinePrice}>{formatMoney(amountPrice(qty, p.priceQty, p.priceMinor), p.currency)}</Text>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={ds.container}>
      <AppHeader title={provider.businessName} />

      <ScrollView
        contentContainerStyle={[ds.content, { paddingBottom: cartCount > 0 ? 120 : 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Gallery */}
        {provider.images.length > 0 ? (
          <View style={ds.galleryWrap}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onGalleryScroll}
              style={ds.gallery}
            >
              {provider.images.map((url, i) => (
                <TouchableOpacity
                  key={url}
                  activeOpacity={0.95}
                  onPress={() => navigation.navigate(ROUTES.GALLERY, { images: provider.images, index: i })}
                >
                  <Image source={{ uri: url }} style={ds.galleryImg} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={ds.countBadge}>
              <Text style={ds.countText}>
                {activeImage + 1} / {provider.images.length}
              </Text>
            </View>
            {provider.images.length > 1 && (
              <View style={ds.dots}>
                {provider.images.map((url, i) => (
                  <View key={url} style={[ds.dot, i === activeImage && ds.dotActive]} />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={ds.galleryFallback}>
            <CategoryIcon slug={provider.category.slug} size={64} strokeWidth={1.4} />
          </View>
        )}

        <View style={ds.body}>
          {/* Header */}
          <Text style={ds.name}>{provider.businessName}</Text>
          <View style={ds.badgeRow}>
            <View style={ds.chip}>
              <CategoryIcon slug={provider.category.slug} size={13} color={Color.primaryDark} />
              <Text style={ds.chipText}>{provider.subcategory?.name ?? provider.category.name}</Text>
            </View>
            {provider.isVerified && (
              <View style={ds.chip}>
                <BadgeCheck size={13} color={Color.success} />
                <Text style={ds.chipText}>Verified</Text>
              </View>
            )}
          </View>
          <View style={ds.metaRow}>
            <Star size={14} color={Color.warning} fill={Color.warning} />
            <Text style={ds.metaText}>
              {provider.ratingAvg.toFixed(1)} ({provider.ratingCount} reviews)
            </Text>
          </View>

          {/* About */}
          {!!provider.description && (
            <>
              <Text style={ds.sectionTitle}>About</Text>
              <Text style={ds.about}>{provider.description}</Text>
            </>
          )}

          {/* Products — grouped into horizontal section rows */}
          {products.length === 0 ? (
            <>
              <Text style={ds.sectionTitle}>Products</Text>
              <View style={styles.empty}>
                <ShoppingBag size={40} color={Color.placeholder} strokeWidth={1.4} />
                <Text style={styles.emptyText}>This store hasn’t added any products yet.</Text>
              </View>
            </>
          ) : (
            productGroups.map((g) => (
              <View key={g.section} style={styles.group}>
                <View style={styles.groupHead}>
                  <Text style={styles.groupTitle}>{g.section}</Text>
                  <Text style={styles.groupCount}>{g.items.length}</Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.eRow}
                >
                  {g.items.map(renderProductCard)}
                </ScrollView>
              </View>
            ))
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <>
              <Text style={ds.sectionTitle}>Reviews ({reviews.length})</Text>
              {reviews.slice(0, 3).map((r) => (
                <ReviewItem key={r.id} review={r} />
              ))}
              {reviews.length > 3 && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(ROUTES.REVIEWS, {
                      providerId: provider.id,
                      businessName: provider.businessName,
                    })
                  }
                >
                  <Text style={styles.viewAll}>View all {reviews.length} reviews</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {/* Contact — at the bottom */}
          <Text style={ds.sectionTitle}>Contact & pickup</Text>
          <BusinessContact
            phone={provider.phone}
            email={provider.email}
            addressLine={provider.addressLine}
            city={provider.city}
            state={provider.state}
            postalCode={provider.postalCode}
            callLabel="Call the store"
            addressLabel="Pickup address"
          />
        </View>
      </ScrollView>

      {/* Sticky cart bar — spans all shops */}
      {cartCount > 0 && (
        <View style={[styles.cartBar, { paddingBottom: insets.bottom + 12 }]}>
          <View>
            <Text style={styles.cartCount}>
              {cartCount} item{cartCount > 1 ? 's' : ''} in cart
            </Text>
            <Text style={styles.cartTotal}>{formatMoney(cartTotal)}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.9} onPress={() => navigation.navigate(ROUTES.CART)}>
            <ShoppingBag size={18} color={Color.white} />
            <Text style={styles.checkoutText}>View cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
