import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalendarDays, ChevronRight } from 'lucide-react-native';

import { CategoryIcon } from '@/components/CategoryIcon';
import { Color } from '@/utils/Theme';
import { STATUS_LABEL, statusColors } from '@/utils/bookingStatus';

import { useBookingsScreen } from './useBookingsScreen';
import { styles } from './styles';

function formatWhen(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${date} · ${time}`;
}

/** Bookings tab — tap a booking to see its full detail. */
export default function BookingsScreen() {
  const { bookings, isLoading, onOpen } = useBookingsScreen();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Your bookings</Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Color.primary} />
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.center}>
          <CalendarDays size={48} color={Color.placeholder} strokeWidth={1.4} />
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptyText}>
            Browse services from the Home tab and your appointments will show up here.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {bookings.map((b) => {
            const [pillBg, pillColor] = statusColors(b.status);
            return (
              <TouchableOpacity
                key={b.id}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => onOpen(b)}
              >
                <View style={styles.cardTop}>
                  <View style={styles.icon}>
                    <CategoryIcon slug={b.provider.category.slug} size={22} />
                  </View>
                  <View style={styles.info}>
                    <Text style={styles.name} numberOfLines={1}>
                      {b.provider.businessName}
                    </Text>
                    <Text style={styles.meta} numberOfLines={1}>
                      {b.service.name} · {formatWhen(b.startTime)}
                    </Text>
                  </View>
                  <View style={[styles.statusPill, { backgroundColor: pillBg }]}>
                    <Text style={[styles.statusText, { color: pillColor }]}>
                      {STATUS_LABEL[b.status]}
                    </Text>
                  </View>
                  <ChevronRight size={18} color={Color.placeholder} />
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
