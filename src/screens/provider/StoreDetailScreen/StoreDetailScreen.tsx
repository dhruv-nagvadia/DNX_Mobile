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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ShoppingBag, Star, BadgeCheck } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { CategoryIcon } from '@/components/CategoryIcon';
import { ProductTypeIcon } from '@/components/ProductTypeIcon';
import { BusinessContact } from '@/components/BusinessContact';
import { CartHeaderButton } from '@/components/CartHeaderButton';
import { ReviewItem } from '@/components/ReviewItem';
import { Color } from '@/utils/Theme';
import { amountPrice, formatMoney } from '@/utils/units';
import { useAppSelector } from '@/redux/hooks';
import { useGetProviderReviewsQuery } from '@/redux/api/provider/providerApi';
import { ROUTES, RootStackParamList } from '@/navigation/routes';
import { Provider } from '@/redux/api/provider/types';

// Shared look with the service detail page.
import { styles as ds } from '../ProviderDetailScreen/styles';
import { styles } from './styles';

const SCREEN_W = Dimensions.get('window').width;
const UNTAGGED_NAME = 'Other items';

interface CategoryTile {
  slug: string | null; // null = products with no product type tagged
  name: string;
  iconUrl?: string | null;
}

/** Store detail — service-style header/gallery + "shop by category" tiles. */
export function StoreDetail({ provider }: { provider: Provider }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const cartItems = useAppSelector((s) => s.cart.items);
  const { data: reviews = [] } = useGetProviderReviewsQuery(provider.id);

  const [activeImage, setActiveImage] = useState(0);

  // Only the categories this store actually sells, in first-seen order.
  const categories = useMemo<CategoryTile[]>(() => {
    const seen = new Map<string, CategoryTile>();
    let hasUntagged = false;
    for (const p of provider.products ?? []) {
      if (p.productType) {
        if (!seen.has(p.productType.slug)) {
          seen.set(p.productType.slug, {
            slug: p.productType.slug,
            name: p.productType.name,
            iconUrl: p.productType.iconUrl,
          });
        }
      } else {
        hasUntagged = true;
      }
    }
    const tiles = [...seen.values()];
    if (hasUntagged) {
      tiles.push({ slug: null, name: UNTAGGED_NAME });
    }
    return tiles;
  }, [provider.products]);

  const cartCount = cartItems.filter((i) => i.quantity > 0).length;
  const cartTotal = cartItems.reduce((s, i) => s + amountPrice(i.quantity, i.priceQty, i.priceMinor), 0);

  const onGalleryScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setActiveImage(Math.round(e.nativeEvent.contentOffset.x / SCREEN_W));

  const openCategory = (c: CategoryTile) =>
    navigation.navigate(ROUTES.PROVIDER_PRODUCTS, {
      providerId: provider.id,
      businessName: provider.businessName,
      productTypeSlug: c.slug,
      categoryName: c.name,
    });

  return (
    <View style={ds.container}>
      <AppHeader title={provider.businessName} right={<CartHeaderButton />} />

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

          {/* Products — shop by the categories this store actually sells */}
          <Text style={ds.sectionTitle}>Shop by category</Text>
          {categories.length === 0 ? (
            <View style={styles.empty}>
              <ShoppingBag size={40} color={Color.placeholder} strokeWidth={1.4} />
              <Text style={styles.emptyText}>This store hasn’t added any products yet.</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hRow}>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c.slug ?? UNTAGGED_NAME}
                  style={styles.productCard}
                  activeOpacity={0.85}
                  onPress={() => openCategory(c)}
                >
                  <View style={styles.productCardImageWrap}>
                    {c.iconUrl ? (
                      <Image source={{ uri: c.iconUrl }} style={styles.productCardImage} resizeMode="contain" />
                    ) : (
                      <ProductTypeIcon slug={c.slug ?? ''} size={28} color={Color.primary} />
                    )}
                  </View>
                  <Text style={styles.productCardName} numberOfLines={2}>
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
