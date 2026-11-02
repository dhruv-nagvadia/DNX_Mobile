import React, { useState } from 'react';
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
  Ban,
  BadgeCheck,
  Briefcase,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Image as ImageIcon,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Pencil,
  Phone,
  Scissors,
  ShoppingBag,
  Star,
  Tag,
  Trash2,
  Warehouse,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { EarningsPanel } from '@/components/EarningsPanel';
import { GradientBackground } from '@/components/GradientBackground';
import { TopSellersPanel } from '@/components/TopSellersPanel';
import { Color } from '@/utils/Theme';
import { INK, LINK, TINT } from '@/utils/modernTheme';

import { useBusinessDetailScreen } from './useBusinessDetailScreen';
import { AVATAR_COLORS, STAR_COLOR, styles } from './styles';

type Tint = (typeof TINT)[keyof typeof TINT];

const ABOUT_COLLAPSE_THRESHOLD = 140;
const ABOUT_COLLAPSED_LINES = 3;

function initialsOf(name: string): string {
  return name.trim()[0]?.toUpperCase() ?? '?';
}

/** "just now", "5 min ago", "3 hours ago", "2 days ago", "3 weeks ago", or a date. */
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) {
    return 'just now';
  }
  if (min < 60) {
    return `${min} min ago`;
  }
  const hours = Math.floor(min / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  }
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Five stars with half-star support (4.5 → four full + one half). */
function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((n) => {
        const full = rating >= n - 0.25;
        const half = !full && rating >= n - 0.75;
        return (
          <View key={n}>
            <Star size={size} color={full || half ? STAR_COLOR : Color.border} fill={full ? STAR_COLOR : Color.border} />
            {half && (
              <View style={[styles.halfStar, { width: size / 2 }]}>
                <Star size={size} color={STAR_COLOR} fill={STAR_COLOR} />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action}
    </View>
  );
}

function LinkButton({ label, icon, onPress }: { label: string; icon?: React.ReactNode; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.linkBtn} onPress={onPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
      {icon}
      <Text style={styles.linkText}>{label}</Text>
    </TouchableOpacity>
  );
}

function AboutText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  // Character count alone misses a description that's just many short lines.
  const lineBreaks = text.split('\n').length - 1;
  const isLong = text.length > ABOUT_COLLAPSE_THRESHOLD || lineBreaks >= ABOUT_COLLAPSED_LINES;

  return (
    <>
      <Text style={styles.aboutText} numberOfLines={isLong && !expanded ? ABOUT_COLLAPSED_LINES : undefined}>
        {text}
      </Text>
      {isLong && (
        <TouchableOpacity
          style={styles.showMoreBtn}
          onPress={() => setExpanded((v) => !v)}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Text style={styles.linkText}>{expanded ? 'Show less' : 'Show more'}</Text>
          {expanded ? <ChevronUp size={16} color={LINK} /> : <ChevronDown size={16} color={LINK} />}
        </TouchableOpacity>
      )}
    </>
  );
}

function ManageTile({
  icon: Icon,
  label,
  tint,
  onPress,
}: {
  icon: LucideIcon;
  label: string;
  tint: Tint;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.tile, { borderColor: tint.border }]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
    >
      <GradientBackground colors={tint.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <Icon size={28} color={tint.icon} strokeWidth={2} />
      <Text style={styles.tileText}>{label}</Text>
    </TouchableOpacity>
  );
}

function ContactRow({
  icon,
  label,
  value,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  last?: boolean;
}) {
  return (
    <View style={styles.contactRow}>
      <View style={styles.contactIcon}>{icon}</View>
      <View style={[styles.contactMain, !last && styles.contactDivider]}>
        <Text style={styles.contactLabel}>{label}</Text>
        <Text style={[styles.contactValue, !value && styles.mutedText]}>{value || 'Not added'}</Text>
      </View>
    </View>
  );
}

/**
 * Business Detail — matches the first screen of "Salon Business Management
 * App UI Collage.png": light header with edit/delete, cover photo, name +
 * verified tick + category pill + rating, blocked banner, pastel Manage
 * grid, Earnings, Top Services, About, Contact & Location and Reviews —
 * each section sitting on the page background, separated by dividers.
 */
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

  const address = business
    ? [
        business.addressLine,
        [business.city, business.postalCode].filter(Boolean).join(' – '),
        business.state,
      ]
        .filter(Boolean)
        .join(', ')
    : '';

  return (
    <View style={styles.root}>
      <AppHeader
        variant="light"
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
                <Pencil size={20} color={INK} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerBtn}
                onPress={confirmDelete}
                accessibilityRole="button"
                accessibilityLabel="Delete business"
              >
                <Trash2 size={20} color={Color.error} />
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
        {business && (
          <>
            {/* Cover + identity */}
            {business.images?.[0] ? (
              <TouchableOpacity activeOpacity={0.9} onPress={goToPhotos}>
                <Image source={{ uri: business.images[0] }} style={styles.cover} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.cover, styles.coverEmpty]} onPress={goToPhotos} activeOpacity={0.8}>
                <Briefcase size={36} color={Color.placeholder} strokeWidth={1.5} />
                <Text style={styles.coverEmptyText}>Add a cover photo</Text>
              </TouchableOpacity>
            )}

            <View style={styles.identity}>
              <View style={styles.nameRow}>
                <Text style={styles.name} numberOfLines={2}>
                  {business.businessName}
                </Text>
                {business.isVerified && <BadgeCheck size={24} color={Color.white} fill="#2563EB" />}
              </View>
              <View style={styles.categoryPill}>
                <Tag size={13} color="#4F5D8A" />
                <Text style={styles.categoryText} numberOfLines={1}>
                  {business.category.name}
                  {business.subcategory ? ` · ${business.subcategory.name}` : ''}
                </Text>
              </View>
              {business.ratingCount > 0 ? (
                <TouchableOpacity style={styles.ratingRow} onPress={goToReviews} activeOpacity={0.7}>
                  <Star size={20} color={STAR_COLOR} fill={STAR_COLOR} />
                  <Text style={styles.ratingValue}>{business.ratingAvg.toFixed(1)}</Text>
                  <Text style={styles.ratingCount}>
                    ({business.ratingCount} review{business.ratingCount === 1 ? '' : 's'})
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.mutedText}>No reviews yet</Text>
              )}
            </View>

            {business.isBlocked && (
              <View style={styles.banner}>
                <Ban size={24} color={Color.error} />
                <View style={styles.bannerMain}>
                  <Text style={styles.bannerTitle}>Business Blocked</Text>
                  <Text style={styles.bannerText}>
                    {business.blockedReason ? `Reason: ${business.blockedReason}. ` : ''}
                    Customers cannot see this business or make {isStore ? 'orders' : 'bookings'}.
                  </Text>
                </View>
              </View>
            )}
          </>
        )}

        {/* Manage */}
        <View style={styles.section}>
          <SectionHeader title="Manage" />
          <View style={styles.grid}>
            {isStore ? (
              <>
                <ManageTile icon={Package} label="Products" tint={TINT.blue} onPress={goToProducts} />
                <ManageTile icon={Warehouse} label="Stock" tint={TINT.mint} onPress={goToStock} />
                <ManageTile icon={ShoppingBag} label="Orders" tint={TINT.lavender} onPress={goToBookingsOrders} />
              </>
            ) : (
              <>
                <ManageTile icon={Scissors} label="Services" tint={TINT.blue} onPress={goToServices} />
                <ManageTile icon={Calendar} label="Bookings" tint={TINT.lavender} onPress={goToBookingsOrders} />
              </>
            )}
            <ManageTile icon={Tag} label="Coupons" tint={TINT.peach} onPress={goToCoupons} />
            <ManageTile icon={ImageIcon} label="Photos" tint={TINT.mint} onPress={goToPhotos} />
            <ManageTile icon={Clock} label="Hours" tint={TINT.lavender} onPress={goToHours} />
            <ManageTile icon={Calendar} label="Calendar" tint={TINT.blue} onPress={goToCalendar} />
          </View>
        </View>

        {business && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <SectionHeader title="Earnings" />
              <EarningsPanel businessId={business.id} isStore={isStore} />
            </View>

            <View style={styles.divider} />
            <View style={styles.section}>
              <SectionHeader
                title={isStore ? 'Top Products' : 'Top Services'}
                action={<LinkButton label="See All" onPress={isStore ? goToProducts : goToServices} />}
              />
              <TopSellersPanel businessId={business.id} isStore={isStore} />
            </View>

            <View style={styles.divider} />
            <View style={styles.section}>
              <SectionHeader
                title="About"
                action={<LinkButton label="Edit" icon={<Pencil size={15} color={LINK} />} onPress={goToEdit} />}
              />
              {business.description ? (
                <AboutText text={business.description} />
              ) : (
                <Text style={styles.mutedText}>
                  No description yet. A short paragraph about {isStore ? 'your store' : 'what you do'} helps customers
                  choose you.
                </Text>
              )}
            </View>

            <View style={styles.divider} />
            <View style={styles.section}>
              <SectionHeader
                title="Contact & Location"
                action={<LinkButton label="Edit" icon={<Pencil size={15} color={LINK} />} onPress={goToEdit} />}
              />
              <ContactRow icon={<Phone size={22} color={INK} />} label="Phone" value={business.phone} />
              <ContactRow icon={<Mail size={22} color={INK} />} label="Email" value={business.email} />
              <ContactRow icon={<MapPin size={22} color={INK} />} label="Address" value={address} last />
            </View>

            <View style={styles.divider} />
            <View style={styles.section}>
              <SectionHeader
                title="Reviews"
                action={
                  business.ratingCount > 0 ? <LinkButton label="See All" onPress={goToReviews} /> : undefined
                }
              />
              {business.ratingCount > 0 ? (
                <TouchableOpacity style={styles.reviewSummary} onPress={goToReviews} activeOpacity={0.7}>
                  <Text style={styles.reviewSummaryValue}>{business.ratingAvg.toFixed(1)}</Text>
                  <Stars rating={business.ratingAvg} size={20} />
                  <Text style={styles.reviewSummaryCount}>
                    ({business.ratingCount} review{business.ratingCount === 1 ? '' : 's'})
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.reviewEmpty}>
                  <MessageSquare size={18} color={Color.placeholder} />
                  <Text style={styles.mutedText}>No reviews yet</Text>
                </View>
              )}

              {recentReviews.map((r, i) => {
                const avatar = AVATAR_COLORS[i % AVATAR_COLORS.length];
                return (
                  <View key={r.id} style={[styles.reviewRow, i > 0 && styles.reviewRowDivider]}>
                    <View style={[styles.reviewAvatar, { backgroundColor: avatar.bg }]}>
                      <Text style={[styles.reviewAvatarText, { color: avatar.fg }]}>{initialsOf(r.user.fullName)}</Text>
                    </View>
                    <View style={styles.reviewMain}>
                      <Text style={styles.reviewAuthor} numberOfLines={1}>
                        {r.user.fullName}
                      </Text>
                      <View style={styles.reviewMetaRow}>
                        <Stars rating={r.rating} size={15} />
                        <Text style={styles.reviewTime}>• {timeAgo(r.createdAt)}</Text>
                      </View>
                      {!!r.comment && (
                        <Text style={styles.reviewComment} numberOfLines={3}>
                          {r.comment}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
