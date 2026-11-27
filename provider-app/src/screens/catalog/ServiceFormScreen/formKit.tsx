import React, { ReactNode, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, CircleAlert, LucideIcon } from 'lucide-react-native';

import { Color, Spacing } from '@/utils/Theme';
import { INK, LINK, PAGE_BG, PILL, PillColors } from '@/utils/modernTheme';

import { SWITCH_OFF, kit } from './formKitStyles';

/**
 * Building blocks shared by the redesigned Add/Edit form screens
 * (ServiceFormScreen, ProductFormScreen, CouponFormScreen): light header,
 * section cards, labelled 48px fields, segmented control, chips, toggle rows
 * and the sticky bottom action bar.
 */

const BACK_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

// ── Header ────────────────────────────────────────────────────────────────

export function FormHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  return (
    <View style={[kit.header, { paddingTop: insets.top + Spacing.md }]}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
      <TouchableOpacity
        style={kit.backBtn}
        onPress={() => navigation.goBack()}
        hitSlop={BACK_HIT_SLOP}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <ArrowLeft size={22} color={INK} strokeWidth={2.2} />
      </TouchableOpacity>
      <View style={kit.headerText}>
        <Text style={kit.title} numberOfLines={1}>
          {title}
        </Text>
        {!!subtitle && (
          <Text style={kit.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
}

// ── Section card ──────────────────────────────────────────────────────────


interface SectionCardProps {
  title: string;
  subtitle?: string;
  Icon: LucideIcon;
  tint: PillColors;
  /** Draw a line under the header row, separating it from the fields below. */
  divided?: boolean;
  children: ReactNode;
}

export function SectionCard({ title, subtitle, Icon, tint, divided, children }: SectionCardProps) {
  return (
    <View style={kit.card}>
      <View style={[kit.cardHeader, divided && kit.cardHeaderDivided]}>
        <View style={[kit.iconBox, { backgroundColor: tint.bg }]}>
          <Icon size={20} color={tint.fg} strokeWidth={2} />
        </View>
        <View style={kit.cardHeaderText}>
          <Text style={kit.cardTitle}>{title}</Text>
          {!!subtitle && <Text style={kit.cardSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {children}
    </View>
  );
}

// ── Field ─────────────────────────────────────────────────────────────────

interface FieldProps extends TextInputProps {
  label: string;
  /** Shows a grey "Optional" tag next to the label. */
  optional?: boolean;
  hint?: string;
  /** Red border (the screen-level error points at this field). */
  invalid?: boolean;
  error?: string;
  prefix?: string;
  suffix?: ReactNode;
}

export function Field({
  label,
  optional,
  hint,
  invalid,
  error,
  prefix,
  suffix,
  multiline,
  style,
  onFocus,
  onBlur,
  ...rest
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  const bad = invalid || !!error;
  return (
    <View style={kit.field}>
      <View style={kit.labelRow}>
        <Text style={kit.label}>{label}</Text>
        {optional && <Text style={kit.optional}>Optional</Text>}
      </View>
      <View
        style={[
          kit.inputRow,
          multiline && kit.inputRowMultiline,
          focused && kit.inputRowFocused,
          bad && kit.inputRowInvalid,
        ]}
      >
        {!!prefix && <Text style={kit.prefix}>{prefix}</Text>}
        <TextInput
          style={[kit.input, multiline && kit.inputMultiline, style]}
          placeholderTextColor={Color.placeholder}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          accessibilityLabel={label}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {typeof suffix === 'string' ? <Text style={kit.suffix}>{suffix}</Text> : suffix}
      </View>
      {!!error && <Text style={kit.errorText}>{error}</Text>}
      {!error && !!hint && <Text style={kit.hint}>{hint}</Text>}
    </View>
  );
}

/** Plain label for controls that aren't text inputs (segments, chips). */
export function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <View style={kit.labelRow}>
      <Text style={kit.label}>{label}</Text>
      {!!hint && <Text style={kit.optional}>{hint}</Text>}
    </View>
  );
}

// ── Segmented control ─────────────────────────────────────────────────────

interface SegmentedProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function Segmented<T extends string>({ options, value, onChange }: SegmentedProps<T>) {
  return (
    <View style={kit.segment} accessibilityRole="radiogroup">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <TouchableOpacity
            key={o.value}
            style={[kit.segmentBtn, active && kit.segmentBtnActive]}
            onPress={() => onChange(o.value)}
            activeOpacity={0.8}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
          >
            <Text style={[kit.segmentText, active && kit.segmentTextActive]} numberOfLines={1}>
              {o.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── Chips ─────────────────────────────────────────────────────────────────

export function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[kit.chip, active && kit.chipActive]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[kit.chipText, active && kit.chipTextActive]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/** Wrapping row of chips. */
export function ChipRow({ children }: { children: ReactNode }) {
  return <View style={kit.chips}>{children}</View>;
}

/** Horizontally scrolling chip row that bleeds to the card edges. */
export function ChipScroller({ children }: { children: ReactNode }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      style={kit.chipsScroll}
      contentContainerStyle={kit.chipsScrollContent}
    >
      {children}
    </ScrollView>
  );
}

// ── Toggle row ────────────────────────────────────────────────────────────

interface ToggleRowProps {
  title: string;
  hint?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled?: boolean;
  /** Hairline above the row, when it follows another row in the same card. */
  divider?: boolean;
}

export function ToggleRow({ title, hint, value, onValueChange, disabled, divider }: ToggleRowProps) {
  return (
    <View style={[kit.toggleRow, divider && kit.toggleDivider]}>
      <View style={kit.toggleText}>
        <Text style={kit.toggleTitle}>{title}</Text>
        {!!hint && <Text style={kit.toggleHint}>{hint}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ true: LINK, false: SWITCH_OFF }}
        thumbColor={Color.white}
        ios_backgroundColor={SWITCH_OFF}
        accessibilityLabel={title}
      />
    </View>
  );
}

// ── Bottom action bar ─────────────────────────────────────────────────────

interface ActionBarProps {
  label: string;
  onPress: () => void;
  loading: boolean;
  error?: string | null;
}

export function ActionBar({ label, onPress, loading, error }: ActionBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[kit.bar, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
      {!!error && (
        <View style={kit.banner} accessibilityRole="alert">
          <CircleAlert size={18} color={PILL.red.fg} strokeWidth={2} />
          <Text style={kit.bannerText}>{error}</Text>
        </View>
      )}
      <View style={kit.barButtons}>
        <TouchableOpacity
          style={[kit.primaryBtn, loading && kit.primaryBtnDisabled]}
          onPress={onPress}
          disabled={loading}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityState={{ disabled: loading, busy: loading }}
        >
          {loading ? <ActivityIndicator color={Color.white} /> : <Text style={kit.primaryText}>{label}</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}
