import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Bell } from 'lucide-react-native';

import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { Color } from '@/utils/Theme';
import { AppConfig } from '@/utils/Constants';

import { useProfileScreen } from './useProfileScreen';
import { styles } from './styles';

export default function ProfileScreen() {
  const {
    currentUser,
    businesses,
    stats,
    unreadCount,
    editing,
    form,
    onChange,
    error,
    saving,
    startEdit,
    cancelEdit,
    save,
    logout,
    goToBusiness,
    goToNotifications,
  } = useProfileScreen();

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.bellBtn} onPress={goToNotifications} accessibilityRole="button">
            <Bell size={18} color={Color.textPrimary} />
            {unreadCount > 0 && <View style={styles.bellDot} />}
          </TouchableOpacity>
        </View>

        <View style={styles.statGrid}>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>{stats.businessCount}</Text>
            <Text style={styles.statLabel}>Businesses</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>{stats.services}</Text>
            <Text style={styles.statLabel}>Services</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>{stats.products}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>{stats.avgRating ? stats.avgRating.toFixed(1) : '—'}</Text>
            <Text style={styles.statLabel}>Avg rating</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Account details</Text>
            {!editing && (
              <TouchableOpacity onPress={startEdit}>
                <Text style={styles.editLink}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          {editing ? (
            <>
              {!!error && <Text style={styles.errorText}>{error}</Text>}
              <AppInput
                label="Full name"
                dense
                value={form.fullName}
                onChangeText={(v) => onChange('fullName', v)}
              />
              <AppInput
                label="Email"
                dense
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(v) => onChange('email', v)}
              />
              <View style={styles.editActions}>
                <AppButton style={styles.editButton} title="Cancel" variant="secondary" onPress={cancelEdit} />
                <AppButton style={styles.editButton} title="Save" loading={saving} onPress={save} />
              </View>
            </>
          ) : (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Full name</Text>
                <Text style={styles.detailValue}>{currentUser?.fullName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{currentUser?.email}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Account type</Text>
                <Text style={styles.detailValue}>Provider</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your businesses</Text>
          {businesses.length === 0 ? (
            <Text style={styles.emptyText}>No businesses yet.</Text>
          ) : (
            businesses.map((b, i) => (
              <TouchableOpacity
                key={b.id}
                style={[styles.businessRow, i === 0 && styles.businessRowFirst]}
                onPress={() => goToBusiness(b.id)}
              >
                <View>
                  <Text style={styles.businessName}>{b.businessName}</Text>
                  <Text style={styles.businessMeta}>{b.category.name}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.logoutRow} onPress={logout} accessibilityRole="button">
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>DNX Provider v{AppConfig.version}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
