import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Check,
  ChevronDown,
  Command,
  CreditCard,
  Image as ImageIcon,
  Info,
  Layers,
  LocateFixed,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  X,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import { GradientBackground } from '@/components/GradientBackground';
import { Pill } from '@/components/Pill';
import { Color, Spacing } from '@/utils/Theme';
import { INK, LINK, PILL, TINT } from '@/utils/modernTheme';

import { DEPOSIT_MAX, DEPOSIT_MIN, MAX_PHOTOS, useBusinessCreateScreen } from './useBusinessCreateScreen';
import { BusinessCreateStepId } from './types';
import { categoryIcon } from './categoryIcon';
import { DoneView } from './DoneView';
import { Field } from './Field';
import { BRAND_BLUE, COVER_PILL, SWITCH_TRACK, styles } from './styles';

const DESCRIPTION_MAX_LENGTH = 500;
const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const TINTS = Object.values(TINT);

const STEP_LABEL: Record<BusinessCreateStepId, string> = {
  type: 'Business type',
  details: 'Details',
  payments: 'Payments',
  photos: 'Photos',
  location: 'Location',
};

interface TypeCardProps {
  icon: LucideIcon;
  title: string;
  sub: string;
  selected: boolean;
  onPress: () => void;
}

function TypeCard({ icon: Icon, title, sub, selected, onPress }: TypeCardProps) {
  return (
    <TouchableOpacity
      style={[styles.typeCard, selected && styles.typeCardOn]}
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <Icon size={30} color={selected ? BRAND_BLUE : INK} strokeWidth={1.8} />
      <View style={styles.typeBody}>
        <Text style={styles.typeTitle}>{title}</Text>
        <Text style={styles.typeSub}>{sub}</Text>
      </View>
      {selected && (
        <View style={styles.checkBadge}>
          <Check size={18} color={Color.white} strokeWidth={3} />
        </View>
      )}
    </TouchableOpacity>
  );
}

interface PayCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  value: boolean;
  onValueChange?: (v: boolean) => void;
  alwaysOn?: boolean;
  children?: React.ReactNode;
}

function PayCard({ icon: Icon, title, desc, value, onValueChange, alwaysOn, children }: PayCardProps) {
  return (
    <View style={styles.payCard}>
      <View style={styles.payIcon}>
        <Icon size={28} color={INK} strokeWidth={1.7} />
      </View>
      <View style={styles.payBody}>
        <View style={styles.payTitleRow}>
          <Text style={styles.payTitle}>{title}</Text>
          {alwaysOn && <Pill label="Always on" colors={PILL.grey} style={styles.alwaysOnPill} />}
        </View>
        <Text style={styles.payDesc}>{desc}</Text>
        {children}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={alwaysOn}
        trackColor={SWITCH_TRACK}
        thumbColor={Color.white}
        ios_backgroundColor={SWITCH_TRACK.false}
      />
    </View>
  );
}

export default function BusinessCreateScreen() {
  const insets = useSafeAreaInsets();
  const {
    step,
    stepId,
    steps,
    isLastStep,
    next,
    back,
    close,
    form,
    onChange,
    pinMatch,
    autoFilled,
    locationSaved,
    locating,
    locateMe,
    setType,
    setCategory,
    categoriesForType,
    categoriesLoading,
    subcategories,
    errors,
    serverError,
    saving,
    submit,
    depositValue,
    changeDeposit,
    photos,
    addPhotos,
    removePhoto,
    created,
    goToBusiness,
    goToCatalog,
    goToHours,
    goToPhotos,
    backToList,
  } = useBusinessCreateScreen();

  const isStore = form.type === 'STORE';
  const isFirstStep = step === 0;

  // Android hardware back follows the header: previous step, or ✕ on step 1.
  useEffect(() => {
    if (created) {
      return;
    }
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (saving) {
        return true;
      }
      if (step > 0) {
        back();
      } else {
        close();
      }
      return true;
    });
    return () => sub.remove();
  }, [created, saving, step, back, close]);

  // ── Done (step 6) ───────────────────────────────────────────────────────
  if (created) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" backgroundColor={Color.white} />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={backToList}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel="Back to My Businesses"
          >
            <ArrowLeft size={26} color={INK} strokeWidth={2.2} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Add business</Text>
          </View>
        </View>

        <DoneView
          business={created}
          isStore={(created.type ?? form.type) === 'STORE'}
          onCatalog={goToCatalog}
          onHours={goToHours}
          onPhotos={goToPhotos}
        />

        <View style={[styles.footerStack, { paddingBottom: insets.bottom + Spacing.sm }]}>
          <TouchableOpacity
            style={[styles.primaryBtn, styles.primaryBtnFull]}
            onPress={goToBusiness}
            accessibilityRole="button"
          >
            <Text style={styles.primaryText}>Go to business</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineBtn} onPress={backToList} accessibilityRole="button">
            <Text style={styles.outlineText}>Back to My Businesses</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Steps 1–5 ───────────────────────────────────────────────────────────
  const helperDeposit = `Customers pay ${depositValue}% online, the rest ${isStore ? 'at pickup' : 'at your shop'}.`;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Color.white} />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={isFirstStep ? close : back}
          disabled={saving}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={isFirstStep ? 'Close' : 'Previous step'}
        >
          {isFirstStep ? (
            <X size={26} color={INK} strokeWidth={2.2} />
          ) : (
            <ArrowLeft size={26} color={INK} strokeWidth={2.2} />
          )}
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>Add business</Text>
          <Text style={styles.subtitle}>
            Step {step + 1} of {steps.length} · {STEP_LABEL[stepId]}
          </Text>
        </View>
      </View>
      <View style={styles.progress}>
        {steps.map((id, i) => (
          <View key={id} style={[styles.progressSeg, i <= step && styles.progressSegOn]} />
        ))}
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {!!serverError && <Text style={styles.errorText}>{serverError}</Text>}

          {/* ── 1 · Type ────────────────────────────────────────────────── */}
          {stepId === 'type' && (
            <>
              <Text style={styles.stepTitle}>What kind of business is this?</Text>
              <TypeCard
                icon={Command}
                title="Service business"
                sub="Customers book appointments"
                selected={form.type === 'SERVICE'}
                onPress={() => setType('SERVICE')}
              />
              <TypeCard
                icon={ShoppingBag}
                title="Store"
                sub="Customers order products for pickup"
                selected={form.type === 'STORE'}
                onPress={() => setType('STORE')}
              />

              <Text style={styles.sectionTitle}>Category</Text>
              {categoriesForType.length === 0 ? (
                <Text style={styles.emptyHint}>
                  {categoriesLoading ? 'Loading categories…' : 'No categories available right now.'}
                </Text>
              ) : (
                <View style={styles.grid}>
                  {categoriesForType.map((c, i) => {
                    const selected = form.categoryId === c.id;
                    const tint = selected ? TINT.blue : TINTS[i % TINTS.length];
                    const Icon = categoryIcon(c);
                    return (
                      <TouchableOpacity
                        key={c.id}
                        style={[styles.tile, { borderColor: tint.border }, selected && styles.tileOn]}
                        activeOpacity={0.85}
                        onPress={() => setCategory(c.id)}
                        accessibilityRole="radio"
                        accessibilityState={{ selected }}
                      >
                        <GradientBackground colors={tint.colors} />
                        <Icon size={28} color={selected ? BRAND_BLUE : tint.icon} strokeWidth={1.8} />
                        <Text style={styles.tileLabel} numberOfLines={2}>
                          {c.name}
                        </Text>
                        {selected && (
                          <View style={styles.checkBadgeSmall}>
                            <Check size={14} color={Color.white} strokeWidth={3} />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                  {/* Keep the last row left-aligned under space-between. */}
                  {categoriesForType.length % 3 !== 0 && <View style={styles.gridSpacer} />}
                  {categoriesForType.length % 3 === 1 && <View style={styles.gridSpacer} />}
                </View>
              )}
              {!!errors.categoryId && <Text style={styles.fieldError}>{errors.categoryId}</Text>}

              {subcategories.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Specific type</Text>
                  <View style={styles.chipRow}>
                    {subcategories.map((s) => {
                      const selected = form.subcategoryId === s.id;
                      return (
                        <TouchableOpacity
                          key={s.id}
                          style={[styles.chip, selected && styles.chipOn]}
                          onPress={() => onChange('subcategoryId', selected ? '' : s.id)}
                          accessibilityRole="radio"
                          accessibilityState={{ selected }}
                        >
                          <Text style={[styles.chipText, selected && styles.chipTextOn]}>{s.name}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  {!!errors.subcategoryId && <Text style={styles.fieldError}>{errors.subcategoryId}</Text>}
                </>
              )}
            </>
          )}

          {/* ── 2 · Details ─────────────────────────────────────────────── */}
          {stepId === 'details' && (
            <>
              <Text style={styles.stepTitle}>Business details</Text>
              <Text style={styles.stepSubtitle}>Add your basic business information.</Text>
              <Field
                label="Business name"
                required
                value={form.businessName}
                onChangeText={(v) => onChange('businessName', v)}
                error={errors.businessName}
              />
              <Field
                label="Business phone"
                required
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(v) => onChange('phone', v)}
                error={errors.phone}
                prefix={
                  <View style={styles.prefixBox}>
                    <Text style={styles.prefixText}>+91</Text>
                    <ChevronDown size={18} color={INK} strokeWidth={2.2} />
                  </View>
                }
              />
              <Field
                label="Email"
                labelHint="(optional)"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={form.email}
                onChangeText={(v) => onChange('email', v)}
                error={errors.email}
              />
              <Field
                label="Description"
                multiline
                maxLength={DESCRIPTION_MAX_LENGTH}
                value={form.description}
                onChangeText={(v) => onChange('description', v)}
                footer={`${form.description.length} / ${DESCRIPTION_MAX_LENGTH}`}
              />
            </>
          )}

          {/* ── 3 · Payments ────────────────────────────────────────────── */}
          {stepId === 'payments' && (
            <>
              <Text style={styles.stepTitle}>How customers can pay</Text>
              <Text style={styles.stepSubtitle}>Choose the payment options you want to offer.</Text>

              <PayCard
                icon={CreditCard}
                title="Online payment"
                desc={`Let customers pay online while ${isStore ? 'ordering' : 'booking'}.`}
                value
                alwaysOn
              />

              <PayCard
                icon={Layers}
                title="Partial payment"
                desc={`Take an advance payment at the time of ${isStore ? 'ordering' : 'booking'}.`}
                value={form.partialPayEnabled}
                onValueChange={(v) => onChange('partialPayEnabled', v)}
              >
                {form.partialPayEnabled && (
                  <>
                    <View style={styles.stepper}>
                      <TouchableOpacity
                        style={[styles.stepperBtn, depositValue <= DEPOSIT_MIN && styles.stepperBtnDisabled]}
                        onPress={() => changeDeposit(-1)}
                        disabled={depositValue <= DEPOSIT_MIN}
                        accessibilityRole="button"
                        accessibilityLabel="Decrease advance percentage"
                      >
                        <Minus size={20} color={INK} strokeWidth={2.4} />
                      </TouchableOpacity>
                      <Text style={styles.stepperValue}>{depositValue}%</Text>
                      <TouchableOpacity
                        style={[styles.stepperBtn, depositValue >= DEPOSIT_MAX && styles.stepperBtnDisabled]}
                        onPress={() => changeDeposit(1)}
                        disabled={depositValue >= DEPOSIT_MAX}
                        accessibilityRole="button"
                        accessibilityLabel="Increase advance percentage"
                      >
                        <Plus size={20} color={INK} strokeWidth={2.4} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.stepperHelp}>{helperDeposit}</Text>
                  </>
                )}
              </PayCard>

              {isStore ? (
                <PayCard
                  icon={Banknote}
                  title="Cash / pay at venue"
                  desc="Customers can pay at pickup (e.g., cash or card)."
                  value={form.codEnabled}
                  onValueChange={(v) => onChange('codEnabled', v)}
                />
              ) : (
                <PayCard
                  icon={Banknote}
                  title="Cash / pay at venue"
                  desc="Customers can pay at your business (e.g., cash or card)."
                  value
                  alwaysOn
                />
              )}

              <View style={styles.infoBox}>
                <Info size={24} color={BRAND_BLUE} strokeWidth={2} />
                <Text style={styles.infoText}>Change these any time from your business settings.</Text>
              </View>
            </>
          )}

          {/* ── 4 · Photos ──────────────────────────────────────────────── */}
          {stepId === 'photos' && (
            <>
              <View style={styles.stepTitleRow}>
                <Text style={styles.stepTitle}>Business photos</Text>
                <Pill label="Optional" colors={PILL.grey} style={styles.optionalPill} />
              </View>
              <Text style={styles.stepSubtitle}>
                Add photos of your {isStore ? 'store' : 'business'}, interior, work setup or storefront. The first
                photo is your cover.
              </Text>

              <View style={styles.usageStrip}>
                <ImageIcon size={24} color={BRAND_BLUE} strokeWidth={1.9} />
                <Text style={styles.usageText}>
                  {photos.length} / {MAX_PHOTOS} photos
                </Text>
              </View>

              <View style={styles.photoGrid}>
                {photos.map((photo, i) => (
                  <View key={`${photo.uri}-${i}`} style={styles.photoTile}>
                    <Image source={{ uri: photo.uri }} style={styles.photoImage} />
                    {i === 0 && (
                      <Pill
                        label="Cover"
                        colors={COVER_PILL}
                        icon={<Star size={12} color={Color.white} fill={Color.white} strokeWidth={2} />}
                        style={styles.coverPill}
                      />
                    )}
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => removePhoto(i)}
                      hitSlop={HIT_SLOP}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove photo ${i + 1}`}
                    >
                      <X size={18} color={INK} strokeWidth={2.6} />
                    </TouchableOpacity>
                  </View>
                ))}
                {photos.length < MAX_PHOTOS && (
                  <TouchableOpacity
                    style={[styles.photoTile, styles.addTile]}
                    activeOpacity={0.8}
                    onPress={addPhotos}
                    accessibilityRole="button"
                    accessibilityLabel="Add photos"
                  >
                    <Plus size={34} color={BRAND_BLUE} strokeWidth={2} />
                    <Text style={styles.addText}>Add photos</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}

          {/* ── 5 · Location ────────────────────────────────────────────── */}
          {stepId === 'location' && (
            <>
              <View style={styles.stepTitleRow}>
                <Text style={styles.stepTitle}>Where are you?</Text>
                <Pill label="Optional" colors={PILL.grey} style={styles.optionalPill} />
              </View>
              <Text style={styles.stepSubtitle}>Add your business address so customers can find you easily.</Text>
              <Field label="Address" value={form.addressLine} onChangeText={(v) => onChange('addressLine', v)} />
              <View style={styles.pinRow}>
                <Field
                  label="PIN code"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={form.postalCode}
                  onChangeText={(v) => onChange('postalCode', v)}
                  containerStyle={styles.pinField}
                />
                {pinMatch && (
                  <View style={styles.pinMatch}>
                    <Check size={16} color={PILL.green.fg} />
                    <Text style={styles.pinMatchText} numberOfLines={2}>
                      {pinMatch.city}, {pinMatch.state}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.pairRow}>
                <Field
                  label="City"
                  labelHint={autoFilled.city ? 'Auto-filled' : undefined}
                  value={form.city}
                  onChangeText={(v) => onChange('city', v)}
                  containerStyle={styles.flex}
                />
                <Field
                  label="State"
                  labelHint={autoFilled.state ? 'Auto-filled' : undefined}
                  value={form.state}
                  onChangeText={(v) => onChange('state', v)}
                  containerStyle={styles.flex}
                />
              </View>
              <View style={styles.pinCard}>
                <View style={styles.pinCardHead}>
                  <MapPin size={22} color={INK} />
                  <View style={styles.pinCardText}>
                    <Text style={styles.pinCardTitle}>Pin your location</Text>
                    <Text style={styles.pinCardSub}>Set the exact location on the map for better accuracy.</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.locateBtn}
                  onPress={locateMe}
                  disabled={locating}
                  accessibilityRole="button"
                >
                  {locating ? <ActivityIndicator color={LINK} /> : <LocateFixed size={18} color={LINK} />}
                  <Text style={styles.locateBtnText}>
                    {locating ? 'Locating…' : locationSaved ? 'Update my location' : 'Use my current location'}
                  </Text>
                </TouchableOpacity>
                {locationSaved && (
                  <View style={styles.locationSaved}>
                    <Check size={16} color={PILL.green.fg} />
                    <Text style={styles.locationSavedText}>Location saved</Text>
                  </View>
                )}
              </View>
            </>
          )}
        </ScrollView>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.sm }]}>
          {!isFirstStep && (
            <TouchableOpacity
              style={[styles.outlineBtn, styles.backBtn]}
              onPress={back}
              disabled={saving}
              accessibilityRole="button"
            >
              <ArrowLeft size={20} color={INK} strokeWidth={2.2} />
              <Text style={styles.outlineText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.primaryBtn, saving && styles.primaryBtnBusy]}
            onPress={isLastStep ? submit : next}
            disabled={saving}
            accessibilityRole="button"
            accessibilityState={{ busy: saving }}
          >
            {saving ? (
              <ActivityIndicator color={Color.white} />
            ) : isLastStep ? (
              <Text style={styles.primaryText}>Create business</Text>
            ) : (
              <>
                <Text style={styles.primaryText}>Continue</Text>
                <ArrowRight size={20} color={Color.white} strokeWidth={2.4} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
