import React, { useRef } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Box,
  ChartColumn,
  ChevronRight,
  Clock,
  Coins,
  CreditCard,
  FileText,
  Layers,
  Minus,
  Package,
  PackageX,
  Pencil,
  Plus,
  ShoppingBag,
  Star,
  StarHalf,
  Tag,
  Trash2,
} from 'lucide-react-native';

import { EmptyState } from '@/components/EmptyState';
import { GradientBackground } from '@/components/GradientBackground';
import { Pill } from '@/components/Pill';
import { Measure, ProductReview, StockAdjustment } from '@/redux/api/business/types';
import { Color, Spacing } from '@/utils/Theme';
import { INK, PAGE_BG, PILL, PillColors, TINT } from '@/utils/modernTheme';
import { formatMoney } from '@/utils/money';
import { formatAmount, priceLabel } from '@/utils/units';

import { REASON_OPTIONS } from '../StockScreen/types';
import { ProductStock } from '../ProductsScreen/useProductsScreen';
import { RECENT_CHANGES, REVIEWS_PREVIEW, SalesStats, useProductDetailScreen } from './useProductDetailScreen';
import { BRAND_BLUE, STAR, STAR_EMPTY, SWITCH_OFF, styles } from './styles';

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const AVATAR_COLORS: PillColors[] = [PILL.blue, PILL.lavender];

// ── Formatting helpers ──────────────────────────────────────────────────────

function shortDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

/** "just now", "5 minutes ago", "2 hours ago", "3 days ago", else "Oct 30". */
function timeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) {
    return '';
  }
  const mins = Math.floor((Date.now() - t) / 60000);
  if (mins < 1) {
    return 'just now';
  }
  const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? '' : 's'} ago`;
  if (mins < 60) {
    return plural(mins, 'minute');
  }
  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    return plural(hours, 'hour');
  }
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return plural(days, 'day');
  }
  return shortDate(iso);
}

function soldByLabel(measure: Measure): string {
  if (measure === 'weight') {
    return 'weight (g)';
  }
  if (measure === 'volume') {
    return 'volume (ml)';
  }
  return 'piece';
}

function stockPill(state: ProductStock): { label: string; colors: PillColors } {
  switch (state) {
    case 'unlimited':
      return { label: 'Made to order', colors: PILL.grey };
    case 'out':
      return { label: 'Out of stock', colors: PILL.red };
    case 'low':
      return { label: 'Low stock', colors: PILL.orange };
    default:
      return { label: 'In stock', colors: PILL.green };
  }
}

// ── Small pieces ────────────────────────────────────────────────────────────

function Stars({ rating, size }: { rating: number; size: number }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((i) => {
        const full = rating >= i - 0.25;
        const half = !full && rating >= i - 0.75;
        return (
          <View key={i}>
            <Star size={size} color={full ? STAR : STAR_EMPTY} fill={full ? STAR : STAR_EMPTY} />
            {half && (
              <View style={styles.starHalf}>
                <StarHalf size={size} color={STAR} fill={STAR} />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

function CardTitle({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <View style={styles.cardTitleRow}>
      <Text style={styles.cardTitle}>{title}</Text>
      {right}
    </View>
  );
}

function LinkButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.link} onPress={onPress} hitSlop={HIT_SLOP} accessibilityRole="button">
      <Text style={styles.linkText}>{label}</Text>
      <ChevronRight size={18} color={BRAND_BLUE} strokeWidth={2.4} />
    </TouchableOpacity>
  );
}

function StatTile({
  label,
  value,
  theme,
  icon,
}: {
  label: string;
  value: string;
  theme: (typeof TINT)[keyof typeof TINT];
  icon: React.ReactNode;
}) {
  return (
    <View style={[styles.tile, { borderColor: theme.border }]}>
      <GradientBackground colors={theme.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      {icon}
      <View style={styles.tileText}>
        <Text style={styles.tileLabel} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.tileValue} numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </Text>
      </View>
    </View>
  );
}

function ChangeRow({ item, measure, first }: { item: StockAdjustment; measure: Measure; first: boolean }) {
  const up = item.delta >= 0;
  const reason = REASON_OPTIONS.find((r) => r.value === item.reason)?.label;
  const meta = [reason, shortDate(item.createdAt)].filter(Boolean).join('  •  ');
  return (
    <View style={[styles.changeRow, !first && styles.rowDivider]}>
      <View style={[styles.changeIcon, up ? styles.changeIconUp : styles.changeIconDown]}>
        {up ? (
          <ArrowUp size={18} color={PILL.green.fg} strokeWidth={2.4} />
        ) : (
          <ArrowDown size={18} color={Color.error} strokeWidth={2.4} />
        )}
      </View>
      <Text style={[styles.changeDelta, up ? styles.deltaUp : styles.deltaDown]} numberOfLines={1}>
        {up ? '+' : '−'}
        {formatAmount(Math.abs(item.delta), measure)}
      </Text>
      <Text style={styles.changeMeta} numberOfLines={1}>
        {meta}
      </Text>
      {item.stockAfter != null && (
        <View style={styles.changeAfter}>
          <ArrowRight size={16} color={INK} />
          <Text style={styles.changeAfterText}>{formatAmount(item.stockAfter, measure)}</Text>
        </View>
      )}
    </View>
  );
}

function ReviewRow({ review, index }: { review: ProductReview; index: number }) {
  const name = review.user?.fullName?.trim() || 'Customer';
  const colors = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <View style={[styles.reviewRow, index > 0 && styles.rowDivider]}>
      <View style={[styles.avatar, { backgroundColor: colors.bg }]}>
        <Text style={[styles.avatarText, { color: colors.fg }]}>{name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.reviewBody}>
        <View style={styles.reviewHead}>
          <Text style={styles.reviewName} numberOfLines={1}>
            {name}
          </Text>
          <Stars rating={review.rating} size={14} />
          <Text style={styles.reviewWhen}>•  {timeAgo(review.createdAt)}</Text>
        </View>
        {!!review.comment?.trim() && <Text style={styles.reviewComment}>{review.comment.trim()}</Text>}
      </View>
    </View>
  );
}

function DetailRow({ icon, label, value, first }: { icon: React.ReactNode; label: string; value: string; first: boolean }) {
  return (
    <View style={[styles.detailRow, !first && styles.rowDivider]}>
      <View style={styles.detailIcon}>{icon}</View>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function SalesCard({ sales, measure, currency }: { sales: SalesStats; measure: Measure; currency: string }) {
  return (
    <View style={styles.card}>
      <CardTitle title="Sales" right={<Text style={styles.cardHint}>All time</Text>} />
      <View style={styles.tiles}>
        <StatTile
          label="Orders"
          value={`${sales.orders}`}
          theme={TINT.blue}
          icon={<ShoppingBag size={26} color={TINT.blue.icon} strokeWidth={1.8} />}
        />
        <StatTile
          label="Sold"
          value={formatAmount(sales.sold, measure)}
          theme={TINT.lavender}
          icon={<Coins size={26} color={TINT.lavender.icon} strokeWidth={1.8} />}
        />
        <StatTile
          label="Revenue"
          value={formatMoney(sales.revenueMinor, currency)}
          theme={TINT.mint}
          icon={<ChartColumn size={26} color={TINT.mint.icon} strokeWidth={1.8} />}
        />
      </View>
      <View style={styles.lastOrdered}>
        <Clock size={18} color={Color.textSecondary} />
        <Text style={styles.lastOrderedText}>
          {sales.lastOrderedAt ? `Last ordered ${timeAgo(sales.lastOrderedAt)}` : 'Not ordered yet'}
        </Text>
      </View>
    </View>
  );
}

// ── Screen ──────────────────────────────────────────────────────────────────

export default function ProductDetailScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const historyY = useRef(0);
  const reviewsY = useRef(0);
  const {
    product,
    businessName,
    isLoading,
    refreshing,
    refresh,
    history,
    reviews,
    showAllReviews,
    toggleReviews,
    sales,
    stockState,
    madeToOrder,
    lowThreshold,
    barScale,
    deleting,
    toggleActive,
    confirmDelete,
    goBack,
    editProduct,
    goToStock,
  } = useProductDetailScreen();

  const scrollTo = (y: number) => scrollRef.current?.scrollTo({ y: Math.max(0, y - Spacing.sm), animated: true });

  const header = (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={goBack}
        hitSlop={HIT_SLOP}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <ArrowLeft size={26} color={INK} strokeWidth={2.2} />
      </TouchableOpacity>
      <Text style={styles.title} numberOfLines={1}>
        Product Details
      </Text>
      {product && (
        <View style={styles.headerBtns}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={editProduct}
            accessibilityRole="button"
            accessibilityLabel="Edit product"
          >
            <Pencil size={22} color={BRAND_BLUE} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={confirmDelete}
            disabled={deleting}
            accessibilityRole="button"
            accessibilityLabel="Delete product"
          >
            <Trash2 size={22} color={PILL.red.fg} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (!product) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
        {header}
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator color={BRAND_BLUE} />
          </View>
        ) : (
          <EmptyState
            icon={<PackageX size={48} color={Color.placeholder} strokeWidth={1.4} />}
            title="Product not found"
            body="It may have been deleted or moved."
            action={
              <TouchableOpacity style={styles.notFoundBtn} onPress={goBack} accessibilityRole="button">
                <Text style={styles.notFoundBtnText}>Back to products</Text>
              </TouchableOpacity>
            }
          />
        )}
      </View>
    );
  }

  const p = product;
  const active = p.isActive !== false;
  const ratingCount = p.ratingCount ?? 0;
  const ratingAvg = p.ratingAvg ?? 0;
  const pill = stockPill(stockState);
  const recent = history.slice(0, RECENT_CHANGES);
  const shownReviews = showAllReviews ? reviews : reviews.slice(0, REVIEWS_PREVIEW);
  const subtitle = [p.section?.trim(), businessName].filter(Boolean).join('  •  ');
  const fill = barScale > 0 ? Math.min(1, p.stockQty / barScale) : 0;
  const tick = barScale > 0 && lowThreshold > 0 ? Math.min(1, lowThreshold / barScale) : null;

  const details = [
    { key: 'section', label: 'Section', value: p.section?.trim(), Icon: Tag },
    { key: 'type', label: 'Type', value: p.productType?.name?.trim(), Icon: Layers },
    { key: 'sold', label: 'Sold by', value: soldByLabel(p.measure), Icon: Box },
    { key: 'price', label: 'Price for', value: p.priceQty > 0 ? formatAmount(p.priceQty, p.measure) : '', Icon: ShoppingBag },
  ].filter((d): d is typeof d & { value: string } => !!d.value);
  const description = p.description?.trim();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
      {header}

      <ScrollView
        ref={scrollRef}
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        {/* ── Hero ── */}
        <View style={[styles.card, styles.hero]}>
          <View style={styles.heroImageWrap}>
            {p.imageUrl ? (
              <Image source={{ uri: p.imageUrl }} style={styles.heroImage} />
            ) : (
              <View style={[styles.heroImage, styles.heroFallback]}>
                <Package size={44} color={Color.placeholder} strokeWidth={1.4} />
              </View>
            )}
            <Pill
              label={active ? 'Active' : 'Inactive'}
              colors={active ? PILL.green : PILL.grey}
              icon={<View style={[styles.dotIcon, active ? styles.dotActive : styles.dotInactive]} />}
              style={styles.heroPill}
            />
            <Switch
              value={active}
              onValueChange={toggleActive}
              trackColor={{ true: BRAND_BLUE, false: SWITCH_OFF }}
              thumbColor={Color.white}
              ios_backgroundColor={SWITCH_OFF}
              style={styles.heroSwitch}
              accessibilityLabel={`${p.name} active`}
            />
          </View>
          <View style={styles.heroInfo}>
            <Text style={styles.name} numberOfLines={3}>
              {p.name}
            </Text>
            {!!subtitle && (
              <Text style={styles.subtitle} numberOfLines={2}>
                {subtitle}
              </Text>
            )}
            <Text style={styles.price} numberOfLines={1} adjustsFontSizeToFit>
              {priceLabel(p.priceMinor, p.priceQty, p.measure, p.currency)}
            </Text>
            <View style={styles.ratingRow}>
              {ratingCount > 0 ? (
                <View style={styles.ratingLeft}>
                  <Star size={16} color={STAR} fill={STAR} />
                  <Text style={styles.ratingValue}>{ratingAvg.toFixed(1)}</Text>
                  <Text style={styles.ratingCount} numberOfLines={1}>
                    ({ratingCount} review{ratingCount === 1 ? '' : 's'})
                  </Text>
                </View>
              ) : (
                <Text style={styles.ratingCount}>No reviews</Text>
              )}
              <LinkButton label="See reviews" onPress={() => scrollTo(reviewsY.current)} />
            </View>
            {(p.codEnabled || p.partialPayEnabled) && (
              <View style={styles.payChips}>
                {p.codEnabled && (
                  <View style={styles.payChip}>
                    <CreditCard size={15} color={INK} />
                    <Text style={styles.payChipText}>COD</Text>
                  </View>
                )}
                {p.partialPayEnabled && (
                  <View style={styles.payChip}>
                    <CreditCard size={15} color={INK} />
                    <Text style={styles.payChipText}>Partial pay</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {/* ── Stock ── */}
        <View style={styles.card}>
          <CardTitle title="Stock" right={<Pill label={pill.label} colors={pill.colors} style={styles.cardPill} />} />
          {madeToOrder ? (
            <View style={styles.madeToOrder}>
              <Clock size={18} color={Color.textSecondary} />
              <Text style={styles.madeToOrderText}>
                {stockState === 'out'
                  ? 'Made to order — currently marked out of stock.'
                  : 'Made to order — stock isn’t tracked for this product.'}
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.stockValue}>{formatAmount(p.stockQty, p.measure)}</Text>
              <View style={styles.bar}>
                <View style={[styles.barFill, { width: `${fill * 100}%` }]} />
                {tick != null && <View style={[styles.barTick, { left: `${tick * 100}%` }]} />}
              </View>
              <View style={styles.barLabels}>
                <Text style={styles.barLabel}>
                  {p.stepQty > 0 ? `Minimum order: ${formatAmount(p.stepQty, p.measure)}` : ''}
                </Text>
                {lowThreshold > 0 && (
                  <Text style={styles.barLabel}>Low stock: {formatAmount(lowThreshold, p.measure)}</Text>
                )}
              </View>
              <View style={styles.stockActions}>
                <TouchableOpacity style={styles.addStockBtn} onPress={goToStock} accessibilityRole="button">
                  <Plus size={18} color={Color.white} strokeWidth={2.4} />
                  <Text style={styles.addStockText} numberOfLines={1}>
                    Add stock
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.removeStockBtn} onPress={goToStock} accessibilityRole="button">
                  <Minus size={18} color={INK} strokeWidth={2.4} />
                  <Text style={styles.removeStockText} numberOfLines={1}>
                    Remove stock
                  </Text>
                </TouchableOpacity>
                <View style={styles.vDivider} />
                <LinkButton label="Stock history" onPress={() => scrollTo(historyY.current)} />
              </View>
            </>
          )}
        </View>

        {/* ── Sales ── */}
        <SalesCard sales={sales} measure={p.measure} currency={p.currency} />

        {/* ── Recent stock changes ── */}
        {!madeToOrder && (
          <View
            style={styles.card}
            onLayout={(e) => {
              historyY.current = e.nativeEvent.layout.y;
            }}
          >
            <CardTitle title="Recent stock changes" />
            {recent.length === 0 ? (
              <Text style={styles.emptyText}>No stock changes yet.</Text>
            ) : (
              recent.map((h, i) => <ChangeRow key={h.id} item={h} measure={p.measure} first={i === 0} />)
            )}
          </View>
        )}

        {/* ── Reviews ── */}
        <View
          style={styles.card}
          onLayout={(e) => {
            reviewsY.current = e.nativeEvent.layout.y;
          }}
        >
          <CardTitle
            title="Reviews"
            right={
              reviews.length > REVIEWS_PREVIEW ? (
                <LinkButton label={showAllReviews ? 'Show less' : 'See all reviews'} onPress={toggleReviews} />
              ) : undefined
            }
          />
          {ratingCount > 0 && (
            <View style={styles.ratingSummary}>
              <Text style={styles.ratingBig}>{ratingAvg.toFixed(1)}</Text>
              <Stars rating={ratingAvg} size={20} />
              <Text style={styles.ratingCount}>({ratingCount})</Text>
            </View>
          )}
          {shownReviews.length === 0 ? (
            <Text style={styles.emptyText}>No reviews yet.</Text>
          ) : (
            shownReviews.map((r, i) => <ReviewRow key={r.id} review={r} index={i} />)
          )}
        </View>

        {/* ── Product details ── */}
        <View style={styles.card}>
          <CardTitle title="Product details" />
          {details.map((d, i) => (
            <DetailRow
              key={d.key}
              first={i === 0}
              label={d.label}
              value={d.value}
              icon={<d.Icon size={20} color={INK} strokeWidth={1.8} />}
            />
          ))}
          {!!description && (
            <View style={[styles.detailRow, styles.descRow, details.length > 0 && styles.rowDivider]}>
              <View style={styles.detailIcon}>
                <FileText size={20} color={INK} strokeWidth={1.8} />
              </View>
              <View style={styles.descBody}>
                <Text style={styles.descTitle}>Description</Text>
                <Text style={styles.descText}>{description}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
        <TouchableOpacity style={styles.footerBtn} onPress={editProduct} activeOpacity={0.85} accessibilityRole="button">
          <Pencil size={22} color={Color.white} strokeWidth={2} />
          <Text style={styles.footerBtnText}>Edit Product</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
