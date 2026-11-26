import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Bell, Calendar, Check, ChevronRight, Store, X } from 'lucide-react-native';

import { RemoteImage } from '@/components/RemoteImage';
import { CategoryIcon } from '@/components/CategoryIcon';
import { useGetProviderByIdQuery } from '@/redux/api/provider/providerApi';
import { Provider } from '@/redux/api/provider/types';
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
  /** Draw a hairline above this row (every row but the first in its group). */
  divider?: boolean;
  onOpen: (r: Reminder) => void;
  onRespond: (r: Reminder, status: Outcome) => void;
  onBook: (providerId: string, name?: string) => void;
}

const HIT = { top: 8, bottom: 8, left: 6, right: 6 };

/**
 * The linked business is shown on its own line under the row, so a title that starts with
 * its name ("Urban Cuts Salon — next Haircut", how bookings used to prefill it) drops that
 * part for display, along with the filler word "next" that prefill added: "Haircut".
 * Titles the customer typed themselves are left as they wrote them.
 */
function titleWithoutBusiness(title: string, businessName?: string): string {
  if (!businessName) {
    return title;
  }
  const lower = title.toLowerCase();
  const name = businessName.trim().toLowerCase();
  if (!name || !lower.startsWith(name)) {
    return title;
  }
  const rest = title
    .slice(name.length)
    .replace(/^\s*[-–—:|]+\s*/, '')
    .replace(/^next\s+/i, '')
    .trim();
  if (!rest) {
    return title;
  }
  return rest.charAt(0).toUpperCase() + rest.slice(1);
}

/** Linked business: its picture and name, and a "Book now" button for open reminders. */
function BusinessLine({
  providerId,
  business,
  showBook,
  onBook,
}: {
  providerId: string;
  business?: Provider;
  showBook: boolean;
  onBook: (providerId: string, name?: string) => void;
}) {
  const name = business?.businessName;
  return (
    <View style={styles.bizRow}>
      <View style={styles.bizThumb}>
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
              <CategoryIcon slug={business.category.slug} size={16} color={COLORS.muted} />
            ) : (
              <Store size={16} color={COLORS.muted} />
            )
          }
        />
      </View>
      <Text style={styles.bizName} numberOfLines={2}>
        {name ?? 'Business'}
      </Text>
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

/** One reminder, as a row inside its group's card. */
export function ReminderCard({
  reminder: r,
  isHistory,
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
  const dueStyle = !due
    ? styles.dueMuted
    : due.tone === 'overdue'
      ? styles.dueRed
      : due.tone === 'today'
        ? styles.dueAmber
        : styles.dueBlue;
  // History rows state the repeat in words next to the date ("10 Nov • Monthly").
  const dateText = due
    ? due.text
    : r.repeat !== 'NONE'
      ? `${formatReminderDate(r.dueDate)} • ${REPEAT_LABEL[r.repeat]}`
      : formatReminderDate(r.dueDate);
  const done = r.status === 'DONE';
  const showBusiness = !!r.providerId;
  // Cached by the query layer, so the business is only fetched once however often it's used.
  const { data: business } = useGetProviderByIdQuery(
    { id: r.providerId ?? '' },
    { skip: !r.providerId },
  );
  const title = titleWithoutBusiness(r.title, business?.businessName);

  return (
    <TouchableOpacity
      style={[styles.row, divider && styles.rowDivider]}
      activeOpacity={0.85}
      onPress={() => onOpen(r)}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${TYPE_LABEL[r.type]}, ${dateText}${
        isHistory ? `, ${done ? 'done' : 'missed'}` : ''
      }`}
      accessibilityHint="Opens the reminder to edit"
    >
      <View style={styles.rowTop}>
        <View
          style={[
            isHistory ? styles.iconTileSm : styles.iconTile,
            { backgroundColor: tint.bg, borderColor: tint.border },
          ]}
        >
          <Icon size={isHistory ? 20 : 22} color={tint.icon} />
        </View>

        <View style={styles.info}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={[styles.due, dueStyle]} numberOfLines={1}>
            {dateText}
          </Text>
        </View>

        {!isHistory && r.repeat !== 'NONE' && (
          <View style={styles.repeatChip}>
            <Text style={styles.repeatText}>{REPEAT_LABEL[r.repeat]}</Text>
          </View>
        )}

        {pending && !actionable && r.repeat === 'NONE' && (
          <ChevronRight size={20} color={COLORS.muted} />
        )}

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
      </View>

      {showBusiness && (
        <View style={styles.rowExtra}>
          <BusinessLine
            providerId={r.providerId as string}
            business={business}
            showBook={!isHistory}
            onBook={onBook}
          />
        </View>
      )}

      {actionable && (
        <View style={[styles.rowExtra, styles.actionsRow]}>
          <TouchableOpacity
            style={[styles.pillBtn, styles.pillBtnDone]}
            activeOpacity={0.7}
            onPress={() => onRespond(r, 'DONE')}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel={`Mark ${title} done`}
          >
            <Check size={15} color={COLORS.green} strokeWidth={2.6} />
            <Text style={[styles.pillBtnText, { color: COLORS.green }]}>Done</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pillBtn, styles.pillBtnMissed]}
            activeOpacity={0.7}
            onPress={() => onRespond(r, 'MISSED')}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel={`Mark ${title} missed`}
          >
            <X size={15} color={COLORS.red} strokeWidth={2.6} />
            <Text style={[styles.pillBtnText, { color: COLORS.red }]}>Missed</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}
