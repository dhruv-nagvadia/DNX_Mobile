import React from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, CircleCheck, Clock, Plus, Search, Store, Ticket, Users } from 'lucide-react-native';

import { GradientBackground } from '@/components/GradientBackground';
import { Coupon } from '@/redux/api/business/types';
import { CouponFilter } from '@/screens/catalog/CouponsScreen/useCouponsScreen';
import { Color, Spacing } from '@/utils/Theme';
import { INK, PAGE_BG, TINT } from '@/utils/modernTheme';

import { ChooseBusinessSheet } from './ChooseBusinessSheet';
import { OfferCard } from './OfferCard';
import { businessColor } from './helpers';
import { styles } from './styles';
import { ALL_BUSINESSES, useAllOffersScreen } from './useAllOffersScreen';

const BACK_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

const FILTERS: { key: CouponFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'off', label: 'Off' },
  { key: 'expired', label: 'Expired' },
  { key: 'usedUp', label: 'Used up' },
];

function SummaryTile({
  label,
  value,
  theme,
  icon,
}: {
  label: string;
  value: number;
  theme: (typeof TINT)[keyof typeof TINT];
  icon: React.ReactNode;
}) {
  return (
    <View style={[styles.tile, { borderColor: theme.border }]}>
      <GradientBackground colors={theme.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <View style={styles.tileIcon}>{icon}</View>
      <View style={styles.tileText}>
        <Text style={styles.tileLabel} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.tileValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function EmptyCard({
  icon,
  title,
  body,
  actionLabel,
  onAction,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <View style={styles.emptyCard}>
      <View style={styles.emptyIcon}>{icon}</View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
      <TouchableOpacity style={styles.primaryBtn} onPress={onAction} accessibilityRole="button">
        <Text style={styles.primaryBtnText}>{actionLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

function Chip({
  label,
  selected,
  dotColor,
  onPress,
}: {
  label: string;
  selected: boolean;
  dotColor?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipActive]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      {!!dotColor && <View style={[styles.dot, selected && styles.dotOnActive, { backgroundColor: dotColor }]} />}
      <Text style={[styles.chipText, selected && styles.chipTextActive]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function AllOffersScreen() {
  const insets = useSafeAreaInsets();
  const {
    coupons,
    scoped,
    filtered,
    states,
    counts,
    businesses,
    businessChips,
    businessFilter,
    setBusinessFilter,
    selectedBusinessName,
    query,
    setQuery,
    filter,
    setFilter,
    isLoading,
    refreshing,
    refresh,
    deleting,
    toggleActive,
    remove,
    editCoupon,
    startCreate,
    sheetOpen,
    closeSheet,
    chooseBusiness,
    goBack,
    goToBusinesses,
  } = useAllOffersScreen();

  const countLabel = `${scoped.length} offer${scoped.length === 1 ? '' : 's'}`;
  const noBusinesses = !isLoading && businesses.length === 0 && coupons.length === 0;
  const noCoupons = !isLoading && !noBusinesses && coupons.length === 0;
  const showList = coupons.length > 0;

  const confirmDelete = (coupon: Coupon) => {
    Alert.alert('Delete coupon?', `"${coupon.code}" will stop working immediately.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(coupon) },
    ]);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={goBack}
          hitSlop={BACK_HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={26} color={INK} strokeWidth={2.2} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>
            Offers
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {`${selectedBusinessName ?? 'All businesses'}  •  ${countLabel}`}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={startCreate}
          accessibilityRole="button"
          accessibilityLabel="Create an offer"
        >
          <Plus size={28} color={Color.white} strokeWidth={2.4} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + Spacing.xl }]}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
      >
        {noBusinesses && (
          <EmptyCard
            icon={<Store size={34} color={TINT.lavender.icon} strokeWidth={1.6} />}
            title="Add a business first"
            body="Offers belong to a business. Add your salon or store, then create offers for it."
            actionLabel="Add a business"
            onAction={goToBusinesses}
          />
        )}

        {noCoupons && (
          <EmptyCard
            icon={<Ticket size={34} color={TINT.lavender.icon} strokeWidth={1.6} />}
            title="No offers yet"
            body="Run a promo with a discount code your customers can apply at checkout."
            actionLabel="Create your first offer"
            onAction={startCreate}
          />
        )}

        {showList && (
          <>
            <View style={styles.search}>
              <Search size={20} color={INK} />
              <TextInput
                style={styles.searchInput}
                value={query}
                onChangeText={setQuery}
                placeholder="Search code, description or business..."
                placeholderTextColor={Color.placeholder}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipsScroll}
              contentContainerStyle={styles.chips}
            >
              <Chip
                label="All businesses"
                selected={businessFilter === ALL_BUSINESSES}
                onPress={() => setBusinessFilter(ALL_BUSINESSES)}
              />
              {businessChips.map((b) => (
                <Chip
                  key={b.id}
                  label={b.name}
                  dotColor={businessColor(b.id)}
                  selected={businessFilter === b.id}
                  onPress={() => setBusinessFilter(b.id)}
                />
              ))}
            </ScrollView>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipsScroll}
              contentContainerStyle={styles.chips}
            >
              {FILTERS.map((f) => (
                <Chip key={f.key} label={f.label} selected={filter === f.key} onPress={() => setFilter(f.key)} />
              ))}
            </ScrollView>

            <View style={styles.tiles}>
              <SummaryTile
                label="Active"
                value={counts.active}
                theme={TINT.mint}
                icon={<CircleCheck size={30} color={TINT.mint.icon} strokeWidth={1.8} />}
              />
              <SummaryTile
                label="Expiring soon"
                value={counts.expiringSoon}
                theme={TINT.peach}
                icon={<Clock size={30} color={TINT.peach.icon} strokeWidth={1.8} />}
              />
              <SummaryTile
                label="Times used"
                value={counts.timesUsed}
                theme={TINT.lavender}
                icon={<Users size={30} color={TINT.lavender.icon} strokeWidth={1.8} />}
              />
            </View>

            {filtered.length === 0 ? (
              <Text style={styles.noMatch}>No offers match</Text>
            ) : (
              filtered.map((c) => {
                const state = states.get(c.id);
                if (!state) {
                  return null;
                }
                return (
                  <OfferCard
                    key={c.id}
                    coupon={c}
                    state={state}
                    deleting={deleting}
                    onToggle={() => toggleActive(c)}
                    onEdit={() => editCoupon(c)}
                    onDelete={() => confirmDelete(c)}
                  />
                );
              })
            )}
          </>
        )}
      </ScrollView>

      <ChooseBusinessSheet
        visible={sheetOpen}
        businesses={businesses}
        initialId={businessFilter === ALL_BUSINESSES ? undefined : businessFilter}
        onClose={closeSheet}
        onContinue={chooseBusiness}
      />
    </View>
  );
}
