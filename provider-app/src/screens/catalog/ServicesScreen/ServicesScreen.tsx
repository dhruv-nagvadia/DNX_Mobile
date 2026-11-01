import React from 'react';
import { Alert, RefreshControl, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Plus, Wrench } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { EmptyState } from '@/components/EmptyState';
import { Color } from '@/utils/Theme';
import { formatMoney } from '@/utils/money';

import { useServicesScreen } from './useServicesScreen';
import { styles } from './styles';

function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
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
      <AppHeader
        title="Services"
        right={
          <TouchableOpacity style={styles.addBtn} onPress={addService} accessibilityRole="button">
            <Plus size={18} color={Color.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
      >
        {services.length === 0 && !isLoading ? (
          <EmptyState
            icon={<Wrench size={48} color={Color.placeholder} strokeWidth={1.4} />}
            title="No services yet"
            body="Add one to start taking bookings."
          />
        ) : (
          services.map((s) => (
            <View key={s.id} style={[styles.card, s.isActive === false && styles.cardInactive]}>
              <View style={styles.cardTop}>
                <Text style={styles.name} numberOfLines={1}>
                  {s.name}
                </Text>
                <Switch
                  value={s.isActive !== false}
                  onValueChange={() => toggleActive(s)}
                  trackColor={{ true: Color.primary, false: Color.border }}
                />
              </View>
              <Text style={styles.meta}>{formatDuration(s.durationMin)}</Text>
              <Text style={styles.price}>{formatMoney(s.priceMinor, s.currency)}</Text>

              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => editService(s.id)}>
                  <Text style={styles.actionBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionBtnDanger]}
                  disabled={deleting}
                  onPress={() => confirmDelete(s.id, s.name)}
                >
                  <Text style={[styles.actionBtnText, styles.actionBtnTextDanger]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
