import React, { useEffect, useState } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import { DimensionValue, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, Check, CircleX, Copy, Pencil, Power, Timer, Trash2, Users } from 'lucide-react-native';

import { Pill } from '@/components/Pill';
import { Coupon } from '@/redux/api/business/types';
import { CouponState, CouponStatus } from '@/screens/catalog/CouponsScreen/useCouponsScreen';
import { Color } from '@/utils/Theme';
import { INK, PILL, PillColors } from '@/utils/modernTheme';

import { businessColor, discountParts, expiryLabel, scopeRow } from './helpers';
import { BRAND_BLUE, META_ICON, SWITCH_OFF, styles } from './styles';

const HIT_SLOP = { top: 4, bottom: 4, left: 4, right: 4 };
const META_ICON_SIZE = 16;

const STATUS_LABEL: Record<CouponStatus, string> = {
  active: 'Active',
  off: 'Off',
  expired: 'Expired',
  usedUp: 'Used up',
};

function statusPill(status: CouponStatus): { colors: PillColors; Icon: typeof Check } {
  switch (status) {
    case 'active':
      return { colors: PILL.green, Icon: Check };
    case 'expired':
      return { colors: PILL.red, Icon: CircleX };
    case 'usedUp':
      return { colors: PILL.orange, Icon: Users };
    default:
      return { colors: PILL.grey, Icon: Power };
  }
}

/** Small "● Business" pill — same dot colour as the business chip. */
export function BusinessPill({ id, name }: { id: string; name: string }) {
  return (
    <View style={styles.businessPill}>
      <View style={[styles.dot, { backgroundColor: businessColor(id) }]} />
      <Text style={styles.businessPillText} numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
}

/** Dashed code chip with a copy button ("✓ Copied" for 1.5s after tapping). */
function CodeChip({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) {
      return;
    }
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <TouchableOpacity
      style={styles.codeChip}
      onPress={() => {
        Clipboard.setString(code);
        setCopied(true);
      }}
      accessibilityRole="button"
      accessibilityLabel={`Copy code ${code}`}
    >
      <Text selectable style={styles.code} numberOfLines={1}>
        {code}
      </Text>
      {copied ? (
        <View style={styles.copiedRow}>
          <Check size={14} color={PILL.green.fg} strokeWidth={2.4} />
          <Text style={styles.copiedText}>Copied</Text>
        </View>
      ) : (
        <Copy size={16} color={INK} />
      )}
    </TouchableOpacity>
  );
}

interface OfferCardProps {
  coupon: Coupon;
  state: CouponState;
  deleting: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function OfferCard({ coupon: c, state, deleting, onToggle, onEdit, onDelete }: OfferCardProps) {
  const { status, expiringSoon } = state;
  const { main, lines } = discountParts(c);
  const scope = scopeRow(c);
  const ScopeIcon = scope.Icon;
  const pill = statusPill(status);
  const StatusIcon = pill.Icon;
  const description = c.description?.trim();
  const limit = c.usageLimit;
  const usedPct: DimensionValue =
    limit != null && limit > 0 ? `${Math.min(100, Math.round((c.usedCount / limit) * 100))}%` : '0%';

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.stub}>
          <View style={styles.stubText}>
            <Text style={styles.discount} numberOfLines={1} adjustsFontSizeToFit>
              {main}
            </Text>
            {lines.map((l) => (
              <Text key={l} style={styles.cap} numberOfLines={1}>
                {l}
              </Text>
            ))}
          </View>
          {!!c.provider && <BusinessPill id={c.provider.id} name={c.provider.businessName} />}
          <View style={[styles.stubNotch, styles.stubNotchLeft]} />
          <View style={[styles.stubNotch, styles.stubNotchRight]} />
        </View>

        <View style={styles.details}>
          <View style={styles.detailsTop}>
            <CodeChip code={c.code} />
            <View style={styles.pills}>
              <Pill
                label={STATUS_LABEL[status]}
                colors={pill.colors}
                icon={<StatusIcon size={14} color={pill.colors.fg} strokeWidth={2.2} />}
              />
              {expiringSoon && (
                <Pill
                  label="Expiring soon"
                  colors={PILL.orange}
                  icon={<Timer size={14} color={PILL.orange.fg} strokeWidth={2.2} />}
                />
              )}
            </View>
          </View>

          {!!description && <Text style={styles.description}>{description}</Text>}

          <View style={styles.metaList}>
            <View style={styles.metaRow}>
              <ScopeIcon size={META_ICON_SIZE} color={META_ICON} strokeWidth={1.8} />
              <Text style={styles.metaText} numberOfLines={1}>
                {scope.label}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Calendar size={META_ICON_SIZE} color={META_ICON} strokeWidth={1.8} />
              <Text style={styles.metaText} numberOfLines={1}>
                {expiryLabel(c, status)}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Users size={META_ICON_SIZE} color={META_ICON} strokeWidth={1.8} />
              {limit != null ? (
                <>
                  <Text style={styles.usageText} numberOfLines={1}>
                    {c.usedCount} / {limit} used
                  </Text>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: usedPct }]} />
                  </View>
                </>
              ) : (
                <Text style={styles.metaText} numberOfLines={1}>
                  {c.usedCount} used • Unlimited
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Ticket perforation: dashed rule with half-circle notches cut into both edges. */}
      <View style={styles.perforation}>
        <View style={styles.dashClip}>
          <View style={styles.dash} />
        </View>
        <View style={[styles.notch, styles.notchLeft]} />
        <View style={[styles.notch, styles.notchRight]} />
      </View>

      <View style={styles.footer}>
        <View style={styles.toggleRow}>
          <Switch
            value={c.isActive}
            onValueChange={onToggle}
            disabled={!c.provider}
            trackColor={{ true: BRAND_BLUE, false: SWITCH_OFF }}
            thumbColor={Color.white}
            ios_backgroundColor={SWITCH_OFF}
            accessibilityLabel={`${c.code} active`}
          />
          <Text style={styles.toggleLabel}>{c.isActive ? 'Active' : 'Off'}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={onEdit}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${c.code}`}
          >
            <Pencil size={19} color={BRAND_BLUE} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            disabled={deleting}
            onPress={onDelete}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${c.code}`}
          >
            <Trash2 size={19} color={PILL.red.fg} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
