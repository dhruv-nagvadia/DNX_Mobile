import React from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock,
  CreditCard,
  Flame,
  House,
  Pencil,
  Plus,
  Search,
  Tag,
  Trash2,
  Wrench,
} from 'lucide-react-native';

import { EmptyState } from '@/components/EmptyState';
import { GradientBackground } from '@/components/GradientBackground';
import { Service } from '@/redux/api/business/types';
import { Color } from '@/utils/Theme';
import { INK, PAGE_BG, PILL, TINT } from '@/utils/modernTheme';
import { formatMoney } from '@/utils/money';
import { serviceIcon } from '@/utils/serviceIcon';

import { FILTERS, ServiceStats, useServicesScreen } from './useServicesScreen';
import { BRAND_BLUE, FLAME, ICON_LAVENDER, SWITCH_OFF, TAG, styles } from './styles';

const HIT_SLOP = { top: 4, bottom: 4, left: 4, right: 4 };

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

const bookingsLabel = (n: number) => `${n.toLocaleString('en-IN')} booking${n === 1 ? '' : 's'}`;

/** "Hair Cut & Styling" → "Hair Cut" — keeps the tile to one short line. */
const shortName = (name: string) => name.trim().split(/\s+/).slice(0, 2).join(' ');

function SummaryTile({
  theme,
  icon,
  wide,
  children,
}: {
  theme: (typeof TINT)[keyof typeof TINT];
  icon: React.ReactNode;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.tile, wide && styles.tileWide, { borderColor: theme.border }]}>
      <GradientBackground colors={theme.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <View style={styles.tileIcon}>{icon}</View>
      <View style={styles.tileText}>{children}</View>
    </View>
  );
}

function ServiceCard({
  service: s,
  stats,
  deleting,
  onToggle,
  onEdit,
  onOpen,
  onDelete,
}: {
  service: Service;
  stats: ServiceStats;
  deleting: boolean;
  onToggle: () => void;
  onEdit: () => void;
  /** Opens the details screen (whole card is the tap target). */
  onOpen: () => void;
  onDelete: () => void;
}) {
  const active = s.isActive !== false;
  const Icon = serviceIcon(s.name);
  const description = s.description?.trim();

  return (
    <TouchableOpacity style={styles.card} onPress={onOpen} activeOpacity={0.85} accessibilityRole="button">
      <View style={styles.cardTop}>
        <View style={styles.cardMain}>
          <View style={styles.iconBox}>
            <Icon size={30} color={ICON_LAVENDER} strokeWidth={1.6} />
          </View>
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={2}>
              {s.name}
            </Text>
            {!!description && (
              <Text style={styles.desc} numberOfLines={1}>
                {description}
              </Text>
            )}
            <View style={styles.metaRow}>
              <Clock size={18} color={INK} strokeWidth={1.8} />
              <Text style={styles.duration}>{formatDuration(s.durationMin)}</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.price}>{formatMoney(s.priceMinor, s.currency)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.side}>
          <Switch
            value={active}
            onValueChange={onToggle}
            trackColor={{ true: BRAND_BLUE, false: SWITCH_OFF }}
            thumbColor={Color.white}
            ios_backgroundColor={SWITCH_OFF}
            style={styles.switch}
            accessibilityLabel={`${s.name} active`}
          />
          <View style={styles.sideBtns}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={onEdit}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel={`Edit ${s.name}`}
            >
              <Pencil size={18} color={BRAND_BLUE} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              disabled={deleting}
              onPress={onDelete}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel={`Delete ${s.name}`}
            >
              <Trash2 size={18} color={PILL.red.fg} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <View style={styles.stats}>
          <CalendarDays size={20} color={INK} strokeWidth={1.7} />
          <Text style={styles.statsText} numberOfLines={1}>
            {`${bookingsLabel(stats.count)}  •  ${formatMoney(stats.revenueMinor, s.currency)}`}
          </Text>
        </View>
        {(s.travelRequired || s.partialPayEnabled) && (
          <View style={styles.featureChips}>
            {s.travelRequired && (
              <View style={styles.homeChip}>
                <House size={14} color={PILL.blue.fg} strokeWidth={2} />
                <Text style={styles.homeChipText}>Home visit</Text>
              </View>
            )}
            {s.partialPayEnabled && (
              <View style={styles.partialChip}>
                <CreditCard size={14} color={INK} strokeWidth={1.8} />
                <Text style={styles.partialChipText}>Partial pay</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();
  const {
    businessName,
    services,
    filtered,
    summary,
    statsFor,
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
    goBack,
    addService,
    editService,
    openService,
  } = useServicesScreen();

  const hasServices = services.length > 0;
  const countLabel = `${services.length} service${services.length === 1 ? '' : 's'}`;

  const confirmDelete = (serviceId: string, name: string) => {
    Alert.alert('Delete service?', `"${name}" will no longer be bookable.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(serviceId) },
    ]);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={goBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={26} color={INK} strokeWidth={2.2} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>
            Services
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {businessName ? `${businessName}  •  ${countLabel}` : countLabel}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={addService}
          accessibilityRole="button"
          accessibilityLabel="Add a service"
        >
          <Plus size={28} color={Color.white} strokeWidth={2.4} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
      >
        {!hasServices && !isLoading ? (
          <EmptyState
            icon={<Wrench size={48} color={Color.placeholder} strokeWidth={1.4} />}
            title="No services yet"
            body="Add one to start taking bookings."
          />
        ) : (
          hasServices && (
            <>
              <View style={styles.search}>
                <Search size={20} color={INK} />
                <TextInput
                  style={styles.searchInput}
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search services..."
                  placeholderTextColor={Color.placeholder}
                  returnKeyType="search"
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
                {FILTERS.map((c) => {
                  const selected = filter === c.key;
                  return (
                    <TouchableOpacity
                      key={c.key}
                      style={[styles.chip, selected && styles.chipActive]}
                      onPress={() => setFilter(c.key)}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextActive]}>{c.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={styles.tiles}>
                <SummaryTile theme={TINT.mint} icon={<Check size={24} color={TINT.mint.icon} strokeWidth={2.2} />}>
                  <Text style={styles.tileLabel} numberOfLines={1}>
                    Active
                  </Text>
                  <Text style={styles.tileValue}>{summary.activeCount}</Text>
                </SummaryTile>
                <SummaryTile
                  wide
                  theme={TINT.lavender}
                  icon={<Flame size={24} color={FLAME} strokeWidth={1.8} />}
                >
                  <Text style={styles.tileLabel} numberOfLines={1}>
                    Most booked
                  </Text>
                  {summary.mostBooked ? (
                    <>
                      <Text style={styles.tileName} numberOfLines={1}>
                        {shortName(summary.mostBooked.service.name)}
                      </Text>
                      <Text style={styles.tileSub} numberOfLines={1}>
                        {bookingsLabel(summary.mostBooked.count)}
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.tileValue}>—</Text>
                  )}
                </SummaryTile>
                <SummaryTile theme={TINT.peach} icon={<Tag size={24} color={TAG} strokeWidth={1.8} />}>
                  <Text style={styles.tileLabel} numberOfLines={1}>
                    Avg. price
                  </Text>
                  <Text style={styles.tileValue} numberOfLines={1} adjustsFontSizeToFit>
                    {summary.avgPriceMinor === null ? '—' : formatMoney(summary.avgPriceMinor, summary.avgCurrency)}
                  </Text>
                </SummaryTile>
              </View>

              {filtered.length === 0 ? (
                <Text style={styles.noMatch}>No services match</Text>
              ) : (
                filtered.map((s) => (
                  <ServiceCard
                    key={s.id}
                    service={s}
                    stats={statsFor(s)}
                    deleting={deleting}
                    onToggle={() => toggleActive(s)}
                    onEdit={() => editService(s.id)}
                    onOpen={() => openService(s.id)}
                    onDelete={() => confirmDelete(s.id, s.name)}
                  />
                ))
              )}
            </>
          )
        )}
      </ScrollView>
    </View>
  );
}
