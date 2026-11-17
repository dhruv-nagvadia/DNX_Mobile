import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Bell, Calendar, Check, ChevronRight, Repeat, Store, X } from 'lucide-react-native';

import { RemoteImage } from '@/components/RemoteImage';
import { CategoryIcon } from '@/components/CategoryIcon';
import { useGetProviderByIdQuery } from '@/redux/api/provider/providerApi';
import { Reminder, ReminderStatus } from '@/redux/api/reminder/types';
import {
  REPEAT_LABEL,
  TYPE_ICON,
  TYPE_LABEL,
  TYPE_TINT,
  dueLabel,
  formatReminderDate,
} from '@/utils/reminderMeta';

import { dueLine } from './data';
import { styles, COLORS } from './styles';

type Outcome = Extract<ReminderStatus, 'DONE' | 'MISSED'>;

interface ReminderCardProps {
  reminder: Reminder;
  /** History row (Done / Missed) — plain date + outcome pill. */
  isHistory: boolean;
  /** Rows grouped inside one card (Upcoming / History) vs standalone cards. */
  grouped: boolean;
  /** Draw a hairline above this grouped row. */
  divider?: boolean;
  onOpen: (r: Reminder) => void;
  onRespond: (r: Reminder, status: Outcome) => void;
  onBook: (providerId: string, name?: string) => void;
}

const HIT = { top: 8, bottom: 8, left: 6, right: 6 };

/** Tiny business avatar + name, and a "Book now" button for linked reminders. */
function BusinessLine({
  providerId,
  showBook,
  onBook,
}: {
  providerId: string;
  showBook: boolean;
  onBook: (providerId: string, name?: string) => void;
}) {
  const { data: business } = useGetProviderByIdQuery({ id: providerId });
  const name = business?.businessName;

  return (
    <View style={styles.bizRow}>
      <View style={styles.bizChip}>
        <View style={styles.bizAvatar}>
          <RemoteImage
            uris={[
              business?.images?.[0],
              business?.subcategory?.imageUrl,
              business?.category?.imageUrl,
            ]}
            style={styles.fill}
            resizeMode="cover"
            fallback={
              business?.category?.slug ? (
                <CategoryIcon slug={business.category.slug} size={12} color={COLORS.muted} />
              ) : (
                <Store size={12} color={COLORS.muted} />
              )
            }
          />
        </View>
        <Text style={styles.bizName} numberOfLines={1}>
          {name ?? 'Business'}
        </Text>
      </View>
      {showBook && (
        <TouchableOpacity
          style={styles.bookBtn}
          activeOpacity={0.7}
          onPress={() => onBook(providerId, name)}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel={name ? `Book now at ${name}` : 'Book now'}
        >
          <Calendar size={13} color={COLORS.link} />
          <Text style={styles.bookText}>Book now</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export function ReminderCard({
  reminder: r,
  isHistory,
  grouped,
  divider,
  onOpen,
  onRespond,
  onBook,
}: ReminderCardProps) {
  const Icon = TYPE_ICON[r.type] ?? Bell;
  const tint = TYPE_TINT[r.type] ?? TYPE_TINT.other;
  const pending = r.status === 'PENDING';
  const actionable = pending && dueLabel(r.dueDate).actionable;
  const due = pending ? dueLine(r) : null;
  const accent =
    due?.tone === 'overdue' ? styles.accentRed : due?.tone === 'today' ? styles.accentAmber : null;
  const dueStyle = !due
    ? styles.dueMuted
    : due.tone === 'overdue'
      ? styles.dueRed
      : due.tone === 'today'
        ? styles.dueAmber
        : styles.dueBlue;
  const dateText = due ? due.text : formatReminderDate(r.dueDate);
  const done = r.status === 'DONE';

  return (
    <TouchableOpacity
      style={[grouped ? styles.row : styles.card, divider && styles.rowDivider, accent]}
      activeOpacity={0.85}
      onPress={() => onOpen(r)}
      accessibilityRole="button"
      accessibilityLabel={`${r.title}, ${TYPE_LABEL[r.type]}, ${dateText}${
        isHistory ? `, ${done ? 'done' : 'missed'}` : ''
      }`}
      accessibilityHint="Opens the reminder to edit"
    >
      <View
        style={[
          isHistory ? styles.iconTileSm : styles.iconTile,
          { backgroundColor: tint.bg, borderColor: tint.border },
        ]}
      >
        <Icon size={isHistory ? 18 : 22} color={tint.icon} />
      </View>

      <View style={styles.info}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {r.title}
        </Text>
        <Text style={[styles.due, dueStyle]} numberOfLines={1}>
          {dateText}
        </Text>
        {!isHistory && r.repeat !== 'NONE' && (
          <View style={styles.repeatChip}>
            <Repeat size={11} color={COLORS.muted} />
            <Text style={styles.repeatText}>{REPEAT_LABEL[r.repeat]}</Text>
          </View>
        )}
        {!!r.providerId && (
          <BusinessLine providerId={r.providerId} showBook={!isHistory} onBook={onBook} />
        )}
      </View>

      {actionable && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.roundBtn, styles.roundBtnDone]}
            activeOpacity={0.7}
            onPress={() => onRespond(r, 'DONE')}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel={`Mark ${r.title} done`}
          >
            <Check size={18} color={COLORS.green} strokeWidth={2.4} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roundBtn, styles.roundBtnMissed]}
            activeOpacity={0.7}
            onPress={() => onRespond(r, 'MISSED')}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel={`Mark ${r.title} missed`}
          >
            <X size={18} color={COLORS.red} strokeWidth={2.4} />
          </TouchableOpacity>
        </View>
      )}

      {pending && !actionable && <ChevronRight size={20} color={COLORS.muted} />}

      {!pending && (
        <TouchableOpacity
          style={[styles.outcome, done ? styles.outcomeDone : styles.outcomeMissed]}
          activeOpacity={0.7}
          onPress={() => onRespond(r, done ? 'MISSED' : 'DONE')}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel={done ? 'Done. Tap to mark missed' : 'Missed. Tap to mark done'}
        >
          {done ? (
            <Check size={14} color={COLORS.green} strokeWidth={2.6} />
          ) : (
            <X size={14} color={COLORS.red} strokeWidth={2.6} />
          )}
          <Text
            style={[styles.outcomeText, done ? styles.outcomeTextDone : styles.outcomeTextMissed]}
          >
            {done ? 'Done' : 'Missed'}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
