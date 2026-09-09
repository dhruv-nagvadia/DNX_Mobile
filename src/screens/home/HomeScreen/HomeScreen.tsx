import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, ChevronDown, Star, Users, ShoppingBag } from 'lucide-react-native';

import { CategoryIcon } from '@/components/CategoryIcon';
import { NotificationBellButton } from '@/components/NotificationBellButton';
import { Color } from '@/utils/Theme';

import { useHomeScreen } from './useHomeScreen';
import { styles } from './styles';

/** JSX only — logic comes from useHomeScreen. */
export default function HomeScreen() {
  const {
    firstName,
    greeting,
    location,
    offers,
    mostBooked,
    stores,
    recentlyViewed,
    trustStats,
    categories,
    categoriesLoading,
    onCategoryPress,
    onProviderPress,
    onRecentPress,
    goToProfile,
    goToSearch,
    goToCart,
    goToLocationPicker,
    cartCount,
  } = useHomeScreen();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Color.background} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header: location + notifications + avatar */}
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.locationPill}
            activeOpacity={0.7}
            onPress={goToLocationPicker}
          >
            <MapPin size={16} color={Color.primary} />
            <Text style={styles.locationLabel}>Location</Text>
            <Text style={styles.locationText}>{location}</Text>
            <ChevronDown size={16} color={Color.textSecondary} />
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.bellBtn}
              activeOpacity={0.8}
              onPress={goToCart}
              accessibilityLabel="Cart"
            >
              <ShoppingBag size={20} color={Color.textPrimary} />
              {cartCount > 0 && (
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <NotificationBellButton style={styles.bellBtn} />
            <TouchableOpacity style={styles.avatar} onPress={goToProfile} accessibilityLabel="Profile">
              <Text style={styles.avatarText}>{firstName.charAt(0).toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.greetingLabel}>{greeting} 👋</Text>
        <Text style={styles.name}>{firstName}</Text>

        {/* Search */}
        <TouchableOpacity style={styles.search} activeOpacity={0.85} onPress={goToSearch}>
          <Search size={18} color={Color.placeholder} />
          <Text style={styles.searchText}>Search stores, salons, doctors…</Text>
        </TouchableOpacity>

        {/* Trust banner (top) */}
        <View style={styles.trustBanner}>
          <View style={styles.trustBannerBody}>
            <Text style={styles.trustBannerTitle}>Trusted by thousands across India</Text>
            <View style={styles.trustStatsRow}>
              {trustStats.map((t) => (
                <View key={t.id} style={styles.trustStat}>
                  <Text style={styles.trustStatValue}>{t.value}</Text>
                  <Text style={styles.trustStatLabel}>{t.label}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.trustBannerIcon}>
            <Users size={26} color={Color.white} />
          </View>
        </View>

        {/* Offers */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Offers for you</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hRow}>
          {offers.map((o) => (
            <View key={o.id} style={[styles.offerCard, { backgroundColor: o.bg }]}>
              <Text style={styles.offerTitle}>{o.title}</Text>
              <Text style={styles.offerSub}>{o.subtitle}</Text>
              <View style={styles.offerTag}>
                <Text style={styles.offerTagText}>{o.tag}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Categories (most-booked first) */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>What do you need?</Text>
        </View>
        {categoriesLoading ? (
          <ActivityIndicator color={Color.primary} />
        ) : (
          <View style={styles.grid}>
            {categories.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={styles.catCard}
                activeOpacity={0.8}
                onPress={() => onCategoryPress(c)}
              >
                <View style={styles.catTile}>
                  <CategoryIcon slug={c.slug} size={26} />
                </View>
                <Text style={styles.catName} numberOfLines={2}>
                  {c.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Stores you can order from */}
        {stores.length > 0 && (
          <>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Order from stores</Text>
              <View style={styles.sectionTag}>
                <ShoppingBag size={12} color={Color.primaryDark} />
                <Text style={styles.sectionTagText}>Shop groceries & more</Text>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hRow}
            >
              {stores.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={styles.storeCard}
                  activeOpacity={0.85}
                  onPress={() => onProviderPress(s)}
                >
                  <View style={styles.storeThumb}>
                    {s.images.length > 0 ? (
                      <Image style={styles.storeThumbImg} source={{ uri: s.images[0] }} />
                    ) : (
                      <CategoryIcon slug={s.category.slug} size={26} />
                    )}
                  </View>
                  <Text style={styles.storeName} numberOfLines={1}>
                    {s.businessName}
                  </Text>
                  <Text style={styles.storeMeta} numberOfLines={1}>
                    {s.subcategory?.name ?? s.category.name}
                  </Text>
                  <View style={styles.storeFooter}>
                    <View style={styles.storeRating}>
                      <Star size={12} color={Color.warning} fill={Color.warning} />
                      <Text style={styles.storeRatingText}>{s.ratingAvg.toFixed(1)}</Text>
                    </View>
                    <View style={styles.shopChip}>
                      <Text style={styles.shopChipText}>Shop</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* Most booked businesses */}
        {mostBooked.length > 0 && (
          <>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Popular services to book</Text>
            </View>
            {mostBooked.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={styles.mbCard}
                activeOpacity={0.85}
                onPress={() => onProviderPress(p)}
              >
                <View style={styles.mbAvatar}>
                  {p.images.length > 0 ? (
                    <Image style={styles.mbAvatarImg} source={{ uri: p.images[0] }} />
                  ) : (
                    <CategoryIcon slug={p.category.slug} size={24} />
                  )}
                </View>
                <View style={styles.mbInfo}>
                  <Text style={styles.mbName} numberOfLines={1}>
                    {p.businessName}
                  </Text>
                  <Text style={styles.mbMeta} numberOfLines={1}>
                    {p.subcategory?.name ?? p.category.name}
                    {p.city ? ` · ${p.city}` : ''}
                  </Text>
                  <View style={styles.mbRating}>
                    <Star size={12} color={Color.warning} fill={Color.warning} />
                    <Text style={styles.mbRatingText}>
                      {p.ratingAvg.toFixed(1)} ({p.ratingCount})
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Recently viewed */}
        {recentlyViewed.length > 0 && (
          <>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Recently viewed</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hRow}
            >
              {recentlyViewed.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={styles.recentCard}
                  activeOpacity={0.85}
                  onPress={() => onRecentPress(p)}
                >
                  <View style={styles.recentIcon}>
                    <CategoryIcon slug={p.categorySlug} size={20} />
                  </View>
                  <Text style={styles.recentName} numberOfLines={1}>
                    {p.name}
                  </Text>
                  <Text style={styles.recentType} numberOfLines={1}>
                    {p.type}
                  </Text>
                  <View style={styles.recentRating}>
                    <Star size={12} color={Color.warning} fill={Color.warning} />
                    <Text style={styles.recentRatingText}>{p.rating.toFixed(1)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
