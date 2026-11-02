import React, { useCallback } from 'react';
import { ActivityIndicator, Alert, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ImagePlus, Ellipsis, Upload } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { EmptyState } from '@/components/EmptyState';
import { LoadingView } from '@/components/LoadingView';
import { Pill } from '@/components/Pill';
import { Color } from '@/utils/Theme';
import { INK, LINK } from '@/utils/modernTheme';

import { useBusinessPhotosScreen } from './useBusinessPhotosScreen';
import { COVER_PILL, styles } from './styles';

export default function BusinessPhotosScreen() {
  const {
    images,
    isLoading,
    refreshing,
    refresh,
    uploading,
    savingImages,
    error,
    addPhotos,
    setCover,
    removeImage,
  } = useBusinessPhotosScreen();

  const busy = savingImages;

  // The "⋯" menu on each tile — same two actions as before (set as cover,
  // remove), surfaced through a native action sheet instead of inline icons.
  const openTileMenu = useCallback(
    (url: string, isCover: boolean) => {
      const buttons: Parameters<typeof Alert.alert>[2] = [];
      if (!isCover) {
        buttons.push({ text: 'Set as cover', onPress: () => setCover(url) });
      }
      buttons.push({ text: 'Remove photo', style: 'destructive', onPress: () => removeImage(url) });
      buttons.push({ text: 'Cancel', style: 'cancel' });
      Alert.alert(isCover ? 'Cover photo' : 'Photo', undefined, buttons);
    },
    [setCover, removeImage],
  );

  return (
    <View style={styles.root}>
      <AppHeader title="Photos" variant="light" />

      {isLoading ? (
        <LoadingView />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        >
          <TouchableOpacity
            style={styles.addBtn}
            activeOpacity={0.8}
            onPress={addPhotos}
            disabled={uploading}
            accessibilityRole="button"
            accessibilityLabel="Add photos"
            accessibilityState={{ disabled: uploading, busy: uploading }}
          >
            {uploading ? <ActivityIndicator size="small" color={LINK} /> : <Upload size={22} color={LINK} strokeWidth={2.2} />}
            <Text style={styles.addBtnText}>{uploading ? 'Uploading…' : 'Add Photos'}</Text>
          </TouchableOpacity>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          {images.length === 0 ? (
            <EmptyState
              icon={<ImagePlus size={48} color={Color.placeholder} strokeWidth={1.4} />}
              title="No photos yet"
              body="Businesses with photos get noticeably more bookings."
            />
          ) : (
            <View style={styles.grid}>
              {images.map((url, i) => {
                const isCover = i === 0;
                return (
                  <View key={url} style={styles.tile}>
                    <Image source={{ uri: url }} style={styles.tileImage} />
                    {isCover && <Pill label="Cover" colors={COVER_PILL} style={styles.coverPill} />}
                    <TouchableOpacity
                      style={styles.menuBtn}
                      disabled={busy}
                      onPress={() => openTileMenu(url, isCover)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityRole="button"
                      accessibilityLabel={isCover ? 'Cover photo options' : 'Photo options'}
                    >
                      <Ellipsis size={18} color={INK} strokeWidth={2.6} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
