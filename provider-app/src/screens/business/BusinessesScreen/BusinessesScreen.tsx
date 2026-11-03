import React from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BadgeCheck,
  Ban,
  Briefcase,
  Check,
  ChevronRight,
  CircleCheck,
  Clock,
  Command,
  Package,
  Plus,
  Search,
  Star,
  Store,
  Tag,
  TriangleAlert,
} from 'lucide-react-native';

import { EmptyState } from '@/components/EmptyState';
import { GradientBackground } from '@/components/GradientBackground';
import { Business } from '@/redux/api/business/types';
import { Color } from '@/utils/Theme';
import { INK, PAGE_BG, PILL, PillColors, TINT } from '@/utils/modernTheme';

import { profileProgress } from './profile';
import { BusinessFilter, useBusinessesScreen } from './useBusinessesScreen';
import { PROGRESS_BLUE, STAR, styles } from './styles';

const FILTERS: { key: BusinessFilter; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'SERVICE', label: 'Services' },
  { key: 'STORE', label: 'Stores' },
];

/** A soft rounded pill — local (not the shared `Pill`) because the mockup's
 * card pills use a larger label than `Pill`'s xs text. */
function CardPill({ label, colors, icon }: { label: string; colors: PillColors; icon: React.ReactNode }) {
  return (
    <View style={[styles.pill, { backgroundColor: colors.bg }]}>
      {icon}
      <Text style={[styles.pillText, { color: colors.fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

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
      {icon}
      <View style={styles.tileText}>
        <Text style={styles.tileLabel} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.tileValue}>{value}</Text>
      </View>
    </View>
  );
}

function BusinessCard({
  business: b,
  onOpen,
  onEdit,
}: {
  business: Business;
  onOpen: () => void;
  onEdit: () => void;
}) {
  const isStore = b.type === 'STORE';
  const itemCount = isStore ? (b.products?.length ?? 0) : b.services.length;
  const itemLabel = `${itemCount} ${isStore ? 'product' : 'service'}${itemCount === 1 ? '' : 's'}`;
  // Subcategory only (falls back to category when there's no subcategory) —
  // matches the web app.
  const categoryName = b.subcategory?.name ?? b.category?.name;
  const { pct, pending } = profileProgress(b);

  const status = b.isBlocked
    ? { label: 'Blocked', colors: PILL.red, Icon: Ban }
    : b.isVerified
      ? { label: 'Verified', colors: PILL.green, Icon: Check }
      : { label: 'Pending', colors: PILL.orange, Icon: Clock };
  const StatusIcon = status.Icon;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onOpen}
      onLongPress={onEdit}
      accessibilityRole="button"
      accessibilityLabel={b.businessName}
      accessibilityHint="Opens the business. Long-press to edit."
      accessibilityActions={[{ name: 'edit', label: 'Edit business' }]}
      onAccessibilityAction={(e) => {
        if (e.nativeEvent.actionName === 'edit') {
          onEdit();
        }
      }}
    >
      <View style={styles.cardTop}>
        {b.images?.[0] ? (
          <Image source={{ uri: b.images[0] }} style={styles.thumb} />
        ) : (
          <View style={styles.thumbFallback}>
            {isStore ? (
              <Store size={26} color={Color.placeholder} />
            ) : (
              <Briefcase size={26} color={Color.placeholder} />
            )}
          </View>
        )}

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {b.businessName}
            </Text>
            {b.isVerified && !b.isBlocked && (
              <BadgeCheck size={20} color={Color.white} fill={PROGRESS_BLUE} strokeWidth={2.2} />
            )}
          </View>
          <View style={styles.metaRow}>
            <Tag size={14} color={Color.textSecondary} />
            <Text style={styles.meta} numberOfLines={1}>
              {[categoryName, b.city].filter(Boolean).join('  •  ')}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Star size={15} color={STAR} fill={STAR} />
            <Text style={styles.ratingValue}>{b.ratingAvg.toFixed(1)}</Text>
            <Text style={styles.meta}>({b.ratingCount})</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.meta} numberOfLines={1}>
              {itemLabel}
            </Text>
          </View>
        </View>

        <ChevronRight size={20} color={INK} />
      </View>

      <View style={[styles.divider, styles.dividerInset]} />

      {pending > 0 && (
        <>
          <View style={styles.progress}>
            <View style={styles.progressRow}>
              <Text style={styles.progressText} numberOfLines={1}>
                {pending} step{pending === 1 ? '' : 's'} left to finish your profile
              </Text>
              <Text style={styles.progressText}>{pct}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${pct}%` }]} />
            </View>
          </View>
          <View style={styles.divider} />
        </>
      )}

      <View style={styles.pillRow}>
        <CardPill
          label={status.label}
          colors={status.colors}
          icon={<StatusIcon size={16} color={status.colors.fg} strokeWidth={2.4} />}
        />
        {isStore ? (
          <CardPill label="Store" colors={PILL.blue} icon={<Package size={16} color={PILL.blue.fg} />} />
        ) : (
          <CardPill
            label="Service"
            colors={PILL.lavender}
            icon={<Command size={16} color={PILL.lavender.fg} />}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function BusinessesScreen() {
  const insets = useSafeAreaInsets();
  const {
    businesses,
    filtered,
    counts,
    query,
    setQuery,
    filter,
    setFilter,
    isLoading,
    refreshing,
    refresh,
    openBusiness,
    addBusiness,
    editBusiness,
  } = useBusinessesScreen();

  const hasBusinesses = businesses.length > 0;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>
            My Businesses
          </Text>
          <Text style={styles.subtitle}>
            {businesses.length} business{businesses.length === 1 ? '' : 'es'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={addBusiness}
          accessibilityRole="button"
          accessibilityLabel="Add a business"
        >
          <Plus size={28} color={Color.white} strokeWidth={2.4} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
      >
        {!hasBusinesses && !isLoading ? (
          <EmptyState
            icon={<Briefcase size={48} color={Color.placeholder} strokeWidth={1.4} />}
            title="No businesses yet"
            body="Add your first business to start taking bookings or orders."
          />
        ) : (
          hasBusinesses && (
            <>
              <View style={styles.search}>
                <Search size={20} color={INK} />
                <TextInput
                  style={styles.searchInput}
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search businesses..."
                  placeholderTextColor={Color.placeholder}
                  returnKeyType="search"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                />
              </View>

              <View style={styles.chips}>
                {FILTERS.map((f) => {
                  const active = filter === f.key;
                  return (
                    <TouchableOpacity
                      key={f.key}
                      style={[styles.chip, active && styles.chipActive]}
                      onPress={() => setFilter(f.key)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                    >
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.tiles}>
                <SummaryTile
                  label="Verified"
                  value={counts.verified}
                  theme={TINT.mint}
                  icon={<CircleCheck size={30} color={TINT.mint.icon} strokeWidth={1.8} />}
                />
                <SummaryTile
                  label="Pending"
                  value={counts.pending}
                  theme={TINT.peach}
                  icon={<Clock size={30} color={TINT.peach.icon} strokeWidth={1.8} />}
                />
                <SummaryTile
                  label="Blocked"
                  value={counts.blocked}
                  theme={TINT.pink}
                  icon={<TriangleAlert size={30} color={TINT.pink.icon} strokeWidth={1.8} />}
                />
              </View>

              {filtered.length === 0 ? (
                <Text style={styles.noMatch}>No businesses match</Text>
              ) : (
                filtered.map((b) => (
                  <BusinessCard
                    key={b.id}
                    business={b}
                    onOpen={() => openBusiness(b.id)}
                    onEdit={() => editBusiness(b.id)}
                  />
                ))
              )}
            </>
          )
        )}

        {hasBusinesses && (
          <TouchableOpacity
            style={styles.addCard}
            onPress={addBusiness}
            accessibilityRole="button"
            accessibilityLabel="Add a new business"
          >
            <Store size={34} color={PROGRESS_BLUE} strokeWidth={1.8} />
            <Text style={styles.addCardText}>+ Add a new business</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
