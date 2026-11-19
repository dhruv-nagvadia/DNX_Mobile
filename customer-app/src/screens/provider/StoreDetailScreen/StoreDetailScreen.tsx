import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronRight, Search, ShoppingBag, X } from 'lucide-react-native';

import { ProductTypeCard } from '@/components/BusinessCards';
import { StoreItemCard } from '@/components/StoreItemCard';
import { useAppSelector } from '@/redux/hooks';
import { useGetProviderReviewsQuery } from '@/redux/api/provider/providerApi';
import { Product, Provider } from '@/redux/api/provider/types';
import { ROUTES, RootStackParamList } from '@/navigation/routes';
import { INK, LINK, ModernSize, PAGE_BG } from '@/utils/modernTheme';
import { amountPrice, formatMoney } from '@/utils/units';

import {
  AboutCard,
  LocationHoursCard,
  OfferCard,
  QuickActions,
  ReviewsSection,
  TopCard,
} from '../ProviderDetailScreen/parts';
import { useBusinessExtras } from '../ProviderDetailScreen/useBusinessExtras';
import { styles as ds } from '../ProviderDetailScreen/styles';
import { styles } from './styles';

const UNTAGGED_NAME = 'Other items';
/** Named sections shown on the page; "View all types" opens the rest. */
const SECTION_PREVIEW_LIMIT = 3;
/** Products per section rail before "View all". */
const SECTION_RAIL_ITEMS = 8;

interface CategoryTile {
  slug: string | null; // null = products with no product type tagged
  name: string;
  iconUrl?: string | null;
}

interface SectionPreview {
  section: string;
  items: Product[];
  total: number;
  // At least one item in the FULL section (not just the teaser) has a coupon.
  hasCoupon: boolean;
  /** True when grouped by product type because the store set no sections. */
  byType: boolean;
  typeSlug?: string | null;
}

/**
 * Store detail — mockup "designs/customer/mobile/FreshMart Kirana Grocery App
 * UI.png". Shares the top card, quick actions, offer, about, location/hours and
 * reviews with the service page (ProviderDetailScreen/parts).
 */
export function StoreDetail({ provider }: { provider: Provider }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const cartItems = useAppSelector((s) => s.cart.items);
  const { data: reviews = [] } = useGetProviderReviewsQuery(provider.id);
  const { offer, ratingBreakdown, hoursRows, address, onDirections, onShare } =
    useBusinessExtras(provider, reviews, 'ORDER');
  const [query, setQuery] = useState('');

  const contentW = width - ModernSize.gutter * 2;
  const railW = Math.floor(contentW * 0.47);
  const typeW = Math.floor((contentW - 30) / 4) + 6;
  const gridW = Math.floor((contentW - 10) / 2);
  const products = useMemo(() => provider.products ?? [], [provider.products]);

  // Only the categories this store actually sells, in first-seen order.
  const categories = useMemo<CategoryTile[]>(() => {
    const seen = new Map<string, CategoryTile>();
    let hasUntagged = false;
    for (const p of products) {
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
  }, [products]);

  // The store's own named sections (or, if it set none, its product types) —
  // a rail of products each, "View all" opens the full section.
  const { sectionPreviews, hasMoreSections } = useMemo(() => {
    const named = new Map<string, Product[]>();
    for (const p of products) {
      const key = p.section?.trim();
      if (key) {
        named.set(key, [...(named.get(key) ?? []), p]);
      }
    }
    let previews: SectionPreview[];
    let total: number;
    if (named.size > 0) {
      total = named.size;
      previews = [...named.entries()].slice(0, SECTION_PREVIEW_LIMIT).map(([section, items]) => ({
        section,
        items: items.slice(0, SECTION_RAIL_ITEMS),
        total: items.length,
        hasCoupon: items.some((p) => !!p.coupon),
        byType: false,
      }));
    } else {
      const byType = new Map<string, { slug: string | null; items: Product[] }>();
      for (const p of products) {
        const key = p.productType?.name ?? UNTAGGED_NAME;
        const entry = byType.get(key) ?? { slug: p.productType?.slug ?? null, items: [] };
        entry.items.push(p);
        byType.set(key, entry);
      }
      total = byType.size;
      previews = [...byType.entries()].slice(0, SECTION_PREVIEW_LIMIT).map(([section, e]) => ({
        section,
        items: e.items.slice(0, SECTION_RAIL_ITEMS),
        total: e.items.length,
        hasCoupon: e.items.some((p) => !!p.coupon),
        byType: true,
        typeSlug: e.slug,
      }));
    }
    return { sectionPreviews: previews, hasMoreSections: total > SECTION_PREVIEW_LIMIT };
  }, [products]);

  // In-store search over the catalog that's already loaded.
  const q = query.trim().toLowerCase();
  const results = useMemo(
    () => (q ? products.filter((p) => p.name.toLowerCase().includes(q)) : []),
    [products, q],
  );

  // Cart bar: this store's lines when it has any, else the whole cart.
  const liveItems = cartItems.filter((i) => i.quantity > 0);
  const storeItems = liveItems.filter((i) => i.providerId === provider.id);
  const barItems = storeItems.length > 0 ? storeItems : liveItems;
  const barTotal = barItems.reduce(
    (s, i) => s + amountPrice(i.quantity, i.priceQty, i.priceMinor),
    0,
  );
  const barLabel = storeItems.length > 0 ? provider.businessName : 'Your cart';

  const openProduct = (productId: string) =>
    navigation.navigate(ROUTES.PRODUCT_DETAILS, { providerId: provider.id, productId });

  const openSection = (sp: SectionPreview) =>
    navigation.navigate(
      ROUTES.PROVIDER_PRODUCTS,
      sp.byType
        ? {
            providerId: provider.id,
            businessName: provider.businessName,
            productTypeSlug: sp.typeSlug ?? null,
            categoryName: sp.section,
          }
        : { providerId: provider.id, businessName: provider.businessName, section: sp.section },
    );

  // No section filter — opens the full catalog, grouped by every section.
  const openAllSections = () =>
    navigation.navigate(ROUTES.PROVIDER_PRODUCTS, {
      providerId: provider.id,
      businessName: provider.businessName,
    });

  const openCategory = (c: CategoryTile) =>
    navigation.navigate(ROUTES.PROVIDER_PRODUCTS, {
      providerId: provider.id,
      businessName: provider.businessName,
      productTypeSlug: c.slug,
      categoryName: c.name,
    });

  const onApplyOffer = () =>
    offer &&
    Alert.alert(
      `Code ${offer.code}`,
      'Add items to your cart — you can apply this code at checkout.',
    );

  const subline = [
    provider.subcategory?.name ?? provider.category.name,
    categories
      .filter((c) => c.slug)
      .slice(0, 3)
      .map((c) => c.name.split(/[,&]/)[0].trim())
      .join(', '),
  ]
    .filter(Boolean)
    .join(' • ');

  const renderCard = (p: Product, w: number) => (
    <StoreItemCard
      key={p.id}
      product={p}
      providerId={provider.id}
      providerName={provider.businessName}
      depositPercent={provider.depositPercent}
      width={w}
      onPress={() => openProduct(p.id)}
    />
  );

  return (
    <View style={ds.container}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
      <ScrollView
        contentContainerStyle={[ds.content, barItems.length > 0 && styles.contentWithBar]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TopCard
          provider={provider}
          subline={subline}
          strip={{
            icon: <ShoppingBag size={16} color={LINK} strokeWidth={2} />,
            text: 'Order online, pick up at the store',
          }}
          onBack={() => navigation.goBack()}
          onShare={onShare}
          onOpenImage={(i) =>
            navigation.navigate(ROUTES.GALLERY, { images: provider.images, index: i })
          }
        />

        <View style={ds.body}>
          {/* No Call here: the business's number is only shown after a booking/order. */}
          <QuickActions onDirections={onDirections} onShare={onShare} />
          {!!offer && <OfferCard offer={offer} onApply={onApplyOffer} />}

          {/* ── Search in store ─────────────────────────────────────────── */}
          {products.length > 0 && (
            <View style={styles.search}>
              <Search size={20} color={INK} strokeWidth={2} />
              <TextInput
                style={styles.searchInput}
                value={query}
                onChangeText={setQuery}
                placeholder={`Search in ${provider.businessName}`}
                placeholderTextColor="#64748B"
                returnKeyType="search"
                autoCorrect={false}
              />
              {!!query && (
                <TouchableOpacity
                  onPress={() => setQuery('')}
                  hitSlop={10}
                  accessibilityLabel="Clear search"
                >
                  <X size={18} color="#64748B" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {q ? (
            /* ── Search results ──────────────────────────────────────────── */
            <>
              <Text style={ds.sectionTitle}>
                {results.length} {results.length === 1 ? 'result' : 'results'} for “{query.trim()}”
              </Text>
              {results.length === 0 ? (
                <Text style={ds.muted}>No products match. Try another word.</Text>
              ) : (
                <View style={styles.grid}>{results.map((p) => renderCard(p, gridW))}</View>
              )}
            </>
          ) : products.length === 0 ? (
            <View style={styles.empty}>
              <ShoppingBag size={40} color="#94A3B8" strokeWidth={1.4} />
              <Text style={styles.emptyText}>This store hasn’t added any products yet.</Text>
            </View>
          ) : (
            <>
              {/* ── Shop by category ──────────────────────────────────────── */}
              <Text style={ds.sectionTitle}>Shop by category</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={ds.bleed}
                contentContainerStyle={styles.hRow}
              >
                {categories.map((c, i) => (
                  <ProductTypeCard
                    key={c.slug ?? UNTAGGED_NAME}
                    type={{
                      id: c.slug ?? UNTAGGED_NAME,
                      slug: c.slug ?? '',
                      name: c.name,
                      sortOrder: i,
                      iconUrl: c.iconUrl,
                    }}
                    width={typeW}
                    index={i}
                    onPress={() => openCategory(c)}
                  />
                ))}
              </ScrollView>

              {/* ── Product sections ──────────────────────────────────────── */}
              {sectionPreviews.map((sp) => (
                <View key={sp.section}>
                  <View style={styles.sectionHead}>
                    <View style={styles.sectionTitleGroup}>
                      <Text style={styles.sectionGroupTitle} numberOfLines={1}>
                        {sp.section}
                      </Text>
                      {sp.hasCoupon && (
                        <View style={styles.dealTag}>
                          <Text style={styles.dealTagText}>Deal</Text>
                        </View>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() => openSection(sp)}
                      hitSlop={8}
                      accessibilityRole="link"
                    >
                      <Text style={styles.sectionLink}>View all</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={ds.bleed}
                    contentContainerStyle={styles.hRow}
                  >
                    {sp.items.map((p) => renderCard(p, railW))}
                  </ScrollView>
                </View>
              ))}
              {hasMoreSections && (
                <TouchableOpacity
                  style={styles.viewAllTypesBtn}
                  activeOpacity={0.85}
                  onPress={openAllSections}
                >
                  <Text style={styles.viewAllTypesText}>View all products</Text>
                  <ChevronRight size={16} color={LINK} />
                </TouchableOpacity>
              )}
            </>
          )}

          {!!provider.description && (
            <AboutCard name={provider.businessName} description={provider.description} />
          )}
          <LocationHoursCard
            title="Location, Hours & Pickup"
            address={address}
            hoursRows={hoursRows}
            onDirections={onDirections}
            note={{
              icon: <ShoppingBag size={16} color="#15803D" strokeWidth={2} />,
              text: 'Pick up your order here',
            }}
          />
          <ReviewsSection
            provider={provider}
            reviews={reviews}
            ratingBreakdown={ratingBreakdown}
            preview={1}
            onViewAll={() =>
              navigation.navigate(ROUTES.REVIEWS, {
                providerId: provider.id,
                businessName: provider.businessName,
              })
            }
          />
        </View>
      </ScrollView>

      {/* ── Sticky cart bar ─────────────────────────────────────────────── */}
      {barItems.length > 0 && (
        <View style={[styles.cartBar, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartCount}>
              {barItems.length} item{barItems.length > 1 ? 's' : ''}
            </Text>
            <Text style={styles.cartTotal} numberOfLines={1}>
              {formatMoney(barTotal)} • {barLabel}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutBtn}
            activeOpacity={0.9}
            onPress={() => navigation.navigate(ROUTES.CART)}
            accessibilityRole="button"
          >
            <ShoppingBag size={20} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.checkoutText}>View cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
