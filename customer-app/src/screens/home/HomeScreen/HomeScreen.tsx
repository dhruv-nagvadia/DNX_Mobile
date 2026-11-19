import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronDown,
  Flower2,
  LayoutGrid,
  MapPin,
  Search,
  // ShoppingCart, // SERVICES-ONLY: unused while products/stores hidden — uncomment to restore
  TicketPercent,
} from 'lucide-react-native';

import {
  // ProductTypeCard, // SERVICES-ONLY: unused while products/stores hidden — uncomment to restore
  StoreCard,
  // StoreCategoryCard, // SERVICES-ONLY: unused while products/stores hidden — uncomment to restore
  // useCardWidth, // SERVICES-ONLY: unused while products/stores hidden — uncomment to restore
} from '@/components/BusinessCards';
import { CategoryIcon } from '@/components/CategoryIcon';
import { GradientBackground } from '@/components/GradientBackground';
import { NotificationBellButton } from '@/components/NotificationBellButton';
import { INK, LINK, ModernSize, PAGE_BG, TINT } from '@/utils/modernTheme';
import { TILE_CYCLE } from '@/utils/homeTiles';

import { BookAgainCard, PopularServiceRow, UpcomingBookingCard } from './HomeSections';
import { useHomeScreen } from './useHomeScreen';
import { GAP, styles } from './styles';

const GUTTER = ModernSize.gutter;
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

const OFFER_ICONS = [TicketPercent, Flower2];

function SectionHead({ title, onViewAll }: { title: string; onViewAll?: () => void }) {
  return (
    <View style={styles.sectionHead}>
      <Text style={styles.sectionTitle} numberOfLines={1}>
        {title}
      </Text>
      {!!onViewAll && (
        <TouchableOpacity onPress={onViewAll} hitSlop={HIT} accessibilityRole="link">
          <Text style={styles.sectionLink}>View all</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/**
 * Dashed rule drawn from short segments — RN's borderStyle 'dashed' doesn't
 * render on a single side on iOS, so the coupon divider used to disappear.
 */
function DashedLine({ color }: { color: string }) {
  return (
    <View style={styles.dashRow}>
      {Array.from({ length: 40 }, (_, i) => (
        <View key={i} style={[styles.dash, { backgroundColor: color }]} />
      ))}
    </View>
  );
}

/** Business photo for a recently-viewed chip; category icon if it has none or it fails. */
function RecentThumb({ uri, categorySlug }: { uri?: string | null; categorySlug: string }) {
  const [failed, setFailed] = useState(false);
  if (uri && !failed) {
    return (
      <Image
        source={{ uri }}
        style={styles.recentThumb}
        resizeMode="cover"
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <View style={[styles.recentThumb, styles.recentThumbIcon]}>
      <CategoryIcon slug={categorySlug} size={22} color={TINT.blue.icon} strokeWidth={1.8} />
    </View>
  );
}

/** JSX only — logic comes from useHomeScreen. */
export default function HomeScreen() {
  const {
    firstName,
    location,
    offers,
    popularServices,
    openNow,
    openNowBanner,
    nextBooking,
    upcomingCount,
    bookAgain,
    // stores, // SERVICES-ONLY: unused while products/stores hidden — uncomment to restore
    // storesBanner, // SERVICES-ONLY: unused while products/stores hidden — uncomment to restore
    recentlyViewed,
    heroBanners,
    serviceCategories,
    // storeCategories, // SERVICES-ONLY: unused while products/stores hidden — uncomment to restore
    // productTypes, // SERVICES-ONLY: unused while products/stores hidden — uncomment to restore
    hasMoreServiceCategories,
    // hasMoreStoreCategories, // SERVICES-ONLY: unused while products/stores hidden — uncomment to restore
    // hasMoreProductTypes, // SERVICES-ONLY: unused while products/stores hidden — uncomment to restore
    categoriesLoading,
    onCategoryPress,
    // onProductTypePress, // SERVICES-ONLY: unused while products/stores hidden — uncomment to restore
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
    // goToCart, // SERVICES-ONLY: unused while products/stores hidden — uncomment to restore
    goToLocationPicker,
    goToAllServiceCategories,
    // goToAllStoreCategories, // SERVICES-ONLY: unused while products/stores hidden — uncomment to restore
    // goToAllProductTypes, // SERVICES-ONLY: unused while products/stores hidden — uncomment to restore
    // goToAllStores, // SERVICES-ONLY: unused while products/stores hidden — uncomment to restore
    goToAllServices,
    // cartCount, // SERVICES-ONLY: unused while products/stores hidden — uncomment to restore
  } = useHomeScreen();

  // Every rail is sized from the screen width so the mockup's 2 / 3 / 4-up
  // layouts fill the row exactly on any phone.
  const { width } = useWindowDimensions();
  const contentW = width - GUTTER * 2;
  const quarterW = Math.floor((contentW - GAP * 3) / 4);
  // Business cards use the same width as their "View all" grid (two per
  // screen width), so the card is identical in both places.
  // const cardW = useCardWidth(); // SERVICES-ONLY: unused while products/stores hidden — uncomment to restore
  // "Shop by product" matches its View all grid exactly (3 per screen width).
  // const productW = Math.floor((contentW - GAP * 2) / 3); // SERVICES-ONLY: unused while products/stores hidden — uncomment to restore
  // "Order from stores" keeps its own wider card (~2 per screen).
  // const storeW = Math.floor(contentW * 0.48); // SERVICES-ONLY: unused while products/stores hidden — uncomment to restore
  const recentW = Math.floor(contentW * 0.5);
  // "Book again" — about 2.4 cards per screen so the next one peeks in.
  const againW = Math.floor(contentW * 0.4);
  // "Open now near you" — same card as stores, a bit under two per screen.
  const nearW = Math.floor(contentW * 0.6);
  const halfW = Math.floor((contentW - GAP) / 2);
  const heroW = contentW;

  const [heroIndex, setHeroIndex] = useState(0);
  const onHeroScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setHeroIndex(Math.round(e.nativeEvent.contentOffset.x / heroW));

  // With more categories than fit, the 8th tile becomes "More" (like the mockup).
  const serviceTiles = hasMoreServiceCategories ? serviceCategories.slice(0, 7) : serviceCategories;
  // const productTiles = productTypes; // SERVICES-ONLY: unused while products/stores hidden — uncomment to restore
  // const businessTiles = storeCategories; // SERVICES-ONLY: unused while products/stores hidden — uncomment to restore

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ── Header: location · bell/avatar ─────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.locationBtn}
            activeOpacity={0.7}
            onPress={goToLocationPicker}
            accessibilityRole="button"
            accessibilityLabel={`Deliver to ${location}. Change location`}
          >
            <MapPin size={22} color={LINK} strokeWidth={2} />
            <View style={styles.locationText}>
              <Text style={styles.locationLabel}>Deliver to</Text>
              <View style={styles.locationValueRow}>
                <Text style={styles.locationValue} numberOfLines={1}>
                  {location}
                </Text>
                <ChevronDown size={14} color={INK} strokeWidth={2.6} />
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.headerRight}>
            {/* SERVICES-ONLY: products/stores hidden for launch — uncomment to restore */}
            {/*
            {cartCount > 0 && (
              <TouchableOpacity
                style={styles.iconBtn}
                activeOpacity={0.8}
                onPress={goToCart}
                hitSlop={HIT}
                accessibilityLabel={`Cart, ${cartCount} items`}
              >
                <ShoppingCart size={22} color={INK} strokeWidth={1.9} />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              </TouchableOpacity>
            )}
            */}
            <NotificationBellButton color={INK} style={styles.iconBtn} />
            <TouchableOpacity
              style={styles.avatar}
              onPress={goToProfile}
              accessibilityRole="button"
              accessibilityLabel="Profile"
            >
              <Text style={styles.avatarText}>{firstName.charAt(0).toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Greeting ─────────────────────────────────────────────────── */}
        <Text style={styles.greeting}>Hi {firstName}</Text>
        <Text style={styles.greetingSub}>What would you like to book today?</Text>

        {/* ── Search ───────────────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.search}
          activeOpacity={0.85}
          onPress={goToSearch}
          accessibilityRole="search"
        >
          <Search size={20} color={INK} strokeWidth={2} />
          {/* SERVICES-ONLY: was "Search services, stores or products" — restore for products/stores */}
          <Text style={styles.searchText}>Search services</Text>
        </TouchableOpacity>

        {/* ── Your next booking ─────────────────────────────────────────── */}
        {!!nextBooking && (
          <>
            <SectionHead
              title="Your next booking"
              onViewAll={upcomingCount > 1 ? goToBookings : undefined}
            />
            <UpcomingBookingCard
              booking={nextBooking}
              onView={onViewBooking}
              onDirections={onDirections}
            />
          </>
        )}

        {/* Hero carousel — value-prop banners (unchanged from the original design) */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onHeroScroll}
          style={styles.heroScroll}
        >
          {heroBanners.map((b) => (
            <View key={b.id} style={[styles.heroCard, { width: heroW }]}>
              <Image source={b.image} style={styles.heroImage} resizeMode="cover" />
              <View
                style={b.textPosition === 'bottom' ? styles.heroTextBottom : styles.heroTextLeft}
              >
                <Text
                  style={[
                    styles.heroHeadline,
                    b.textPosition === 'bottom' && styles.heroHeadlineDark,
                  ]}
                >
                  {b.headline}
                </Text>
                <Text
                  style={[
                    styles.heroSubtitle,
                    b.textPosition === 'bottom' ? styles.heroSubtitleDark : styles.heroSubtitleBold,
                  ]}
                >
                  {b.subtitle}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
        {heroBanners.length > 1 && (
          <View style={styles.heroDots}>
            {heroBanners.map((b, i) => (
              <View key={b.id} style={[styles.heroDot, i === heroIndex && styles.heroDotActive]} />
            ))}
          </View>
        )}

        {/* ── Offers (two cards per screen width) ──────────────────────── */}
        {offers.length > 0 && (
          <>
            <SectionHead title="Offers for you" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hRow}
              style={styles.bleed}
              snapToInterval={halfW + GAP}
              decelerationRate="fast"
            >
              {offers.map((o, i) => {
                const tint = TINT[o.tint];
                const Icon = OFFER_ICONS[i % OFFER_ICONS.length];
                return (
                  <TouchableOpacity
                    key={o.id}
                    activeOpacity={0.85}
                    style={[styles.offerCard, { width: halfW, borderColor: tint.border }]}
                    onPress={() => onOfferPress(o)}
                  >
                    <GradientBackground colors={tint.colors} />
                    <Icon size={30} color={tint.icon} strokeWidth={1.7} />
                    <View style={styles.offerText}>
                      <Text
                        style={styles.offerTitle}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.8}
                      >
                        {o.title}
                      </Text>
                      <Text style={styles.offerSub} numberOfLines={1}>
                        {o.subtitle}
                      </Text>
                      <DashedLine color={tint.icon} />
                      <View style={[styles.offerCode, { borderColor: tint.border }]}>
                        <Text style={styles.offerCodeText} numberOfLines={1}>
                          Code: {o.tag}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </>
        )}

        {/* ── Service categories (4 × 2 pastel grid) ───────────────────── */}
        <SectionHead
          title="What service do you need?"
          onViewAll={hasMoreServiceCategories ? goToAllServiceCategories : undefined}
        />
        {categoriesLoading ? (
          <ActivityIndicator color={LINK} />
        ) : (
          <View style={styles.grid}>
            {serviceTiles.map((c, i) => {
              const tint = TILE_CYCLE[i % TILE_CYCLE.length];
              return (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.catTile, { width: quarterW, borderColor: tint.border }]}
                  activeOpacity={0.8}
                  onPress={() => onCategoryPress(c)}
                >
                  <GradientBackground colors={tint.colors} />
                  <CategoryIcon slug={c.slug} size={26} color={tint.icon} strokeWidth={1.7} />
                  {/* Full size text; long names wrap to a second line instead of shrinking. */}
                  <Text style={styles.catName} numberOfLines={2}>
                    {c.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
            {hasMoreServiceCategories && (
              <TouchableOpacity
                style={[styles.catTile, { width: quarterW, borderColor: TINT.blue.border }]}
                activeOpacity={0.8}
                onPress={goToAllServiceCategories}
                accessibilityLabel="More categories"
              >
                <GradientBackground colors={TINT.blue.colors} />
                <LayoutGrid size={26} color={TINT.blue.icon} strokeWidth={1.7} />
                <Text style={styles.catName}>More</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* ── Shop by product (photo cards, label underneath) ──────────── */}
        {/* SERVICES-ONLY: products/stores hidden for launch — uncomment to restore */}
        {/*
        {productTiles.length > 0 && (
          <>
            <SectionHead
              title="Shop by product"
              onViewAll={hasMoreProductTypes ? goToAllProductTypes : undefined}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hRow}
              style={styles.bleed}
              snapToInterval={productW + GAP}
              decelerationRate="fast"
            >
              {productTiles.map((t, i) => (
                <ProductTypeCard
                  key={t.id}
                  type={t}
                  width={productW}
                  index={i}
                  onPress={onProductTypePress}
                />
              ))}
            </ScrollView>
          </>
        )}
        */}

        {/* ── Shop by business (photo cards, label on the photo) ───────── */}
        {/* SERVICES-ONLY: products/stores hidden for launch — uncomment to restore */}
        {/*
        {!categoriesLoading && businessTiles.length > 0 && (
          <>
            <SectionHead
              title="Shop by business"
              onViewAll={hasMoreStoreCategories ? goToAllStoreCategories : undefined}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hRow}
              style={styles.bleed}
              snapToInterval={cardW + GAP}
              decelerationRate="fast"
            >
              {businessTiles.map((c, i) => (
                <StoreCategoryCard
                  key={c.id}
                  category={c}
                  width={cardW}
                  index={i}
                  onPress={onCategoryPress}
                />
              ))}
            </ScrollView>
          </>
        )}
        */}

        {/* ── Order from stores ────────────────────────────────────────── */}
        {/* SERVICES-ONLY: products/stores hidden for launch — uncomment to restore */}
        {/*
        {stores.length > 0 && (
          <>
            <SectionHead title="Order from stores" onViewAll={goToAllStores} />
            {!!storesBanner && <Text style={styles.scopeText}>{storesBanner}</Text>}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hRow}
              style={styles.bleed}
              snapToInterval={storeW + GAP}
              decelerationRate="fast"
            >
              {stores.map((s, i) => (
                <StoreCard
                  key={s.id}
                  store={s}
                  width={storeW}
                  index={i}
                  onPress={onProviderPress}
                />
              ))}
            </ScrollView>
          </>
        )}
        */}

        {/* ── Book again — services the customer has completed before ── */}
        {bookAgain.length > 0 && (
          <>
            <SectionHead title="Book again" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hRow}
              style={styles.bleed}
              snapToInterval={againW + GAP}
              decelerationRate="fast"
            >
              {bookAgain.map((b, i) => (
                <BookAgainCard
                  key={`${b.provider.id}:${b.service.id}`}
                  booking={b}
                  width={againW}
                  index={i}
                  onPress={onBookAgain}
                />
              ))}
            </ScrollView>
          </>
        )}

        {/* ── Open now near you ────────────────────────────────────────── */}
        {openNow.length > 0 && (
          <>
            <SectionHead title="Open now near you" onViewAll={goToOpenNow} />
            {!!openNowBanner && <Text style={styles.scopeText}>{openNowBanner}</Text>}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hRow}
              style={styles.bleed}
              snapToInterval={nearW + GAP}
              decelerationRate="fast"
            >
              {openNow.map((p, i) => (
                <StoreCard key={p.id} store={p} width={nearW} index={i} onPress={onProviderPress} />
              ))}
            </ScrollView>
          </>
        )}

        {/* ── Popular services to book — the service leads, not the business ── */}
        {popularServices.length > 0 && (
          <>
            <SectionHead title="Popular services to book" onViewAll={goToAllServices} />
            <View style={styles.list}>
              {popularServices.map((svc, i) => (
                <PopularServiceRow key={svc.id} service={svc} index={i} onPress={onServicePress} />
              ))}
            </View>
          </>
        )}

        {/* ── Recently viewed ──────────────────────────────────────────── */}
        {recentlyViewed.length > 0 && (
          <>
            <SectionHead title="Recently viewed" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hRow}
              style={styles.bleed}
            >
              {recentlyViewed.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={[styles.recentChip, { width: recentW }]}
                  activeOpacity={0.85}
                  onPress={() => onRecentPress(r)}
                >
                  {/* Only the business's own photo here — never a stock placeholder.
                      Without one, a neutral category icon stands in. */}
                  <RecentThumb uri={r.image} categorySlug={r.categorySlug} />
                  <Text style={styles.recentName} numberOfLines={2}>
                    {r.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
