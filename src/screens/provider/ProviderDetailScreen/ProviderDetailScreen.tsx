import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Star, BadgeCheck, MapPin, Clock } from 'lucide-react-native';

import { CategoryIcon } from '@/components/CategoryIcon';
import { AppButton } from '@/components/AppButton';
import { Color } from '@/utils/Theme';

import { useProviderDetail } from './useProviderDetail';
import { styles } from './styles';

const SCREEN_W = Dimensions.get('window').width;

function formatPrice(minor: number, currency: string): string {
  const amount = (minor / 100).toLocaleString('en-IN');
  return currency === 'INR' ? `₹${amount}` : `${amount} ${currency}`;
}

function formatDuration(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

function dayLabel(d: Date, i: number): string {
  if (i === 0) return 'Today';
  return `${d.toLocaleDateString(undefined, { weekday: 'short' })} ${d.getDate()}`;
}

function timeLabel(d: Date): string {
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

/** JSX only — logic comes from useProviderDetail. */
export default function ProviderDetailScreen() {
  const {
    provider,
    isLoading,
    openGallery,
    services,
    selectedServiceId,
    selectService,
    days,
    dayIndex,
    selectDay,
    slots,
    dayOpen,
    selectedSlot,
    selectSlot,
    canBook,
    booking,
    onBook,
  } = useProviderDetail();

  const [activeImage, setActiveImage] = useState(0);
  const onGalleryScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setActiveImage(Math.round(e.nativeEvent.contentOffset.x / SCREEN_W));

  if (isLoading || !provider) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color={Color.primary} />
      </View>
    );
  }

  const hint = !selectedServiceId ? 'Select a service' : !selectedSlot ? 'Select a time' : 'Ready to book';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Gallery */}
        {provider.images.length > 0 ? (
          <View style={styles.galleryWrap}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onGalleryScroll}
              style={styles.gallery}
            >
              {provider.images.map((url, i) => (
                <TouchableOpacity key={url} activeOpacity={0.95} onPress={() => openGallery(i)}>
                  <Image source={{ uri: url }} style={styles.galleryImg} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.countBadge}>
              <Text style={styles.countText}>
                {activeImage + 1} / {provider.images.length}
              </Text>
            </View>

            {provider.images.length > 1 && (
              <View style={styles.dots}>
                {provider.images.map((url, i) => (
                  <View key={url} style={[styles.dot, i === activeImage && styles.dotActive]} />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.galleryFallback}>
            <CategoryIcon slug={provider.category.slug} size={64} strokeWidth={1.4} />
          </View>
        )}

        <View style={styles.body}>
          {/* Header */}
          <Text style={styles.name}>{provider.businessName}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.chip}>
              <CategoryIcon slug={provider.category.slug} size={13} color={Color.primaryDark} />
              <Text style={styles.chipText}>
                {provider.subcategory?.name ?? provider.category.name}
              </Text>
            </View>
            {provider.isVerified && (
              <View style={styles.chip}>
                <BadgeCheck size={13} color={Color.success} />
                <Text style={styles.chipText}>Verified</Text>
              </View>
            )}
          </View>
          <View style={styles.metaRow}>
            <Star size={14} color={Color.warning} fill={Color.warning} />
            <Text style={styles.metaText}>
              {provider.ratingAvg.toFixed(1)} ({provider.ratingCount} reviews)
            </Text>
          </View>
          {!!provider.city && (
            <View style={styles.metaRow}>
              <MapPin size={14} color={Color.textSecondary} />
              <Text style={styles.metaText}>{provider.city}</Text>
            </View>
          )}

          {/* About */}
          <Text style={styles.sectionTitle}>About</Text>
          {provider.description ? (
            <Text style={styles.about}>{provider.description}</Text>
          ) : (
            <Text style={styles.muted}>No description added yet.</Text>
          )}

          {/* Services (pick one) */}
          <Text style={styles.sectionTitle}>Select a service</Text>
          {services.length === 0 ? (
            <Text style={styles.muted}>No services listed yet.</Text>
          ) : (
            services.map((s) => {
              const active = s.id === selectedServiceId;
              return (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.serviceRow, active && styles.serviceRowActive]}
                  activeOpacity={0.85}
                  onPress={() => selectService(s.id)}
                >
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{s.name}</Text>
                    <Text style={styles.serviceMeta}>{formatDuration(s.durationMin)}</Text>
                  </View>
                  <Text style={styles.servicePrice}>{formatPrice(s.priceMinor, s.currency)}</Text>
                  <View style={[styles.radio, active && styles.radioActive]}>
                    {active && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })
          )}

          {/* Date */}
          <Text style={styles.sectionTitle}>Select a date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayRow}>
            {days.map((d, i) => {
              const active = i === dayIndex;
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.dayChip, active && styles.dayChipActive]}
                  activeOpacity={0.85}
                  onPress={() => selectDay(i)}
                >
                  <Text style={[styles.dayChipText, active && styles.dayChipTextActive]}>
                    {dayLabel(d, i)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Slots */}
          <Text style={styles.sectionTitle}>Available slots</Text>
          {slots.length === 0 ? (
            <View style={styles.metaRow}>
              <Clock size={14} color={Color.textSecondary} />
              <Text style={styles.muted}>
                {!dayOpen
                  ? 'Closed on this day — try another date.'
                  : selectedServiceId
                    ? 'No open times for this service — try another day.'
                    : 'Fully booked on this day — try another date.'}
              </Text>
            </View>
          ) : (
            <View style={styles.slotWrap}>
              {slots.map((slot) => {
                const iso = slot.toISOString();
                const active = iso === selectedSlot;
                return (
                  <TouchableOpacity
                    key={iso}
                    style={[styles.slot, active && styles.slotActive]}
                    activeOpacity={0.85}
                    onPress={() => selectSlot(iso)}
                  >
                    <Text style={[styles.slotText, active && styles.slotTextActive]}>
                      {timeLabel(slot)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky book bar */}
      <View style={styles.bookBar}>
        <Text style={styles.bookHint}>{hint}</Text>
        <AppButton
          style={styles.bookBtn}
          title="Book now"
          onPress={onBook}
          loading={booking}
          disabled={!canBook}
        />
      </View>
    </View>
  );
}
