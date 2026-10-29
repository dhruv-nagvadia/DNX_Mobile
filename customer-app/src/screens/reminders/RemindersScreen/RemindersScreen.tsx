import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Check, Plus, X } from 'lucide-react-native';

import { Color } from '@/utils/Theme';
import { TYPE_ICON, REPEAT_LABEL, dueLabel, formatReminderDate } from '@/utils/reminderMeta';
import { Reminder } from '@/redux/api/reminder/types';

import { useRemindersScreen } from './useRemindersScreen';
import { styles } from './styles';

/** Reminders tab — renewals, services and follow-ups. */
export default function RemindersScreen() {
  const { isLoading, total, overdue, upcoming, history, onAdd, onOpen, onRespond } =
    useRemindersScreen();

  const renderCard = (r: Reminder, isHistory: boolean) => {
    const Icon = TYPE_ICON[r.type] ?? Bell;
    const due = dueLabel(r.dueDate);
    const isOverdueLook = due.overdue && r.status !== 'DONE';
    const dateText = isHistory ? formatReminderDate(r.dueDate) : due.text;

    return (
      <TouchableOpacity key={r.id} style={styles.card} activeOpacity={0.85} onPress={() => onOpen(r)}>
        <View style={[styles.avatar, isOverdueLook && styles.avatarOverdue]}>
          <Icon size={20} color={isOverdueLook ? Color.error : Color.primary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {r.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={[styles.due, !isHistory && isOverdueLook && styles.dueOverdue]}>
              {dateText}
            </Text>
            {r.repeat !== 'NONE' && <Text style={styles.repeatBadge}>{REPEAT_LABEL[r.repeat]}</Text>}
          </View>
        </View>

        {r.status === 'PENDING' && due.actionable && (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.doneBtn, styles.doneBtnOutline]}
              activeOpacity={0.7}
              onPress={() => onRespond(r, 'DONE')}
              hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
              accessibilityLabel="Mark done"
            >
              <Check size={15} color={Color.success} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.doneBtn, styles.missedBtnOutline]}
              activeOpacity={0.7}
              onPress={() => onRespond(r, 'MISSED')}
              hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
              accessibilityLabel="Mark missed"
            >
              <X size={15} color={Color.error} />
            </TouchableOpacity>
          </View>
        )}

        {r.status !== 'PENDING' && (
          <TouchableOpacity
            style={[
              styles.decisionBadge,
              r.status === 'DONE' ? styles.decisionBadgeDone : styles.decisionBadgeMissed,
            ]}
            activeOpacity={0.7}
            onPress={() => onRespond(r, r.status === 'DONE' ? 'MISSED' : 'DONE')}
          >
            {r.status === 'DONE' ? (
              <Check size={13} color={Color.white} />
            ) : (
              <X size={13} color={Color.white} />
            )}
            <Text style={styles.decisionBadgeText}>{r.status === 'DONE' ? 'Done' : 'Missed'}</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Reminders</Text>
          <Text style={styles.subtitle}>Renewals, services and follow-ups.</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} activeOpacity={0.85} onPress={onAdd}>
          <Plus size={16} color={Color.white} />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Color.primary} />
        </View>
      ) : total === 0 ? (
        <View style={styles.center}>
          <Bell size={48} color={Color.placeholder} strokeWidth={1.4} />
          <Text style={styles.emptyTitle}>No reminders yet</Text>
          <Text style={styles.emptyText}>
            Add renewals like car insurance or bike service, and we&apos;ll keep track of them for
            you.
          </Text>
          <TouchableOpacity style={styles.emptyBtn} activeOpacity={0.85} onPress={onAdd}>
            <Text style={styles.emptyBtnText}>Add a reminder</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {overdue.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Overdue</Text>
              {overdue.map((r) => renderCard(r, false))}
            </>
          )}
          {upcoming.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Upcoming</Text>
              {upcoming.map((r) => renderCard(r, false))}
            </>
          )}
          {history.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>History</Text>
              {history.map((r) => renderCard(r, true))}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
