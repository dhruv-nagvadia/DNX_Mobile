import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { useGetCategoriesQuery } from '@/redux/api/category/categoryApi';
import { useGetProductTypesQuery } from '@/redux/api/productType/productTypeApi';
import { useGetProvidersQuery } from '@/redux/api/provider/providerApi';
import { useGetPlatformCouponsQuery } from '@/redux/api/order/orderApi';
import { PlatformCoupon } from '@/redux/api/order/types';
import { useAppSelector } from '@/redux/hooks';
import { getRecentlyViewed, RecentProvider } from '@/utils/recentlyViewed';
import { ROUTES } from '@/navigation/routes';
import { Category } from '@/redux/api/category/types';
import { ProductType } from '@/redux/api/productType/types';
import { Provider } from '@/redux/api/provider/types';
import { Color } from '@/utils/Theme';
import { HomeScreenNavigationProp, Offer } from './types';
import { LOCATION, HERO_BANNERS } from './mock';

// Cycled across cards — same palette the old hardcoded offers used.
const OFFER_COLORS = [Color.primary, Color.primaryDark, Color.ink2];

function discountLabel(c: PlatformCoupon): string {
  return c.discountType === 'PERCENT'
    ? `Flat ${c.discountValue}% OFF`
    : `₹${Math.round(c.discountValue / 100)} OFF`;
}

/** Maps a real, redeemable platform coupon to the Home "Offers for you" card shape. */
function toOffer(c: PlatformCoupon, i: number): Offer {
  return {
    id: c.code,
    title: discountLabel(c),
    subtitle: c.description || 'Apply this code at checkout',
    tag: c.code,
    bg: OFFER_COLORS[i % OFFER_COLORS.length],
    categorySlug: c.categorySlug,
    categoryName: c.categoryName,
  };
}

// Each category grid (services, stores) only teases two rows — "View all"
// opens the complete, type-specific list.
const HOME_CATEGORY_LIMIT = 8;

/** All state, data-fetching, and handlers for the customer HomeScreen. */
export function useHomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const currentUser = useAppSelector((state) => state.user.currentUser);

  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();
  const { data: productTypes = [] } = useGetProductTypesQuery();
  const { data: platformCoupons = [] } = useGetPlatformCouponsQuery();
  const customerLocation = useAppSelector((s) => s.location.current);
  // Send everything we know — the backend tries postal code first, then
  // widens to city, then state, only as far as each tier comes up empty.
  const locationFilter = {
    ...(customerLocation?.postalCode ? { postalCode: customerLocation.postalCode } : {}),
    ...(customerLocation?.city ? { city: customerLocation.city } : {}),
    ...(customerLocation?.state ? { state: customerLocation.state } : {}),
  };

  // "Most booked" service businesses — top-ranked providers (booking-count sort later).
  const { data: providersPage } = useGetProvidersQuery({ type: 'SERVICE', limit: 3, ...locationFilter });
  // Nearby stores you can order products from.
  const { data: storesPage } = useGetProvidersQuery({ type: 'STORE', limit: 6, ...locationFilter });

  // When the backend had to widen past an exact postal-code match, let the
  // customer know these results cover a broader area.
  const describeScope = useCallback((scope: 'postalCode' | 'city' | 'state' | null | undefined) => {
    if (scope === 'city') return `Showing results across ${customerLocation?.city ?? 'your city'}`;
    if (scope === 'state') return `Showing results across ${customerLocation?.state ?? 'your state'}`;
    return null;
  }, [customerLocation?.city, customerLocation?.state]);

  const mostBookedBanner = describeScope(providersPage?.locationScope);
  const storesBanner = describeScope(storesPage?.locationScope);

  // Recently opened businesses (cached on-device); refresh each time Home focuses.
  const [recentlyViewed, setRecentlyViewed] = useState<RecentProvider[]>([]);
  useFocusEffect(
    useCallback(() => {
      let active = true;
      getRecentlyViewed().then((list) => {
        if (active) setRecentlyViewed(list);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const firstName = (currentUser?.fullName ?? 'there').split(' ')[0];

  // Services (appointments) and stores (products) are different categories
  // entirely — shown as two separate sections so a customer always knows
  // which mode they're browsing in. The API already returns categories
  // ordered by everyday-use popularity (Category.sortOrder), so this just
  // splits by type without re-sorting. Home only teases the first two rows,
  // with "View all" opening the complete, type-specific list.
  const serviceCategories = useMemo(() => categories.filter((c) => c.type !== 'STORE'), [categories]);
  const storeCategories = useMemo(() => categories.filter((c) => c.type === 'STORE'), [categories]);
  const visibleServiceCategories = serviceCategories.slice(0, HOME_CATEGORY_LIMIT);
  const visibleStoreCategories = storeCategories.slice(0, HOME_CATEGORY_LIMIT);
  const hasMoreServiceCategories = serviceCategories.length > HOME_CATEGORY_LIMIT;
  const hasMoreStoreCategories = storeCategories.length > HOME_CATEGORY_LIMIT;

  // "Shop by product" — a third, distinct browsing mode: pooled products of
  // one kind (e.g. "Bath & Body") across every store that sells them, not a
  // list of stores. Already sorted by sortOrder from the backend.
  const visibleProductTypes = productTypes.slice(0, HOME_CATEGORY_LIMIT);
  const hasMoreProductTypes = productTypes.length > HOME_CATEGORY_LIMIT;

  const onCategoryPress = useCallback(
    (category: Category) => {
      navigation.navigate(ROUTES.CATEGORY, { slug: category.slug, name: category.name });
    },
    [navigation],
  );

  const onProductTypePress = useCallback(
    (type: ProductType) => {
      navigation.navigate(ROUTES.PRODUCT_TYPE, { slug: type.slug, name: type.name });
    },
    [navigation],
  );

  // Tapping an offer should always tell the customer how/where to use it —
  // and take them straight there when the coupon is tied to one category.
  const onOfferPress = useCallback(
    (offer: Offer) => {
      if (offer.categorySlug) {
        Alert.alert(
          offer.title,
          `Use code ${offer.tag} at checkout on any ${offer.categoryName ?? 'eligible'} booking.`,
          [
            {
              text: `Browse ${offer.categoryName ?? 'businesses'}`,
              onPress: () =>
                navigation.navigate(ROUTES.CATEGORY, {
                  slug: offer.categorySlug as string,
                  name: offer.categoryName ?? '',
                }),
            },
            { text: 'OK', style: 'cancel' },
          ],
        );
        return;
      }
      Alert.alert(offer.title, `Use code ${offer.tag} at checkout on your next booking or order.`, [
        { text: 'Explore', onPress: () => navigation.navigate(ROUTES.SEARCH) },
        { text: 'OK', style: 'cancel' },
      ]);
    },
    [navigation],
  );

  const onProviderPress = useCallback(
    (provider: Provider) => {
      navigation.navigate(ROUTES.PROVIDER_DETAILS, {
        providerId: provider.id,
        name: provider.businessName,
      });
    },
    [navigation],
  );

  const onRecentPress = useCallback(
    (item: RecentProvider) => {
      navigation.navigate(ROUTES.PROVIDER_DETAILS, { providerId: item.id, name: item.name });
    },
    [navigation],
  );

  const goToProfile = useCallback(() => navigation.navigate(ROUTES.PROFILE), [navigation]);
  const goToSearch = useCallback(() => navigation.navigate(ROUTES.SEARCH), [navigation]);
  const goToCart = useCallback(() => navigation.navigate(ROUTES.CART), [navigation]);
  const goToLocationPicker = useCallback(
    () => navigation.navigate(ROUTES.LOCATION_PICKER),
    [navigation],
  );
  const goToAllServiceCategories = useCallback(
    () => navigation.navigate(ROUTES.ALL_CATEGORIES, { type: 'SERVICE' }),
    [navigation],
  );
  const goToAllStoreCategories = useCallback(
    () => navigation.navigate(ROUTES.ALL_CATEGORIES, { type: 'STORE' }),
    [navigation],
  );
  const goToAllProductTypes = useCallback(
    () => navigation.navigate(ROUTES.ALL_PRODUCT_TYPES),
    [navigation],
  );

  // Number of distinct products in the cart (not the summed amounts).
  const cartCount = useAppSelector((s) => s.cart.items.filter((i) => i.quantity > 0).length);

  return {
    firstName,
    serviceCategories: visibleServiceCategories,
    storeCategories: visibleStoreCategories,
    productTypes: visibleProductTypes,
    hasMoreServiceCategories,
    hasMoreStoreCategories,
    hasMoreProductTypes,
    categoriesLoading,
    mostBooked: providersPage?.items ?? [],
    stores: storesPage?.items ?? [],
    mostBookedBanner,
    storesBanner,
    recentlyViewed,
    onCategoryPress,
    onProductTypePress,
    onOfferPress,
    onProviderPress,
    onRecentPress,
    goToProfile,
    goToSearch,
    goToCart,
    goToLocationPicker,
    goToAllServiceCategories,
    goToAllStoreCategories,
    goToAllProductTypes,
    cartCount,
    // Falls back to a static default until the customer sets a real location.
    location: customerLocation?.label ?? LOCATION,
    offers: platformCoupons.map(toOffer),
    heroBanners: HERO_BANNERS,
  };
}
