import React, { ReactNode, useState } from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Images,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  Share as ShareIcon,
  Star,
  TicketPercent,
} from 'lucide-react-native';

import { CategoryIcon } from '@/components/CategoryIcon';
import { IconTile, iconTileColor } from '@/components/IconTile';
import { Provider, Review } from '@/redux/api/provider/types';
import { LINK, ModernSize } from '@/utils/modernTheme';
import { formatHour, isOpenNow, nextOpening } from '@/utils/openNow';

import { HoursRow, OfferInfo, RatingShare } from './useBusinessExtras';
import { styles } from './styles';

/**
 * Building blocks shared by the redesigned business pages — the salon/service
 * page ("Aura Salon Booking App Interface.png") and the store page ("FreshMart
 * Kirana Grocery App UI.png") — so both look identical where they overlap.
 */

const HERO_H = 230;
const AMBER = '#F59E0B';
const INK_ICON = '#0F1E4A';

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          color={AMBER}
          fill={i <= Math.round(value) ? AMBER : 'transparent'}
        />
      ))}
    </View>
  );
}

// ── Top card: photo gallery + name / rating / chips / strip ────────────────
interface TopCardProps {
  provider: Provider;
  /** Grey line under the name, e.g. "Unisex Salon • Hair, Skin, Makeup". */
  subline?: string;
  /** Soft-blue strip at the bottom of the card (icon + text). */
  strip?: { icon: ReactNode; text: string } | null;
  onBack: () => void;
  onShare: () => void;
  onOpenImage: (index: number) => void;
}

export function TopCard({ provider, subline, strip, onBack, onShare, onOpenImage }: TopCardProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const heroW = width - ModernSize.gutter * 2;
  const [active, setActive] = useState(0);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setActive(Math.round(e.nativeEvent.contentOffset.x / heroW));

  const open = isOpenNow(provider.businessHours);
  const today = provider.businessHours.find((h) => h.dayOfWeek === new Date().getDay());
  const till = open && today ? ` • till ${formatHour(today.closeTime)}` : '';
  const opensAt = open === false ? nextOpening(provider.businessHours) : null;
  const dist =
    provider.distanceKm == null
      ? null
      : `${provider.distanceKm < 10 ? provider.distanceKm.toFixed(1) : Math.round(provider.distanceKm)} km`;
  const fallbackPhoto = provider.subcategory?.imageUrl || provider.category.imageUrl;

  return (
    <View style={[styles.topCard, { marginTop: insets.top + 8 }]}>
      <View style={[styles.hero, { height: HERO_H }]}>
        {provider.images.length > 0 ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onScroll}
          >
            {provider.images.map((url, i) => (
              <TouchableOpacity key={url} activeOpacity={0.95} onPress={() => onOpenImage(i)}>
                <Image
                  source={{ uri: url }}
                  style={{ width: heroW, height: HERO_H }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : fallbackPhoto ? (
          <Image source={{ uri: fallbackPhoto }} style={styles.fill} resizeMode="cover" />
        ) : (
          <IconTile
            icon={
              <CategoryIcon
                slug={provider.category.slug}
                size={64}
                color={iconTileColor(0)}
                strokeWidth={1.4}
              />
            }
          />
        )}

        <TouchableOpacity
          style={[styles.heroBtn, styles.heroBtnLeft]}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color={INK_ICON} strokeWidth={2.2} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.heroBtn, styles.heroBtnRight]}
          onPress={onShare}
          accessibilityRole="button"
          accessibilityLabel="Share"
        >
          <ShareIcon size={20} color={INK_ICON} strokeWidth={2} />
        </TouchableOpacity>

        {provider.images.length > 0 && (
          <View style={styles.counter}>
            <Images size={13} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.counterText}>
              {active + 1} / {provider.images.length}
            </Text>
          </View>
        )}
        {provider.images.length > 1 && (
          <View style={styles.dots}>
            {provider.images.map((url, i) => (
              <View key={url} style={[styles.dot, i === active && styles.dotActive]} />
            ))}
          </View>
        )}
      </View>

      <View style={styles.headerCard}>
        <View style={styles.nameRow}>
          <View style={styles.nameWrap}>
            <Text style={styles.name} numberOfLines={2}>
              {provider.businessName}
            </Text>
            {provider.isVerified && (
              <BadgeCheck size={22} color="#FFFFFF" fill="#2563EB" strokeWidth={2} />
            )}
          </View>
          <View style={styles.ratingPill}>
            <Star size={16} color={AMBER} fill={AMBER} />
            <Text style={styles.ratingPillText}>{provider.ratingAvg.toFixed(1)}</Text>
          </View>
        </View>
        {!!subline && (
          <Text style={styles.subline} numberOfLines={1}>
            {subline}
          </Text>
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.infoChips}
        >
          {open != null && (
            <View style={[styles.infoChip, open ? styles.infoChipOpen : styles.infoChipClosed]}>
              <View style={[styles.dotSmall, open ? styles.dotOpen : styles.dotClosed]} />
              <Text style={[styles.infoChipText, open ? styles.infoChipOpenText : null]}>
                {open ? `Open now${till}` : opensAt ? `Closed • ${opensAt}` : 'Closed'}
              </Text>
            </View>
          )}
          {!!dist && (
            <View style={styles.infoChip}>
              <MapPin size={14} color={INK_ICON} strokeWidth={2} />
              <Text style={styles.infoChipText}>{dist}</Text>
            </View>
          )}
          <View style={styles.infoChip}>
            <MessageSquare size={14} color={INK_ICON} strokeWidth={2} />
            <Text style={styles.infoChipText}>
              {provider.ratingCount.toLocaleString('en-IN')}{' '}
              {provider.ratingCount === 1 ? 'review' : 'reviews'}
            </Text>
          </View>
        </ScrollView>

        {!!strip && (
          <View style={styles.areaStrip}>
            {strip.icon}
            <Text style={styles.areaText}>{strip.text}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ── Call / Directions / Share ───────────────────────────────────────────────
export function QuickActions({
  onCall,
  onDirections,
  onShare,
}: {
  onCall: () => void;
  onDirections: () => void;
  onShare: () => void;
}) {
  const items = [
    { label: 'Call', Icon: Phone, onPress: onCall },
    { label: 'Directions', Icon: Navigation, onPress: onDirections },
    { label: 'Share', Icon: ShareIcon, onPress: onShare },
  ];
  return (
    <View style={styles.actions}>
      {items.map(({ label, Icon, onPress }) => (
        <TouchableOpacity
          key={label}
          style={styles.action}
          onPress={onPress}
          activeOpacity={0.85}
          accessibilityRole="button"
        >
          <Icon size={22} color={LINK} strokeWidth={1.9} />
          <Text style={styles.actionText}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Offer card ──────────────────────────────────────────────────────────────
export function OfferCard({ offer, onApply }: { offer: OfferInfo; onApply: () => void }) {
  return (
    <View style={styles.offer}>
      <TicketPercent size={34} color="#EA580C" strokeWidth={1.6} />
      <View style={styles.offerText}>
        <Text style={styles.offerTitle} numberOfLines={2}>
          {offer.title}
        </Text>
        <View style={styles.offerCode}>
          <Text style={styles.offerCodeText}>Use code {offer.code}</Text>
        </View>
      </View>
      {/* Dashes drawn as small views — RN's dashed border doesn't render on one side on iOS. */}
      <View style={styles.offerDivider}>
        {Array.from({ length: 9 }, (_, i) => (
          <View key={i} style={styles.offerDash} />
        ))}
      </View>
      <TouchableOpacity onPress={onApply} hitSlop={10} accessibilityRole="button">
        <Text style={styles.offerApply}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── About ───────────────────────────────────────────────────────────────────
export function AboutCard({ name, description }: { name: string; description: string }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>About {name}</Text>
      <Text style={styles.about} numberOfLines={open ? undefined : 3}>
        {description}
      </Text>
      {description.length > 140 && (
        <TouchableOpacity style={styles.readMore} onPress={() => setOpen((v) => !v)}>
          <Text style={styles.readMoreText}>{open ? 'Read less' : 'Read more'}</Text>
          {open ? <ChevronUp size={16} color={LINK} /> : <ChevronDown size={16} color={LINK} />}
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Location & hours ────────────────────────────────────────────────────────
interface LocationHoursProps {
  title: string;
  address: string;
  hoursRows: HoursRow[];
  onDirections: () => void;
  /** Optional green note under the address (e.g. store pickup info). */
  note?: { icon: ReactNode; text: string } | null;
}

export function LocationHoursCard({
  title,
  address,
  hoursRows,
  onDirections,
  note,
}: LocationHoursProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.locRow}>
        <View style={styles.locLeft}>
          <TouchableOpacity
            style={styles.mapTile}
            onPress={onDirections}
            activeOpacity={0.85}
            accessibilityLabel="Open in maps"
          >
            <View style={[styles.mapRoad, styles.mapRoadH]} />
            <View style={[styles.mapRoad, styles.mapRoadV]} />
            <View style={[styles.mapRoad, styles.mapRoadD]} />
            <MapPin size={30} color="#FFFFFF" fill={LINK} strokeWidth={1.6} />
          </TouchableOpacity>
          {!!address && (
            <View style={styles.addressRow}>
              <MapPin size={14} color={INK_ICON} strokeWidth={2} />
              <Text style={styles.address}>{address}</Text>
            </View>
          )}
          {!!note && (
            <View style={styles.noteBox}>
              {note.icon}
              <Text style={styles.noteText}>{note.text}</Text>
            </View>
          )}
        </View>
        <View style={styles.hoursCol}>
          {hoursRows.map((r) => (
            <View key={r.day} style={styles.hoursRow}>
              <Text style={[styles.hoursDay, r.isToday && styles.hoursToday]}>{r.day}</Text>
              <Text
                style={[
                  styles.hoursTime,
                  r.isToday && styles.hoursToday,
                  !r.hours && styles.hoursClosed,
                ]}
              >
                {r.hours ?? 'Closed'}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ── Reviews ─────────────────────────────────────────────────────────────────
function ago(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) {
    return 'Today';
  }
  if (days === 1) {
    return 'Yesterday';
  }
  if (days < 30) {
    return `${days} days ago`;
  }
  const months = Math.floor(days / 30);
  return months < 12
    ? `${months} month${months > 1 ? 's' : ''} ago`
    : `${Math.floor(months / 12)} yr ago`;
}

const AVATAR_TINTS = [
  { bg: '#EAF1FF', fg: '#1D4ED8' },
  { bg: '#FDECEC', fg: '#DC2626' },
  { bg: '#E7F6EE', fg: '#15803D' },
  { bg: '#F2ECFF', fg: '#6D28D9' },
];

function ReviewCard({
  review,
  index,
  businessName,
}: {
  review: Review;
  index: number;
  businessName: string;
}) {
  const tint = AVATAR_TINTS[index % AVATAR_TINTS.length];
  return (
    <View style={styles.reviewCard}>
      <View style={[styles.avatar, { backgroundColor: tint.bg }]}>
        <Text style={[styles.avatarText, { color: tint.fg }]}>
          {review.user.fullName.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.reviewBody}>
        <Text style={styles.reviewName}>{review.user.fullName}</Text>
        <Text style={styles.reviewAgo}>{ago(review.createdAt)}</Text>
        <Stars value={review.rating} size={13} />
        {!!review.comment && <Text style={styles.reviewText}>{review.comment}</Text>}
        {!!review.providerReply && (
          <View style={styles.reply}>
            <Text style={styles.replyTitle}>Reply from {businessName}</Text>
            <Text style={styles.replyText}>{review.providerReply}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

interface ReviewsSectionProps {
  provider: Provider;
  reviews: Review[];
  ratingBreakdown: RatingShare[];
  onViewAll: () => void;
  /** How many full review cards to show under the summary. */
  preview?: number;
}

export function ReviewsSection({
  provider,
  reviews,
  ratingBreakdown,
  onViewAll,
  preview = 2,
}: ReviewsSectionProps) {
  if (provider.ratingCount <= 0) {
    return null;
  }
  return (
    <>
      <View style={styles.card}>
        <View style={styles.reviewsHead}>
          <Text style={styles.cardTitle}>Reviews</Text>
          <TouchableOpacity onPress={onViewAll} hitSlop={8} accessibilityRole="link">
            <Text style={styles.viewAll}>
              View all ({provider.ratingCount.toLocaleString('en-IN')})
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.summary}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryAvg}>{provider.ratingAvg.toFixed(1)}</Text>
            <Stars value={provider.ratingAvg} size={18} />
            <Text style={styles.summaryCount}>
              {provider.ratingCount.toLocaleString('en-IN')} reviews
            </Text>
          </View>
          <View style={styles.bars}>
            {ratingBreakdown.map((b) => (
              <View key={b.star} style={styles.barRow}>
                <Text style={styles.barLabel}>{b.star} ★</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${b.pct}%` }]} />
                </View>
                <Text style={styles.barPct}>{b.pct}%</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      {reviews.slice(0, preview).map((r, i) => (
        <ReviewCard key={r.id} review={r} index={i} businessName={provider.businessName} />
      ))}
    </>
  );
}
