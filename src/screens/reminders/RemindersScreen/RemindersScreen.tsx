import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Check, Plus } from 'lucide-react-native';

import { Color } from '@/utils/Theme';
import { TYPE_ICON, REPEAT_LABEL, dueLabel } from '@/utils/reminderMeta';
import { Reminder } from '@/redux/api/reminder/types';

import { useRemindersScreen } from './useRemindersScreen';
import { styles } from './styles';

/** Reminders tab — renewals, services and follow-ups. */
export default function RemindersScreen() {
  const { isLoading, total, overdue, upcoming, done, onAdd, onOpen, onDone } = useRemindersScreen();

  const renderCard = (r: Reminder, isDone: boolean) => {
    const Icon = TYPE_ICON[r.type] ?? Bell;
    const due = dueLabel(r.dueDate);
    return (
      <TouchableOpacity key={r.id} style={styles.card} activeOpacity={0.85} onPress={() => onOpen(r)}>
        <View style={[styles.avatar, due.overdue && !isDone && styles.avatarOverdue]}>
          <Icon size={20} color={due.overdue && !isDone ? Color.error : Color.primary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {r.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={[styles.due, due.overdue && !isDone && styles.dueOverdue]}>{due.text}</Text>
            {r.repeat !== 'NONE' && <Text style={styles.repeatBadge}>{REPEAT_LABEL[r.repeat]}</Text>}
          </View>
        </View>
        {isDone ? (
          <View style={[styles.doneBtn, styles.doneBtnFilled]}>
            <Check size={16} color={Color.white} />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.doneBtn}
            activeOpacity={0.7}
            onPress={() => onDone(r.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Check size={16} color={Color.textSecondary} />
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
          {done.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Done</Text>
              {done.map((r) => renderCard(r, true))}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
