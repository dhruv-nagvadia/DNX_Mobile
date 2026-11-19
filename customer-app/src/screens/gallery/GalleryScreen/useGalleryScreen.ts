import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { GalleryRouteProp } from './types';

/** Holds the images, the current page, and keeps the pager + thumbnail strip in sync. */
export function useGalleryScreen() {
  const { params } = useRoute<GalleryRouteProp>();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const images = params.images ?? [];
  const initialIndex = Math.min(Math.max(params.index ?? 0, 0), Math.max(images.length - 1, 0));
  const [selected, setSelected] = useState(initialIndex);
  const [pagerHeight, setPagerHeight] = useState(0);
  const onPagerLayout = useCallback(
    (e: LayoutChangeEvent) => setPagerHeight(e.nativeEvent.layout.height),
    [],
  );

  const pagerRef = useRef<FlatList<string>>(null);
  const thumbsRef = useRef<FlatList<string>>(null);

  const centerThumb = useCallback(
    (i: number) => {
      if (images.length > 0) {
        thumbsRef.current?.scrollToIndex({ index: i, animated: true, viewPosition: 0.5 });
      }
    },
    [images.length],
  );

  /** Tap on a thumbnail: jump the pager there. */
  const select = useCallback(
    (i: number) => {
      setSelected(i);
      pagerRef.current?.scrollToIndex({ index: i, animated: true });
      centerThumb(i);
    },
    [centerThumb],
  );

  /** Swipe settled on a page: sync the counter and thumbnails. */
  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const page = Math.round(e.nativeEvent.contentOffset.x / width);
      setSelected(page);
      centerThumb(page);
    },
    [width, centerThumb],
  );

  return {
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
    close: () => navigation.goBack(),
  };
}
