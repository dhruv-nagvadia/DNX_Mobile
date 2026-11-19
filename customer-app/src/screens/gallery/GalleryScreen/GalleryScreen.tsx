import React from 'react';
import { View, Text, Image, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ImageOff, X } from 'lucide-react-native';

import { useGalleryScreen } from './useGalleryScreen';
import {
  BLACK,
  CLOSE_HIT_SLOP,
  ICON_ON_DARK,
  MUTED_ON_DARK,
  THUMB,
  THUMB_GAP,
  THUMB_PAD,
  styles,
} from './styles';

/** Black full-screen photo viewer: swipeable pager, close + counter bar, thumbnail strip. */
export default function GalleryScreen() {
  const {
    images,
    width,
    initialIndex,
    selected,
    select,
    pagerRef,
    thumbsRef,
    onMomentumScrollEnd,
    pagerHeight,
    onPagerLayout,
    close,
  } = useGalleryScreen();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BLACK} />

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={close}
          hitSlop={CLOSE_HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Close photos"
        >
          <X size={22} color={ICON_ON_DARK} />
        </TouchableOpacity>
        {images.length > 0 && (
          <View style={styles.counter}>
            <Text
              style={styles.counterText}
              accessibilityLabel={`Photo ${selected + 1} of ${images.length}`}
            >
              {selected + 1} / {images.length}
            </Text>
          </View>
        )}
        <View style={styles.topSpacer} />
      </View>

      {images.length === 0 ? (
        <View style={styles.empty}>
          <ImageOff size={36} color={MUTED_ON_DARK} />
          <Text style={styles.emptyText}>No photos to show</Text>
        </View>
      ) : (
        <>
          {/* Pager */}
          <FlatList
            ref={pagerRef}
            data={images}
            keyExtractor={(url, i) => `${i}-${url}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={initialIndex}
            getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
            onMomentumScrollEnd={onMomentumScrollEnd}
            style={styles.pager}
            onLayout={onPagerLayout}
            renderItem={({ item, index }) => (
              <View style={[styles.page, { width, height: pagerHeight }]}>
                <Image
                  style={styles.photo}
                  source={{ uri: item }}
                  resizeMode="contain"
                  accessibilityLabel={`Photo ${index + 1}`}
                />
              </View>
            )}
          />

          {/* Thumbnails */}
          <View style={[styles.thumbBar, { paddingBottom: insets.bottom + 12 }]}>
            <FlatList
              ref={thumbsRef}
              data={images}
              keyExtractor={(url, i) => `t${i}-${url}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbRow}
              initialScrollIndex={initialIndex}
              getItemLayout={(_, i) => ({
                length: THUMB + THUMB_GAP,
                offset: THUMB_PAD + (THUMB + THUMB_GAP) * i,
                index: i,
              })}
              onScrollToIndexFailed={() => undefined}
              renderItem={({ item, index }) => {
                const active = index === selected;
                return (
                  <TouchableOpacity
                    style={[styles.thumb, active && styles.thumbActive]}
                    activeOpacity={0.85}
                    onPress={() => select(index)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={`Show photo ${index + 1}`}
                  >
                    <Image
                      style={[styles.thumbImg, !active && styles.thumbDim]}
                      source={{ uri: item }}
                    />
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </>
      )}
    </View>
  );
}
