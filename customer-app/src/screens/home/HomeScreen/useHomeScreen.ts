import { useCallback, useMemo, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { useGetCategoriesQuery } from '@/redux/api/category/categoryApi';
import { useGetProductTypesQuery } from '@/redux/api/productType/productTypeApi';
import { useGetProvidersQuery, useSearchServicesQuery } from '@/redux/api/provider/providerApi';
import { useGetMyBookingsQuery } from '@/redux/api/booking/bookingApi';
import { Booking } from '@/redux/api/booking/types';
import { isUpcomingBooking } from '@/utils/bookingStatus';
import { locationNote, useLocationFilter } from '@/hooks/useLocationFilter';
import { useGetPlatformCouponsQuery } from '@/redux/api/order/orderApi';
import { PlatformCoupon } from '@/redux/api/order/types';
import { useAppSelector } from '@/redux/hooks';
import { getRecentlyViewed, RecentProvider } from '@/utils/recentlyViewed';
import { ROUTES } from '@/navigation/routes';
import { Category } from '@/redux/api/category/types';
import { ProductType } from '@/redux/api/productType/types';
import { Provider, ServiceSearchResult } from '@/redux/api/provider/types';
import { HomeScreenNavigationProp, Offer } from './types';
import { LOCATION, HERO_BANNERS } from './mock';

// Pastel themes cycled across the offer cards (see modernTheme TINT).
const OFFER_TINTS: Offer['tint'][] = ['peach', 'lavender', 'mint', 'blue'];

function discountLabel(c: PlatformCoupon): string {
  return c.discountType === 'PERCENT'
    ? `${c.discountValue}% OFF`
    : `FLAT ₹${Math.round(c.discountValue / 100)} OFF`;
}

/** Maps a real, redeemable platform coupon to the Home "Offers for you" card shape. */
function toOffer(c: PlatformCoupon, i: number): Offer {
  return {
    id: c.code,
    title: discountLabel(c),
    subtitle: c.description || 'Apply this code at checkout',
    tag: c.code,
    tint: OFFER_TINTS[i % OFFER_TINTS.length],
    categorySlug: c.categorySlug,
    categoryName: c.categoryName,
  };
}

// Home teases this many; "View all" opens the full list.
const POPULAR_SERVICES_LIMIT = 3;
const BOOK_AGAIN_LIMIT = 8;
const OPEN_NOW_LIMIT = 8;

// Each category grid (services, stores) only teases two rows — "View all"
// opens the complete, type-specific list.
const HOME_CATEGORY_LIMIT = 8;

/** All state, data-fetching, and handlers for the customer HomeScreen. */
export function useHomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const currentUser = useAppSelector((state) => state.user.currentUser);

  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();
  // SERVICES-ONLY: product types not fetched for launch — restore by removing the `{ skip: true }` arg
  const { data: productTypes = [] } = useGetProductTypesQuery(undefined, { skip: true });
  const { data: platformCoupons = [] } = useGetPlatformCouponsQuery();
  // Customer's GPS point / PIN code — the backend searches 10 → 20 → 50 →
  // 100 km rings around it, stopping at the first ring with results.
  const { filter: locationFilter, location: customerLocation } = useLocationFilter();

  // "Popular services to book" — one service per business (its most-booked),
  // ranked by the business's rating, then its number of reviews (backend order).
  const { data: servicesPage } = useSearchServicesQuery({
    limit: POPULAR_SERVICES_LIMIT,
    sort: 'rating',
    onePerProvider: true,
    ...locationFilter,
  });
  const popularServices = servicesPage?.items ?? [];

  // "Open now near you" — service businesses open right now, nearest first.
  const { data: openNowPage } = useGetProvidersQuery({
    type: 'SERVICE',
    openNow: true,
    sort: 'nearest',
    limit: OPEN_NOW_LIMIT,
    ...locationFilter,
  });

  // The customer's own bookings → "Your next booking" + "Book again".
  // Refetch on focus so a booking made a moment ago shows straight away.
  const { data: myBookings = [], refetch: refetchBookings } = useGetMyBookingsQuery(undefined, {
    skip: !currentUser,
  });
  useFocusEffect(
    useCallback(() => {
      if (currentUser) {
        refetchBookings();
      }
    }, [currentUser, refetchBookings]),
  );
  const upcomingBookings = useMemo(
    () =>
      myBookings
        .filter((b) => isUpcomingBooking(b.status, b.endTime))
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
    [myBookings],
  );
  // Latest completed booking per service (the list is newest first) — the
  // same service at two businesses shows twice, a repeat at one shows once.
  const bookAgain = useMemo(() => {
    const seen = new Set<string>();
    const out: Booking[] = [];
    for (const b of myBookings) {
      if (b.status !== 'COMPLETED' || seen.has(`${b.provider.id}:${b.service.id}`)) {
        continue;
      }
      seen.add(`${b.provider.id}:${b.service.id}`);
      out.push(b);
      if (out.length >= BOOK_AGAIN_LIMIT) {
        break;
      }
    }
    return out;
  }, [myBookings]);
  // Nearby stores you can order products from.
  // SERVICES-ONLY: STORE providers not fetched for launch — restore by removing the `{ skip: true }` arg
  const { data: storesPage } = useGetProvidersQuery(
    { type: 'STORE', limit: 6, ...locationFilter },
    { skip: true },
  );

  // When nothing was close by and the search had to widen past 10 km, say how far.
  const openNowBanner = locationNote(openNowPage, customerLocation);
  const storesBanner = locationNote(storesPage, customerLocation);

  // Recently opened businesses (cached on-device); refresh each time Home focuses.
  const [recentlyViewed, setRecentlyViewed] = useState<RecentProvider[]>([]);
  useFocusEffect(
    useCallback(() => {
      let active = true;
      getRecentlyViewed().then((list) => {
        if (active) {
          setRecentlyViewed(list);
        }
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
  const serviceCategories = useMemo(
    () => categories.filter((c) => c.type !== 'STORE'),
    [categories],
  );
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

  const onServicePress = useCallback(
    (service: ServiceSearchResult) => {
      navigation.navigate(ROUTES.PROVIDER_DETAILS, {
        providerId: service.provider.id,
        name: service.provider.businessName,
      });
    },
    [navigation],
  );

  const onViewBooking = useCallback(
    (b: Booking) => navigation.navigate(ROUTES.BOOKING_DETAILS, { bookingId: b.id }),
    [navigation],
  );

  const onBookAgain = useCallback(
    (b: Booking) =>
      navigation.navigate(ROUTES.PROVIDER_DETAILS, {
        providerId: b.provider.id,
        name: b.provider.businessName,
      }),
    [navigation],
  );

  // Same Google Maps link the business page uses — coordinates when set, else the address.
  const onDirections = useCallback((b: Booking) => {
    const p = b.provider;
    const destination =
      p.latitude != null && p.longitude != null
        ? `${p.latitude},${p.longitude}`
        : encodeURIComponent([p.addressLine, p.city].filter(Boolean).join(', ') || p.businessName);
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${destination}`);
  }, []);

  const goToBookings = useCallback(() => navigation.navigate(ROUTES.BOOKINGS), [navigation]);

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
  const goToAllStores = useCallback(
    () => navigation.navigate(ROUTES.ALL_BUSINESSES, { type: 'STORE' }),
    [navigation],
  );
  // "Popular services" lists services, so View all opens the full services list.
  const goToAllServices = useCallback(() => navigation.navigate(ROUTES.ALL_SERVICES), [navigation]);
  const goToOpenNow = useCallback(
    () =>
      navigation.navigate(ROUTES.ALL_BUSINESSES, {
        type: 'SERVICE',
        openNow: true,
        title: 'Open now near you',
      }),
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
    popularServices,
    openNow: openNowPage?.items ?? [],
    openNowBanner,
    nextBooking: upcomingBookings[0] ?? null,
    upcomingCount: upcomingBookings.length,
    bookAgain,
    stores: storesPage?.items ?? [],
    storesBanner,
    recentlyViewed,
    onCategoryPress,
    onProductTypePress,
    onOfferPress,
    onProviderPress,
    onRecentPress,
    onServicePress,
    onViewBooking,
    onBookAgain,
    onDirections,
    goToBookings,
    goToOpenNow,
    goToProfile,
    goToSearch,
    goToCart,
    goToLocationPicker,
    goToAllServiceCategories,
    goToAllStoreCategories,
    goToAllProductTypes,
    goToAllStores,
    goToAllServices,
    cartCount,
    // Falls back to a static default until the customer sets a real location.
    location: customerLocation?.label ?? LOCATION,
    offers: platformCoupons.map(toOffer),
    heroBanners: HERO_BANNERS,
  };
}
