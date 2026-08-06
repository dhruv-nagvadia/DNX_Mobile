import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  MapPin,
  ChevronDown,
  ShieldCheck,
  FileText,
  Car,
  Refrigerator,
  Bell,
  Star,
  type LucideIcon,
} from 'lucide-react-native';

import { CategoryIcon } from '@/components/CategoryIcon';
import { Color } from '@/utils/Theme';
import { Booking } from '@/redux/api/booking/types';

import { useHomeScreen } from './useHomeScreen';
import { ReminderKind } from './types';
import { styles } from './styles';

function formatBookingTime(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${date} · ${time}`;
}

const REMINDER_ICON: Record<ReminderKind, LucideIcon> = {
  insurance: ShieldCheck,
  passport: FileText,
  vehicle: Car,
  appliance: Refrigerator,
};

/** JSX only — logic comes from useHomeScreen. */
export default function HomeScreen() {
  const {
    firstName,
    greeting,
    location,
    offers,
    mostBooked,
    reminders,
    recentlyViewed,
    trustStats,
    categories,
    categoriesLoading,
    bookings,
    onCategoryPress,
    logout,
  } = useHomeScreen();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Color.background} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header: location + avatar */}
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.locationPill} activeOpacity={0.7}>
            <MapPin size={16} color={Color.primary} />
            <Text style={styles.locationLabel}>Location</Text>
            <Text style={styles.locationText}>{location}</Text>
            <ChevronDown size={16} color={Color.textSecondary} />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.bellBtn} activeOpacity={0.8} accessibilityLabel="Notifications">
              <Bell size={20} color={Color.textPrimary} />
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>2</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatar} onPress={logout} accessibilityLabel="Account">
              <Text style={styles.avatarText}>{firstName.charAt(0).toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.greetingLabel}>{greeting} 👋</Text>
        <Text style={styles.name}>{firstName}</Text>

        {/* Search */}
        <TouchableOpacity style={styles.search} activeOpacity={0.85}>
          <Search size={18} color={Color.placeholder} />
          <Text style={styles.searchText}>Search salons, doctors, plumbers…</Text>
        </TouchableOpacity>

        {/* Offers carousel */}
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

        {/* Your bookings — only when there are any */}
        {bookings.length > 0 && (
          <>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Your bookings</Text>
              <Text style={styles.sectionLink}>See all</Text>
            </View>
            {bookings.slice(0, 3).map((b: Booking) => (
              <View key={b.id} style={styles.bookingCard}>
                <View style={styles.bookingIcon}>
                  <CategoryIcon slug={b.provider.category.slug} size={22} />
                </View>
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingName} numberOfLines={1}>
                    {b.provider.businessName}
                  </Text>
                  <Text style={styles.bookingMeta} numberOfLines={1}>
                    {b.service.name} · {formatBookingTime(b.startTime)}
                  </Text>
                </View>
                <View style={styles.statusPill}>
                  <Text style={styles.statusText}>{b.status}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Categories */}
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

        {/* Most booked services */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Most booked services</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {mostBooked.map((s) => (
            <TouchableOpacity key={s} style={styles.chip} activeOpacity={0.8}>
              <Text style={styles.chipText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Reminders / renewals */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Don&apos;t forget</Text>
        </View>
        {reminders.map((r) => {
          const Icon = REMINDER_ICON[r.kind] ?? Bell;
          return (
            <View key={r.id} style={styles.reminderCard}>
              <View style={styles.reminderIcon}>
                <Icon size={22} color={Color.primary} />
              </View>
              <View style={styles.reminderInfo}>
                <Text style={styles.reminderTitle}>{r.title}</Text>
                <Text style={styles.reminderSub}>{r.subtitle}</Text>
              </View>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.reminderCta}>Renew</Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {/* Recently viewed */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Recently viewed</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hRow}>
          {recentlyViewed.map((p) => (
            <TouchableOpacity key={p.id} style={styles.recentCard} activeOpacity={0.85}>
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

        {/* Trust strip */}
        <View style={styles.trust}>
          {trustStats.map((t, i) => (
            <React.Fragment key={t.id}>
              {i > 0 && <View style={styles.trustDivider} />}
              <View style={styles.trustItem}>
                <Text style={styles.trustValue}>{t.value}</Text>
                <Text style={styles.trustLabel}>{t.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
