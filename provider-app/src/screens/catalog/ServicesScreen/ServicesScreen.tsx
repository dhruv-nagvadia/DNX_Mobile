import React from 'react';
import { Alert, RefreshControl, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Pencil, Plus, Scissors, Trash2, Wrench } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { EmptyState } from '@/components/EmptyState';
import { Color } from '@/utils/Theme';
import { ACTION, TINT } from '@/utils/modernTheme';
import { formatMoney } from '@/utils/money';

import { useServicesScreen } from './useServicesScreen';
import { styles } from './styles';

function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) {
    return `${m} min`;
  }
  if (m === 0) {
    return `${h} hr`;
  }
  return `${h} hr ${m} min`;
}

export default function ServicesScreen() {
  const { services, isLoading, refreshing, refresh, deleting, toggleActive, remove, addService, editService } =
    useServicesScreen();

  const confirmDelete = (serviceId: string, name: string) => {
    Alert.alert('Delete service?', `"${name}" will no longer be bookable.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(serviceId) },
    ]);
  };

  return (
    <View style={styles.root}>
      <AppHeader title="Services" variant="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
      >
        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.addBtn} onPress={addService} activeOpacity={0.85} accessibilityRole="button">
            <Plus size={18} color={Color.white} strokeWidth={2.5} />
            <Text style={styles.addBtnText}>Add Service</Text>
          </TouchableOpacity>
        </View>

        {services.length === 0 && !isLoading ? (
          <EmptyState
            icon={<Wrench size={48} color={Color.placeholder} strokeWidth={1.4} />}
            title="No services yet"
            body="Add one to start taking bookings."
          />
        ) : (
          <View style={styles.card}>
            {services.map((s, i) => {
              const active = s.isActive !== false;
              return (
                <View key={s.id}>
                  {i > 0 && <View style={styles.divider} />}
                  <View style={styles.row}>
                    <View style={[styles.thumb, !active && styles.dimmed]}>
                      <Scissors size={22} color={TINT.blue.icon} />
                    </View>
                    <View style={[styles.rowMain, !active && styles.dimmed]}>
                      <Text style={styles.name} numberOfLines={2}>
                        {s.name}
                      </Text>
                      <Text style={styles.meta} numberOfLines={1}>
                        {formatDuration(s.durationMin)} • {formatMoney(s.priceMinor, s.currency)}
                      </Text>
                    </View>
                    <Switch
                      value={active}
                      onValueChange={() => toggleActive(s)}
                      trackColor={{ true: ACTION, false: Color.border }}
                      thumbColor={Color.white}
                      ios_backgroundColor={Color.border}
                      style={styles.switch}
                    />
                    <TouchableOpacity
                      style={styles.iconBtn}
                      onPress={() => editService(s.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                      accessibilityRole="button"
                      accessibilityLabel={`Edit ${s.name}`}
                    >
                      <Pencil size={20} color={ACTION} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.iconBtn}
                      disabled={deleting}
                      onPress={() => confirmDelete(s.id, s.name)}
                      hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                      accessibilityRole="button"
                      accessibilityLabel={`Delete ${s.name}`}
                    >
                      <Trash2 size={20} color={Color.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
