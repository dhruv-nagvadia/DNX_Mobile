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
  Camera,
  ChevronDown,
  ChevronUp,
  Images,
  MessageSquare,
  Pencil,
  Scissors,
  Star,
  Trash2,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import { GradientBackground } from '@/components/GradientBackground';
import { Business, BusinessHour, BusinessReview } from '@/redux/api/business/types';
import { Color } from '@/utils/Theme';
import { INK, LINK, ModernSize, TINT } from '@/utils/modernTheme';
import { formatHour, isOpenNow, nextOpening } from '@/utils/openNow';

import { AMBER, styles } from './styles';

type Tint = (typeof TINT)[keyof typeof TINT];

const HERO_H = 210;

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((n) => {
        const full = value >= n - 0.25;
        const half = !full && value >= n - 0.75;
        return (
          <View key={n}>
            <Star
              size={size}
              color={full || half ? AMBER : Color.border}
              fill={full ? AMBER : 'transparent'}
            />
            {half && (
              <View style={[styles.halfStar, { width: size / 2 }]}>
                <Star size={size} color={AMBER} fill={AMBER} />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

// ── Top card: photo carousel (with back / edit / delete) + identity ─────────
interface TopCardProps {
  business: Business;
  /** e.g. "Beauty & Wellness · Men's Salon / Barber". */
  subline: string;
  /** "12 services" / "8 products" chip. */
  itemsLabel: string;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPhotos: () => void;
  onReviews: () => void;
  onHours: () => void;
}

export function TopCard({
  business,
  subline,
  itemsLabel,
  onBack,
  onEdit,
  onDelete,
  onPhotos,
  onReviews,
  onHours,
}: TopCardProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const heroW = width - ModernSize.gutter * 2;
  const [active, setActive] = useState(0);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setActive(Math.round(e.nativeEvent.contentOffset.x / heroW));

  const open = isOpenNow(business.businessHours);
  const today = business.businessHours?.find((h) => h.dayOfWeek === new Date().getDay());
  const till = open && today ? ` • till ${formatHour(today.closeTime)}` : '';
  const opensAt = open === false ? nextOpening(business.businessHours) : null;
  const images = business.images ?? [];
  const reviews = business.ratingCount;

  return (
    <View style={[styles.topCard, { marginTop: insets.top + 8 }]}>
      <View style={[styles.hero, { height: HERO_H }]}>
        {images.length > 0 ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onScroll}
          >
            {images.map((url) => (
              <TouchableOpacity key={url} activeOpacity={0.95} onPress={onPhotos}>
                <Image source={{ uri: url }} style={{ width: heroW, height: HERO_H }} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <TouchableOpacity
            style={styles.heroEmpty}
            onPress={onPhotos}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Add a cover photo"
          >
            <Camera size={38} color={LINK} strokeWidth={1.6} />
            <Text style={styles.heroEmptyText}>Add a cover photo</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.heroBtn, styles.heroBtnLeft]}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color={INK} strokeWidth={2.2} />
        </TouchableOpacity>
        <View style={styles.heroBtnRow}>
          <TouchableOpacity
            style={styles.heroBtn}
            onPress={onEdit}
            accessibilityRole="button"
            accessibilityLabel="Edit business"
          >
            <Pencil size={19} color={INK} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.heroBtn}
            onPress={onDelete}
            accessibilityRole="button"
            accessibilityLabel="Delete business"
          >
            <Trash2 size={19} color={Color.error} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {images.length > 0 && (
          <View style={styles.counter}>
            <Images size={13} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.counterText}>
              {active + 1} / {images.length}
            </Text>
          </View>
        )}
        {images.length > 1 && (
          <View style={styles.dots}>
            {images.map((url, i) => (
              <View key={url} style={[styles.dot, i === active && styles.dotActive]} />
            ))}
          </View>
        )}
      </View>

      <View style={styles.headerCard}>
        <View style={styles.nameRow}>
          <View style={styles.nameWrap}>
            <Text style={styles.name} numberOfLines={2}>
              {business.businessName}
            </Text>
            {business.isVerified && (
              <BadgeCheck size={22} color="#FFFFFF" fill="#2563EB" strokeWidth={2} />
            )}
          </View>
          {reviews > 0 && (
            <View style={styles.ratingPill}>
              <Star size={16} color={AMBER} fill={AMBER} />
              <Text style={styles.ratingPillText}>{business.ratingAvg.toFixed(1)}</Text>
            </View>
          )}
        </View>
        {!!subline && (
          <Text style={styles.subline} numberOfLines={1}>
            {subline}
          </Text>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.infoChips}>
          {open != null ? (
            <View style={[styles.infoChip, open ? styles.infoChipOpen : styles.infoChipClosed]}>
              <View style={[styles.dotSmall, open ? styles.dotOpen : styles.dotClosed]} />
              <Text style={[styles.infoChipText, open ? styles.infoChipOpenText : null]}>
                {open ? `Open now${till}` : opensAt ? `Closed • ${opensAt}` : 'Closed'}
              </Text>
            </View>
          ) : (
            <TouchableOpacity style={[styles.infoChip, styles.infoChipClosed]} onPress={onHours} activeOpacity={0.8}>
              <View style={[styles.dotSmall, styles.dotClosed]} />
              <Text style={styles.infoChipText}>Set opening hours</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.infoChip} onPress={onReviews} activeOpacity={0.8}>
            <MessageSquare size={14} color={INK} strokeWidth={2} />
            <Text style={styles.infoChipText}>
              {reviews.toLocaleString('en-IN')} {reviews === 1 ? 'review' : 'reviews'}
            </Text>
          </TouchableOpacity>
          <View style={styles.infoChip}>
            <Scissors size={14} color={INK} strokeWidth={2} />
            <Text style={styles.infoChipText}>{itemsLabel}</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

// ── Manage grid ─────────────────────────────────────────────────────────────
export function ManageTile({
  icon: Icon,
  label,
  tint,
  width,
  onPress,
}: {
  icon: LucideIcon;
  label: string;
  tint: Tint;
  width: number;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.manageTile, { width, borderColor: tint.border }]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <GradientBackground colors={tint.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <View style={styles.manageIcon}>
        <Icon size={22} color={tint.icon} strokeWidth={2} />
      </View>
      <Text style={styles.manageLabel} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ── Section card: title on the left, optional action on the right ───────────
export function SectionCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {title}
        </Text>
        {action}
      </View>
      {children}
    </View>
  );
}

export function LinkButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon?: ReactNode;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.linkBtn}
      onPress={onPress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="link"
    >
      {icon}
      <Text style={styles.linkText} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ── About ───────────────────────────────────────────────────────────────────
export function AboutText({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  // Character count alone misses a description that's just many short lines.
  const isLong = text.length > 140 || text.split('\n').length - 1 >= 3;
  return (
    <>
      <Text style={styles.about} numberOfLines={isLong && !open ? 3 : undefined}>
        {text}
      </Text>
      {isLong && (
        <TouchableOpacity style={styles.readMore} onPress={() => setOpen((v) => !v)}>
          <Text style={styles.linkText}>{open ? 'Read less' : 'Read more'}</Text>
          {open ? <ChevronUp size={16} color={LINK} /> : <ChevronDown size={16} color={LINK} />}
        </TouchableOpacity>
      )}
    </>
  );
}

// ── Opening hours (Mon → Sun, today highlighted) ────────────────────────────
const WEEK: { dow: number; label: string }[] = [
  { dow: 1, label: 'Monday' },
  { dow: 2, label: 'Tuesday' },
  { dow: 3, label: 'Wednesday' },
  { dow: 4, label: 'Thursday' },
  { dow: 5, label: 'Friday' },
  { dow: 6, label: 'Saturday' },
  { dow: 0, label: 'Sunday' },
];

export function HoursList({ hours }: { hours: BusinessHour[] }) {
  const todayDow = new Date().getDay();
  return (
    <View>
      {WEEK.map(({ dow, label }, i) => {
        const h = hours.find((x) => x.dayOfWeek === dow);
        const isToday = dow === todayDow;
        const text = h?.isOpen ? `${formatHour(h.openTime)} – ${formatHour(h.closeTime)}` : 'Closed';
        return (
          <View key={dow} style={[styles.hoursRow, i > 0 && styles.hoursRowDivider]}>
            <Text style={[styles.hoursDay, isToday && styles.hoursToday]}>{label}</Text>
            <Text style={[styles.hoursTime, isToday && styles.hoursToday, !h?.isOpen && styles.hoursClosed]}>
              {text}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// ── Contact row ─────────────────────────────────────────────────────────────
export function ContactRow({
  icon,
  label,
  value,
  last,
}: {
  icon: ReactNode;
  label: string;
  value?: string | null;
  last?: boolean;
}) {
  return (
    <View style={styles.contactRow}>
      <View style={styles.contactIcon}>{icon}</View>
      <View style={[styles.contactMain, !last && styles.contactDivider]}>
        <Text style={styles.contactLabel}>{label}</Text>
        <Text style={[styles.contactValue, !value && styles.muted]}>{value || 'Not added'}</Text>
      </View>
    </View>
  );
}

// ── Reviews ─────────────────────────────────────────────────────────────────
/** "Today", "Yesterday", "5 days ago", "3 months ago", "2 yr ago". */
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
  return months < 12 ? `${months} month${months > 1 ? 's' : ''} ago` : `${Math.floor(months / 12)} yr ago`;
}

const AVATAR_TINTS = [
  { bg: '#EAF1FF', fg: '#1D4ED8' },
  { bg: '#FDECEC', fg: '#DC2626' },
  { bg: '#E7F6EE', fg: '#15803D' },
  { bg: '#F2ECFF', fg: '#6D28D9' },
];

export function ReviewCard({ review, index }: { review: BusinessReview; index: number }) {
  const tint = AVATAR_TINTS[index % AVATAR_TINTS.length];
  return (
    <View style={styles.reviewCard}>
      <View style={[styles.avatar, { backgroundColor: tint.bg }]}>
        <Text style={[styles.avatarText, { color: tint.fg }]}>
          {(review.user.fullName.trim()[0] ?? '?').toUpperCase()}
        </Text>
      </View>
      <View style={styles.reviewBody}>
        <Text style={styles.reviewName} numberOfLines={1}>
          {review.user.fullName}
        </Text>
        <Text style={styles.reviewAgo}>{ago(review.createdAt)}</Text>
        <Stars value={review.rating} size={13} />
        {!!review.comment && <Text style={styles.reviewText}>{review.comment}</Text>}
        {!!review.providerReply && (
          <View style={styles.reply}>
            <Text style={styles.replyTitle}>Your reply</Text>
            <Text style={styles.replyText}>{review.providerReply}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
