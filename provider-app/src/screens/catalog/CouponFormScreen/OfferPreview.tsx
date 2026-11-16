import React from 'react';
import { Text, View } from 'react-native';
import { Calendar, Check, Layers, Power, Scissors, ShoppingCart, Users } from 'lucide-react-native';

import { Pill } from '@/components/Pill';
import { CouponScope } from '@/redux/api/business/types';
import { formatDate } from '@/screens/catalog/AllOffersScreen/helpers';
import { PILL } from '@/utils/modernTheme';

import { CouponForm } from './types';
import { META_ICON, styles } from './styles';

const META_ICON_SIZE = 16;

/** "1500" → "1,500"; leaves anything non-numeric as typed. */
function rupees(v: string): string {
  const n = Number(v);
  return v.trim() && Number.isFinite(n) ? `₹${n.toLocaleString('en-IN')}` : `₹${v.trim() || '0'}`;
}

interface OfferPreviewProps {
  form: CouponForm;
  itemScope: CouponScope;
  /** Name of the picked service/product, when the offer targets one. */
  itemName?: string;
}

/**
 * Live "ticket" preview of the offer being edited — same layout as the
 * AllOffersScreen OfferCard (lavender stub + dashed code chip + meta rows),
 * built from the unsaved form values.
 */
export function OfferPreview({ form, itemScope, itemName }: OfferPreviewProps) {
  const value = form.discountValue.trim() || '0';
  const main = form.discountType === 'PERCENT' ? `${value}% OFF` : `${rupees(value)} OFF`;

  const lines: string[] = [];
  if (form.discountType === 'PERCENT' && form.maxDiscount.trim()) {
    lines.push(`up to ${rupees(form.maxDiscount)}`);
  }
  if (form.scope === 'ORDER' && form.minOrder.trim()) {
    lines.push(`above ${rupees(form.minOrder)}`);
  }

  const code = form.code.trim();
  const description = form.description.trim();
  const itemWord = itemScope === 'SERVICE' ? 'service' : 'product';

  let scopeLabel: string;
  let ScopeIcon = ShoppingCart;
  if (form.scope === 'ORDER') {
    scopeLabel = form.minOrder.trim() ? `On orders above ${rupees(form.minOrder)}` : 'On any order';
  } else {
    ScopeIcon = itemScope === 'SERVICE' ? Scissors : Layers;
    scopeLabel = itemName ? `On ${itemName} (${itemWord})` : `Pick a ${itemWord}`;
  }

  const expiry = form.expiresAt ? formatDate(`${form.expiresAt}T23:59:59`) : '';
  const expiryLabel = form.expiresAt ? (expiry ? `Expires ${expiry}` : 'Check the date format') : 'No expiry';
  const usageLabel = form.usageLimit.trim() ? `Up to ${form.usageLimit.trim()} uses` : 'Unlimited uses';

  return (
    <View>
      <Text style={styles.previewLabel}>Preview</Text>
      <View style={styles.ticket}>
        <View style={styles.stub}>
          <Text style={styles.discount} numberOfLines={1} adjustsFontSizeToFit>
            {main}
          </Text>
          {lines.map((l) => (
            <Text key={l} style={styles.cap} numberOfLines={1}>
              {l}
            </Text>
          ))}
          <View style={[styles.stubNotch, styles.stubNotchLeft]} />
          <View style={[styles.stubNotch, styles.stubNotchRight]} />
        </View>

        <View style={styles.details}>
          <View style={styles.detailsTop}>
            <View style={styles.codeChip}>
              <Text style={[styles.code, !code && styles.codePlaceholder]} numberOfLines={1}>
                {code || 'YOURCODE'}
              </Text>
            </View>
            {form.isActive ? (
              <Pill label="Active" colors={PILL.green} icon={<Check size={14} color={PILL.green.fg} strokeWidth={2.2} />} />
            ) : (
              <Pill label="Off" colors={PILL.grey} icon={<Power size={14} color={PILL.grey.fg} strokeWidth={2.2} />} />
            )}
          </View>

          {!!description && (
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          )}

          <View style={styles.metaRow}>
            <ScopeIcon size={META_ICON_SIZE} color={META_ICON} strokeWidth={1.8} />
            <Text style={styles.metaText} numberOfLines={1}>
              {scopeLabel}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Calendar size={META_ICON_SIZE} color={META_ICON} strokeWidth={1.8} />
            <Text style={styles.metaText} numberOfLines={1}>
              {expiryLabel}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Users size={META_ICON_SIZE} color={META_ICON} strokeWidth={1.8} />
            <Text style={styles.metaText} numberOfLines={1}>
              {usageLabel}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
