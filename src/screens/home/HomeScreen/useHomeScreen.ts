import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { useGetCategoriesQuery } from '@/redux/api/category/categoryApi';
import { useGetProvidersQuery } from '@/redux/api/provider/providerApi';
import { useGetPlatformCouponsQuery } from '@/redux/api/order/orderApi';
import { PlatformCoupon } from '@/redux/api/order/types';
import { useAppSelector } from '@/redux/hooks';
import { getRecentlyViewed, RecentProvider } from '@/utils/recentlyViewed';
import { ROUTES } from '@/navigation/routes';
import { Category } from '@/redux/api/category/types';
import { Provider } from '@/redux/api/provider/types';
import { Color } from '@/utils/Theme';
import { HomeScreenNavigationProp, Offer } from './types';
import { LOCATION, TRUST_STATS, POPULAR_CATEGORY_ORDER } from './mock';

const RANK = new Map(POPULAR_CATEGORY_ORDER.map((slug, i) => [slug, i]));

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

// The Home grid only teases the top categories — "View all" opens the full list.
const HOME_CATEGORY_LIMIT = 12;

/** All state, data-fetching, and handlers for the customer HomeScreen. */
export function useHomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const currentUser = useAppSelector((state) => state.user.currentUser);

  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();
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

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Order categories by popularity (most booked first); Home only teases the
  // first page of them, with "View all" opening the complete list.
  const orderedCategories = useMemo(
    () => [...categories].sort((a, b) => (RANK.get(a.slug) ?? 99) - (RANK.get(b.slug) ?? 99)),
    [categories],
  );
  const visibleCategories = orderedCategories.slice(0, HOME_CATEGORY_LIMIT);
  const hasMoreCategories = orderedCategories.length > HOME_CATEGORY_LIMIT;

  const onCategoryPress = useCallback(
    (category: Category) => {
      navigation.navigate(ROUTES.CATEGORY, { slug: category.slug, name: category.name });
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
  const goToAllCategories = useCallback(
    () => navigation.navigate(ROUTES.ALL_CATEGORIES),
    [navigation],
  );

  // Number of distinct products in the cart (not the summed amounts).
  const cartCount = useAppSelector((s) => s.cart.items.filter((i) => i.quantity > 0).length);

  return {
    firstName,
    greeting,
    categories: visibleCategories,
    hasMoreCategories,
    categoriesLoading,
    mostBooked: providersPage?.items ?? [],
    stores: storesPage?.items ?? [],
    mostBookedBanner,
    storesBanner,
    recentlyViewed,
    onCategoryPress,
    onOfferPress,
    onProviderPress,
    onRecentPress,
    goToProfile,
    goToSearch,
    goToCart,
    goToLocationPicker,
    goToAllCategories,
    cartCount,
    // Falls back to a static default until the customer sets a real location.
    location: customerLocation?.label ?? LOCATION,
    offers: platformCoupons.map(toOffer),
    trustStats: TRUST_STATS,
  };
}
