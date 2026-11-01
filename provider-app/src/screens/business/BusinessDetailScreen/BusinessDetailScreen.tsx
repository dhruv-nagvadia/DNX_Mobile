import React, { useState } from 'react';
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
  BadgeCheck,
  Briefcase,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  Image as ImageIcon,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Pencil,
  ShieldAlert,
  Star,
  Ticket,
  Trash2,
  Warehouse,
  Wrench,
} from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { EarningsPanel } from '@/components/EarningsPanel';
import { TopSellersPanel } from '@/components/TopSellersPanel';
import { Color } from '@/utils/Theme';

import { useBusinessDetailScreen } from './useBusinessDetailScreen';
import { styles } from './styles';

function Section({
  label,
  action,
  children,
}: {
  label: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionGroup}>
      <View style={styles.sectionLabelRow}>
        <Text style={styles.sectionLabel}>{label}</Text>
        {action}
      </View>
      {children}
    </View>
  );
}

function initialsOf(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || '?'
  );
}

const ABOUT_COLLAPSE_THRESHOLD = 180;
const ABOUT_COLLAPSED_LINES = 4;

function AboutText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  // Character count alone misses a description that's just many short lines
  // (lots of "\n"s but few total characters) — count line breaks too.
  const lineBreaks = text.split('\n').length - 1;
  const isLong = text.length > ABOUT_COLLAPSE_THRESHOLD || lineBreaks >= ABOUT_COLLAPSED_LINES;

  return (
    <>
      <Text style={styles.aboutText} numberOfLines={isLong && !expanded ? ABOUT_COLLAPSED_LINES : undefined}>
        {text}
      </Text>
      {isLong && (
        <TouchableOpacity onPress={() => setExpanded((v) => !v)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
          <Text style={styles.aboutToggle}>{expanded ? 'Show less' : 'Show more'}</Text>
        </TouchableOpacity>
      )}
    </>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <View style={styles.reviewStars}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={11}
          color={Color.warning}
          fill={n <= Math.round(rating) ? Color.warning : 'transparent'}
        />
      ))}
    </View>
  );
}

function MenuTile({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.menuTile} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuTileIcon}>{icon}</View>
      <Text style={styles.menuTileText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function BusinessDetailScreen() {
  const {
    business,
    isStore,
    isLoading,
    refreshing,
    refresh,
    recentReviews,
    goToHours,
    goToCalendar,
    goToBookingsOrders,
    goToPhotos,
    goToEdit,
    goToServices,
    goToProducts,
    goToStock,
    goToCoupons,
    goToReviews,
    confirmDelete,
    goBack,
  } = useBusinessDetailScreen();

  return (
    <View style={styles.root}>
      <AppHeader
        title={business?.businessName ?? 'Business'}
        onBack={goBack}
        right={
          business && (
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerBtn}
                onPress={goToEdit}
                accessibilityRole="button"
                accessibilityLabel="Edit business"
              >
                <Pencil size={16} color={Color.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerBtn}
                onPress={confirmDelete}
                accessibilityRole="button"
                accessibilityLabel="Delete business"
              >
                <Trash2 size={16} color={Color.white} />
              </TouchableOpacity>
            </View>
          )
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
      >
        {business?.isBlocked && (
          <View style={styles.banner}>
            <ShieldAlert size={18} color={Color.error} />
            <Text style={styles.bannerText}>
              This business is blocked and hidden from customers.
              {business.blockedReason ? ` Reason: ${business.blockedReason}` : ''}
            </Text>
          </View>
        )}

        {business && (
          <View style={styles.hero}>
            <View style={styles.heroTop}>
              {business.images?.[0] ? (
                <Image source={{ uri: business.images[0] }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatar}>
                  <Briefcase size={26} color={Color.primary} />
                </View>
              )}
              <View style={styles.heroMain}>
                <View style={styles.heroNameRow}>
                  <Text style={styles.heroName} numberOfLines={1}>
                    {business.businessName}
                  </Text>
                  {business.isVerified && <BadgeCheck size={16} color={Color.success} />}
                </View>
                <Text style={styles.heroCategory} numberOfLines={1}>
                  {business.category.name}
                  {business.subcategory ? ` · ${business.subcategory.name}` : ''}
                </Text>
                {business.ratingCount > 0 ? (
                  <View style={styles.ratingRow}>
                    <Star size={13} color={Color.warning} fill={Color.warning} />
                    <Text style={styles.ratingText}>
                      {business.ratingAvg.toFixed(1)} ({business.ratingCount})
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.heroNoRating}>No reviews yet</Text>
                )}
              </View>
            </View>
          </View>
        )}

        <Section label="Manage">
          <View style={styles.menuGrid}>
            {isStore ? (
              <>
                <MenuTile icon={<Package size={20} color={Color.primary} />} label="Products" onPress={goToProducts} />
                <MenuTile icon={<Warehouse size={20} color={Color.primary} />} label="Stock" onPress={goToStock} />
              </>
            ) : (
              <MenuTile icon={<Wrench size={20} color={Color.primary} />} label="Services" onPress={goToServices} />
            )}
            <MenuTile
              icon={<CalendarDays size={20} color={Color.primary} />}
              label={isStore ? 'Orders' : 'Bookings'}
              onPress={goToBookingsOrders}
            />
            <MenuTile icon={<Ticket size={20} color={Color.primary} />} label="Coupons" onPress={goToCoupons} />
            <MenuTile icon={<ImageIcon size={20} color={Color.primary} />} label="Photos" onPress={goToPhotos} />
            <MenuTile icon={<CalendarClock size={20} color={Color.primary} />} label="Hours" onPress={goToHours} />
            <MenuTile icon={<CalendarRange size={20} color={Color.primary} />} label="Calendar" onPress={goToCalendar} />
          </View>
        </Section>

        {business && (
          <Section label="Earnings">
            <EarningsPanel businessId={business.id} isStore={isStore} />
          </Section>
        )}

        {business && (
          <Section label={isStore ? 'Top products' : 'Top services'}>
            <TopSellersPanel businessId={business.id} isStore={isStore} />
          </Section>
        )}

        {business && (
          <Section label="About">
            <View style={styles.sectionCard}>
              {business.description ? (
                <AboutText text={business.description} />
              ) : (
                <Text style={styles.contactTextMuted}>
                  No description yet. A short paragraph about {isStore ? 'your store' : 'what you do'} helps
                  customers choose you.
                </Text>
              )}
            </View>
          </Section>
        )}

        {business && (
          <Section label="Contact & location">
            <View style={styles.sectionCard}>
              <View style={styles.contactRow}>
                <View style={styles.contactIcon}>
                  <Phone size={14} color={Color.primary} />
                </View>
                <Text style={styles.contactText}>{business.phone || 'Not added'}</Text>
              </View>
              <View style={styles.contactRow}>
                <View style={styles.contactIcon}>
                  <Mail size={14} color={Color.primary} />
                </View>
                <Text style={[styles.contactText, !business.email && styles.contactTextMuted]}>
                  {business.email || 'Not added'}
                </Text>
              </View>
              <View style={styles.contactRow}>
                <View style={styles.contactIcon}>
                  <MapPin size={14} color={Color.primary} />
                </View>
                {business.addressLine ? (
                  <Text style={styles.contactText} numberOfLines={2}>
                    {business.addressLine}
                    {business.city ? `, ${business.city}` : ''}
                    {business.state ? `, ${business.state}` : ''}
                    {business.postalCode ? ` ${business.postalCode}` : ''}
                  </Text>
                ) : (
                  <Text style={[styles.contactText, styles.contactTextMuted]}>Not added</Text>
                )}
              </View>
            </View>
          </Section>
        )}

        {business && (
          <Section
            label="Reviews"
            action={
              business.ratingCount > 0 ? (
                <TouchableOpacity onPress={goToReviews} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.sectionAction}>See all</Text>
                </TouchableOpacity>
              ) : undefined
            }
          >
            <View style={styles.sectionCard}>
              {business.ratingCount > 0 ? (
                <TouchableOpacity style={styles.reviewSummaryRow} onPress={goToReviews} activeOpacity={0.7}>
                  <Text style={styles.reviewSummaryValue}>{business.ratingAvg.toFixed(1)}</Text>
                  <View style={styles.reviewSummaryMeta}>
                    <Stars rating={business.ratingAvg} />
                    <Text style={styles.reviewSummaryCount}>
                      {business.ratingCount} review{business.ratingCount === 1 ? '' : 's'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={styles.reviewEmptyRow}>
                  <MessageSquare size={18} color={Color.placeholder} />
                  <Text style={styles.heroNoRating}>No reviews yet</Text>
                </View>
              )}

              {recentReviews.map((r, i) => (
                <View key={r.id} style={[styles.reviewRow, i === 0 && styles.reviewRowFirst]}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>{initialsOf(r.user.fullName)}</Text>
                  </View>
                  <View style={styles.reviewMain}>
                    <View style={styles.reviewAuthorRow}>
                      <Text style={styles.reviewAuthor} numberOfLines={1}>
                        {r.user.fullName}
                      </Text>
                      <Stars rating={r.rating} />
                    </View>
                    {!!r.comment && (
                      <Text style={styles.reviewComment} numberOfLines={2}>
                        {r.comment}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </Section>
        )}
      </ScrollView>
    </View>
  );
}
