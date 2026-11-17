import React from 'react';
import { StyleProp, Text, TextStyle, TouchableOpacity, View } from 'react-native';
import { BadgeCheck, ChevronRight, Package, Star } from 'lucide-react-native';

import { CategoryIcon } from '@/components/CategoryIcon';
import { ProductTypeIcon } from '@/components/ProductTypeIcon';
import { RemoteImage } from '@/components/RemoteImage';
import { Category } from '@/redux/api/category/types';
import { Provider, ServiceSearchResult } from '@/redux/api/provider/types';
import { TILE_CYCLE } from '@/utils/homeTiles';
import { Color } from '@/utils/Theme';
import { INK, LINK } from '@/utils/modernTheme';
import { isOpenNow } from '@/utils/openNow';
import { formatMoney } from '@/utils/units';
import { SearchViewItem } from '@/utils/searchHistory';

import { styles } from './styles';

/** Splits `text` around every case-insensitive occurrence of `query`. */
function splitMatches(text: string, query: string): { text: string; match: boolean }[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [{ text, match: false }];
  }
  const lower = text.toLowerCase();
  const parts: { text: string; match: boolean }[] = [];
  let from = 0;
  let at = lower.indexOf(q, from);
  while (at !== -1) {
    if (at > from) {
      parts.push({ text: text.slice(from, at), match: false });
    }
    parts.push({ text: text.slice(at, at + q.length), match: true });
    from = at + q.length;
    at = lower.indexOf(q, from);
  }
  if (from < text.length) {
    parts.push({ text: text.slice(from), match: false });
  }
  return parts;
}

/** Text with the searched-for part emphasised. */
export function Highlight({
  text,
  query,
  style,
  matchStyle,
  numberOfLines = 1,
}: {
  text: string;
  query: string;
  style: StyleProp<TextStyle>;
  matchStyle: StyleProp<TextStyle>;
  numberOfLines?: number;
}) {
  return (
    <Text style={style} numberOfLines={numberOfLines}>
      {splitMatches(text, query).map((p, i) =>
        p.match ? (
          <Text key={i} style={matchStyle}>
            {p.text}
          </Text>
        ) : (
          p.text
        ),
      )}
    </Text>
  );
}

/** Section title with an optional right-hand link ("Clear" / "See all"). */
export function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle} accessibilityRole="header">
        {title}
      </Text>
      {!!action && !!onAction && (
        <TouchableOpacity
          onPress={onAction}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={`${action} ${title}`}
        >
          <Text style={styles.sectionLink}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/** Neutral square behind an icon when there's no photo. */
function IconTile({ children }: { children: React.ReactNode }) {
  return <View style={styles.iconTile}>{children}</View>;
}

const categoryFallback = (slug: string, size = 26) => (
  <IconTile>
    <CategoryIcon slug={slug} size={size} color={INK} strokeWidth={1.8} />
  </IconTile>
);

/** Photo + label lines for a stored "Recently viewed" entry. */
function recentViewParts(entry: SearchViewItem) {
  if (entry.kind === 'provider') {
    const p = entry.item;
    return {
      name: p.businessName,
      sub: p.subcategory?.name ?? p.category?.name ?? 'Business',
      image: p.images?.[0],
      fallback: categoryFallback(p.category?.slug ?? ''),
    };
  }
  if (entry.kind === 'product') {
    const p = entry.item;
    return {
      name: p.name,
      sub: `Product • ${p.provider.businessName}`,
      image: p.imageUrl,
      fallback: (
        <IconTile>
          {p.productType?.slug ? (
            <ProductTypeIcon slug={p.productType.slug} size={26} color={INK} strokeWidth={1.8} />
          ) : (
            <Package size={26} color={INK} strokeWidth={1.8} />
          )}
        </IconTile>
      ),
    };
  }
  const s = entry.item;
  return {
    name: s.name,
    sub: `Service • ${s.provider.businessName}`,
    image: undefined,
    fallback: categoryFallback(s.category?.slug ?? ''),
  };
}

/** One row of the "Recently viewed" card. */
export function RecentViewRow({ entry, onPress }: { entry: SearchViewItem; onPress: () => void }) {
  const { name, sub, image, fallback } = recentViewParts(entry);
  return (
    <TouchableOpacity
      style={styles.viewRow}
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${sub}`}
    >
      <View style={styles.viewThumb}>
        <RemoteImage uris={[image]} style={styles.fill} resizeMode="cover" fallback={fallback} />
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.rowSub} numberOfLines={1}>
          {sub}
        </Text>
      </View>
      <ChevronRight size={20} color={INK} />
    </TouchableOpacity>
  );
}

/** A pastel "Popular near you" category tile. */
export function PopularTile({
  category,
  index,
  width,
  onPress,
}: {
  category: Category;
  index: number;
  width: number;
  onPress: () => void;
}) {
  const tint = TILE_CYCLE[index % TILE_CYCLE.length];
  return (
    <TouchableOpacity
      style={[styles.tile, { width, backgroundColor: tint.colors[0], borderColor: tint.border }]}
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={category.name}
    >
      <CategoryIcon slug={category.slug} size={28} color={tint.icon} strokeWidth={1.8} />
      <Text style={styles.tileLabel} numberOfLines={1}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

/** The services a business offers, matching ones first ("Hair, Skin, Makeup"). */
function servicesLine(p: Provider, query: string): string {
  const q = query.trim().toLowerCase();
  const names = (p.services ?? []).map((s) => s.name);
  if (names.length) {
    const hit = names.filter((n) => n.toLowerCase().includes(q));
    const miss = names.filter((n) => !n.toLowerCase().includes(q));
    return [...hit, ...miss].slice(0, 3).join(', ');
  }
  return p.description ?? '';
}

/** A business result — photo, name + tick, services, subcategory/distance, rating, open now. */
export function BusinessResultCard({
  provider: p,
  query,
  onPress,
}: {
  provider: Provider;
  query: string;
  onPress: () => void;
}) {
  const subtitle = servicesLine(p, query);
  const open = isOpenNow(p.businessHours);
  const meta = [
    p.subcategory?.name ?? p.category?.name,
    p.distanceKm != null ? `${p.distanceKm.toFixed(1)} km` : null,
  ]
    .filter(Boolean)
    .join(' • ');

  return (
    <TouchableOpacity
      style={styles.bizCard}
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${p.businessName}${meta ? `, ${meta}` : ''}`}
    >
      <View style={styles.bizThumb}>
        <RemoteImage
          uris={[p.images?.[0], p.subcategory?.imageUrl, p.category?.imageUrl]}
          style={styles.fill}
          resizeMode="cover"
          fallback={categoryFallback(p.category?.slug ?? '', 32)}
        />
      </View>
      <View style={styles.bizInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.bizName} numberOfLines={1}>
            {p.businessName}
          </Text>
          {p.isVerified && <BadgeCheck size={18} color={Color.white} fill={LINK} />}
        </View>
        {!!subtitle && (
          <Highlight
            text={subtitle}
            query={query}
            style={styles.bizServices}
            matchStyle={styles.strong}
          />
        )}
        {!!meta && (
          <Text style={styles.bizMeta} numberOfLines={1}>
            {meta}
          </Text>
        )}
        {(p.ratingCount > 0 || open) && (
          <View style={styles.ratingRow}>
            {p.ratingCount > 0 && (
              <View style={styles.ratingInner}>
                <Star size={15} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.ratingText}>{p.ratingAvg.toFixed(1)}</Text>
              </View>
            )}
            {open && (
              <View style={styles.openPill}>
                <Text style={styles.openPillText}>Open now</Text>
              </View>
            )}
          </View>
        )}
      </View>
      <ChevronRight size={20} color={INK} />
    </TouchableOpacity>
  );
}

/** A service result row — photo, highlighted name, business • duration, price, Book. */
export function ServiceResultRow({
  service: s,
  query,
  imageUri,
  onPress,
}: {
  service: ServiceSearchResult;
  query: string;
  /** The offering business's photo, when we have it from the business results. */
  imageUri?: string | null;
  onPress: () => void;
}) {
  const label = `${s.name} at ${s.provider.businessName}, ${formatMoney(s.priceMinor, s.currency)}`;
  return (
    <TouchableOpacity
      style={styles.serviceRow}
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.serviceThumb}>
        <RemoteImage
          uris={[imageUri, s.category?.imageUrl]}
          style={styles.fill}
          resizeMode="cover"
          fallback={categoryFallback(s.category?.slug ?? '', 22)}
        />
      </View>
      <View style={styles.rowInfo}>
        <Highlight
          text={s.name}
          query={query}
          style={styles.serviceName}
          matchStyle={styles.match}
        />
        <Text style={styles.serviceMeta} numberOfLines={1}>
          at {s.provider.businessName} • {s.durationMin} min
        </Text>
      </View>
      <Text style={styles.servicePrice}>{formatMoney(s.priceMinor, s.currency)}</Text>
      <TouchableOpacity
        style={styles.outlineBtn}
        activeOpacity={0.8}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Book ${s.name}`}
      >
        <Text style={styles.outlineBtnText}>Book</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
