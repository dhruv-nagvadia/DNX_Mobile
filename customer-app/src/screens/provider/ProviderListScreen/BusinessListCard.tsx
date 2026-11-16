import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BadgeCheck, Clock, MapPin, Star } from 'lucide-react-native';

import { CategoryIcon } from '@/components/CategoryIcon';
import { IconTile, iconTileColor } from '@/components/IconTile';
import { RemoteImage } from '@/components/RemoteImage';
import { Provider } from '@/redux/api/provider/types';
import { isOpenNow, nextOpening, todayHours } from '@/utils/openNow';
import { formatMoney } from '@/utils/units';

import { styles } from './styles';

const MUTED_ICON = '#64748B';

interface Props {
  provider: Provider;
  width: number;
  index: number;
  onPress: (p: Provider) => void;
}

function fromPrice(p: Provider): string | null {
  if (!p.services?.length) {
    return null;
  }
  const min = p.services.reduce((m, s) => Math.min(m, s.priceMinor), Number.POSITIVE_INFINITY);
  return formatMoney(min, p.services[0].currency).replace(/\.00$/, '');
}

/**
 * Listing card (mockup "Unisex Salon Booking App Listings.png"): wide photo with
 * an open/closed pill, name + verified tick, rating pill, services, place •
 * distance | today's hours, reviews, then "From ₹" and a Book button.
 */
export function BusinessListCard({ provider: p, width, index, onPress }: Props) {
  const isStore = p.type === 'STORE';
  const open = isOpenNow(p.businessHours);
  const opensAt = open === false ? nextOpening(p.businessHours) : null;
  const hours = todayHours(p.businessHours);
  const price = isStore ? null : fromPrice(p);
  const services = (isStore ? [] : (p.services ?? []))
    .slice(0, 3)
    .map((s) => s.name)
    .join(', ');
  const place = p.city ?? p.addressLine ?? null;
  const dist =
    p.distanceKm == null
      ? null
      : `${p.distanceKm < 10 ? p.distanceKm.toFixed(1) : Math.round(p.distanceKm)} km`;
  const placeLine = [place, dist].filter(Boolean).join(' • ');

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => onPress(p)}>
      {/* ── Photo with open / closed pill ─────────────────────────────── */}
      <View style={[styles.photo, { height: Math.round(width * 0.38) }]}>
        <RemoteImage
          uris={[p.images[0], p.subcategory?.imageUrl, p.category.imageUrl]}
          style={styles.fill}
          resizeMode="cover"
          fallback={
            <IconTile
              index={index}
              icon={
                <CategoryIcon
                  slug={p.category.slug}
                  size={34}
                  color={iconTileColor(index)}
                  strokeWidth={1.6}
                />
              }
            />
          }
        />
        {open === true && (
          <View style={styles.openPill}>
            <View style={styles.openDot} />
            <Text style={styles.openPillText}>Open now</Text>
          </View>
        )}
        {open === false && (
          <View style={styles.closedPill}>
            <Clock size={12} color="#FFFFFF" strokeWidth={2.2} />
            <Text style={styles.closedPillText}>{opensAt ? `Closed • ${opensAt}` : 'Closed'}</Text>
          </View>
        )}
      </View>

      {/* ── Details ───────────────────────────────────────────────────── */}
      <View style={styles.body}>
        <View style={styles.nameRow}>
          <View style={styles.nameWrap}>
            <Text style={styles.name} numberOfLines={1}>
              {p.businessName}
            </Text>
            {p.isVerified && (
              <BadgeCheck size={18} color="#FFFFFF" fill="#2563EB" strokeWidth={2} />
            )}
          </View>
          <View style={styles.ratingPill}>
            <Star size={13} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{p.ratingAvg.toFixed(1)}</Text>
          </View>
        </View>

        <Text style={styles.sub} numberOfLines={1}>
          {p.subcategory?.name ?? p.category.name}
          {services ? ` • ${services}` : ''}
        </Text>

        {(!!placeLine || !!hours) && (
          <View style={styles.metaRow}>
            {!!placeLine && (
              <View style={styles.metaItem}>
                <MapPin size={14} color={MUTED_ICON} strokeWidth={2} />
                <Text style={styles.meta} numberOfLines={1}>
                  {placeLine}
                </Text>
              </View>
            )}
            {!!placeLine && !!hours && <View style={styles.metaDivider} />}
            {!!hours && (
              <View style={styles.metaItem}>
                <Clock size={14} color={MUTED_ICON} strokeWidth={2} />
                <Text style={styles.meta} numberOfLines={1}>
                  {hours}
                </Text>
              </View>
            )}
          </View>
        )}

        <Text style={styles.meta}>
          {p.ratingCount > 0
            ? `${p.ratingCount.toLocaleString('en-IN')} ${p.ratingCount === 1 ? 'review' : 'reviews'}`
            : 'New on DNX'}
        </Text>

        <View style={styles.footer}>
          {price ? (
            <Text style={styles.fromLabel}>
              From <Text style={styles.fromPrice}>{price}</Text>
            </Text>
          ) : (
            <View />
          )}
          <View style={styles.bookBtn}>
            <Text style={styles.bookBtnText}>{isStore ? 'Shop now' : 'Book now'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
