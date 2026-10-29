import React from 'react';
import { Alert, RefreshControl, SafeAreaView, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Plus } from 'lucide-react-native';

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
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Services</Text>
        <TouchableOpacity style={styles.addBtn} onPress={addService} accessibilityRole="button">
          <Plus size={18} color={Color.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
      >
        {services.length === 0 && !isLoading ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No services yet. Add one to start taking bookings.</Text>
          </View>
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
    </SafeAreaView>
  );
}
