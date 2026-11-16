import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  DimensionValue,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Ellipsis,
  Image as ImageIcon,
  ImagePlus,
  Plus,
  Star,
  Trash2,
} from 'lucide-react-native';

import { BottomSheet, SheetButton, SheetOption } from '@/components/BottomSheet';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { LoadingView } from '@/components/LoadingView';
import { Pill } from '@/components/Pill';
import { Color, Spacing } from '@/utils/Theme';
import { INK, LINK, PAGE_BG } from '@/utils/modernTheme';

import { MAX_IMAGES, useBusinessPhotosScreen } from './useBusinessPhotosScreen';
import { COVER_PILL, styles } from './styles';

const BACK_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const MENU_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const FORMATS = 'JPG, PNG, WEBP up to 10 MB';

function CoverPill() {
  return (
    <Pill
      label="Cover"
      colors={COVER_PILL}
      icon={<Star size={12} color={Color.white} fill={Color.white} strokeWidth={2} />}
      style={styles.coverPill}
    />
  );
}

export default function BusinessPhotosScreen() {
  const insets = useSafeAreaInsets();
  const {
    businessName,
    images,
    remaining,
    isFull,
    goBack,
    isLoading,
    refreshing,
    refresh,
    uploading,
    savingImages,
    error,
    addPhotos,
    setCover,
    removeImage,
    moveImage,
  } = useBusinessPhotosScreen();

  const busy = uploading || savingImages;
  const count = images.length;

  // Action sheet: which photo it's for, and whether it's showing. Kept apart
  // so the sheet content doesn't vanish while the modal fades out.
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const selectedIndex = selectedUrl ? images.indexOf(selectedUrl) : -1;

  const openSheet = useCallback((url: string) => {
    setSelectedUrl(url);
    setSheetOpen(true);
  }, []);
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  // The selected photo was removed (or the list changed under us) — close.
  useEffect(() => {
    if (sheetOpen && selectedIndex < 0) {
      setSheetOpen(false);
    }
  }, [sheetOpen, selectedIndex]);

  // "Remove this photo?" is shown inside the sheet's own modal — iOS can't
  // present a second, sibling Modal on top of an open one.
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const onSheetClose = useCallback(() => {
    if (confirmingRemove) {
      setConfirmingRemove(false);
      return;
    }
    setSheetOpen(false);
  }, [confirmingRemove]);

  const onSetCover = useCallback(() => {
    if (!selectedUrl) {
      return;
    }
    setSheetOpen(false);
    setCover(selectedUrl);
  }, [selectedUrl, setCover]);

  const onMove = useCallback(
    (direction: -1 | 1) => {
      if (selectedUrl) {
        moveImage(selectedUrl, direction);
      }
    },
    [selectedUrl, moveImage],
  );

  const onRemove = useCallback(() => {
    if (selectedUrl) {
      setConfirmingRemove(true);
    }
  }, [selectedUrl]);

  const onConfirmRemove = useCallback(() => {
    setConfirmingRemove(false);
    if (!selectedUrl) {
      return;
    }
    setSheetOpen(false);
    removeImage(selectedUrl);
  }, [selectedUrl, removeImage]);
  const onCancelRemove = useCallback(() => setConfirmingRemove(false), []);

  const usedPct: DimensionValue = `${Math.min(100, Math.round((count / MAX_IMAGES) * 100))}%`;
  const countLabel = `${count} of ${MAX_IMAGES} photos`;

  const isCoverSelected = selectedIndex === 0;
  const canMoveUp = selectedIndex > 0;
  const canMoveDown = selectedIndex >= 0 && selectedIndex < count - 1;
  let sheetSubtitle: string | undefined;
  if (selectedIndex >= 0) {
    sheetSubtitle = isCoverSelected ? `Cover • Position 1 of ${count}` : `Position ${selectedIndex + 1} of ${count}`;
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={goBack}
          hitSlop={BACK_HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color={INK} strokeWidth={2.2} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>
            Photos
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {businessName ? `${businessName} • ${countLabel}` : countLabel}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, (isFull || uploading) && styles.addBtnDisabled]}
          onPress={addPhotos}
          disabled={isFull || uploading || isLoading}
          accessibilityRole="button"
          accessibilityLabel="Add photos"
          accessibilityState={{ disabled: isFull || uploading, busy: uploading }}
        >
          {uploading ? (
            <ActivityIndicator size="small" color={Color.white} />
          ) : (
            <Plus size={22} color={Color.white} strokeWidth={2.4} />
          )}
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <LoadingView />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        >
          {/* ── Usage ──────────────────────────────────────────────────── */}
          <View style={[styles.card, styles.usageCard]}>
            <View style={styles.usageIcon}>
              <ImageIcon size={22} color={LINK} strokeWidth={1.8} />
            </View>
            <View style={styles.usageBody}>
              <Text style={styles.usageTitle}>
                {count} / {MAX_IMAGES} photos used
              </Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: usedPct }]} />
              </View>
              <Text style={styles.usageMeta} numberOfLines={2}>
                {isFull ? 'Maximum reached — remove a photo to add more' : `${remaining} more allowed • ${FORMATS}`}
              </Text>
            </View>
          </View>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          {/* ── Cover photo ────────────────────────────────────────────── */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Star size={20} color={INK} strokeWidth={1.8} />
              <Text style={styles.cardTitle}>Cover photo</Text>
            </View>
            {count > 0 ? (
              <TouchableOpacity
                activeOpacity={0.9}
                onLongPress={() => openSheet(images[0])}
                delayLongPress={300}
                disabled={busy}
                accessibilityLabel="Cover photo"
                accessibilityHint="Long-press for options"
              >
                <Image source={{ uri: images[0] }} style={styles.coverImage} />
                <CoverPill />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.coverPlaceholder}
                activeOpacity={0.8}
                onPress={addPhotos}
                disabled={uploading}
                accessibilityRole="button"
                accessibilityLabel="Add photos"
              >
                {uploading ? (
                  <ActivityIndicator size="small" color={LINK} />
                ) : (
                  <ImagePlus size={26} color={LINK} strokeWidth={1.8} />
                )}
                <Text style={styles.addText}>{uploading ? 'Uploading…' : 'Add photos'}</Text>
                <Text style={styles.placeholderHint}>Businesses with photos get noticeably more bookings.</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.cardHint}>First photo customers see</Text>
          </View>

          {/* ── Gallery ────────────────────────────────────────────────── */}
          {count > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <ImageIcon size={20} color={INK} strokeWidth={1.8} />
                <Text style={[styles.cardTitle, styles.flex]} numberOfLines={1}>
                  Gallery ({count})
                </Text>
                <Text style={styles.reorderHint}>Long-press to reorder</Text>
              </View>

              <View style={styles.grid}>
                {images.map((url, i) => {
                  const highlighted = sheetOpen && url === selectedUrl;
                  return (
                    <TouchableOpacity
                      key={url}
                      style={[styles.tile, highlighted && styles.tileSelected]}
                      activeOpacity={0.9}
                      onLongPress={() => openSheet(url)}
                      delayLongPress={300}
                      disabled={busy}
                      accessibilityLabel={`Photo ${i + 1} of ${count}`}
                      accessibilityHint="Long-press for options"
                    >
                      <Image source={{ uri: url }} style={styles.tileImage} />
                      {i === 0 && <CoverPill />}
                      <View style={styles.positionChip}>
                        <Text style={styles.positionText}>{i + 1}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.menuBtn}
                        disabled={busy}
                        onPress={() => openSheet(url)}
                        hitSlop={MENU_HIT_SLOP}
                        accessibilityRole="button"
                        accessibilityLabel={`Photo ${i + 1} options`}
                      >
                        <Ellipsis size={16} color={INK} strokeWidth={2.8} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                })}

                {!isFull && (
                  <TouchableOpacity
                    style={[styles.tile, styles.addTile]}
                    activeOpacity={0.8}
                    onPress={addPhotos}
                    disabled={uploading}
                    accessibilityRole="button"
                    accessibilityLabel="Add photos"
                  >
                    <Plus size={22} color={LINK} strokeWidth={2.4} />
                    <Text style={styles.addText}>Add photos</Text>
                  </TouchableOpacity>
                )}

                {busy && (
                  <View style={styles.busyOverlay} pointerEvents="none">
                    <ActivityIndicator size="large" color={LINK} />
                    <Text style={styles.busyText}>{uploading ? 'Uploading…' : 'Saving…'}</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {/* ── Photo action sheet ─────────────────────────────────────────── */}
      <BottomSheet
        visible={sheetOpen && selectedIndex >= 0}
        onClose={onSheetClose}
        title={selectedIndex >= 0 ? `Photo #${selectedIndex + 1}` : undefined}
        subtitle={sheetSubtitle}
        leading={selectedUrl ? <Image source={{ uri: selectedUrl }} style={styles.sheetThumb} /> : undefined}
        headerRight={savingImages ? <ActivityIndicator size="small" color={LINK} /> : undefined}
        footer={<SheetButton title="Cancel" variant="secondary" onPress={closeSheet} />}
        overlay={
          <ConfirmDialog
            inline
            visible={confirmingRemove}
            title="Remove this photo?"
            message="It will no longer be shown to customers."
            tone="danger"
            icon={Trash2}
            confirmText="Remove"
            onConfirm={onConfirmRemove}
            onCancel={onCancelRemove}
          />
        }
      >
        {!isCoverSelected && (
          <SheetOption icon={Star} label="Set as cover" onPress={onSetCover} disabled={savingImages} />
        )}
        <SheetOption
          icon={ArrowUp}
          tone="grey"
          label="Move up"
          onPress={() => onMove(-1)}
          disabled={!canMoveUp || savingImages}
        />
        <SheetOption
          icon={ArrowDown}
          tone="grey"
          label="Move down"
          onPress={() => onMove(1)}
          disabled={!canMoveDown || savingImages}
        />
        <SheetOption icon={Trash2} label="Remove photo" destructive onPress={onRemove} disabled={savingImages} />
      </BottomSheet>
    </View>
  );
}
