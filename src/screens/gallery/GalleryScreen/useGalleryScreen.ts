import { useState } from 'react';
import { useRoute } from '@react-navigation/native';

import { GalleryRouteProp } from './types';

/** Holds the images and the currently-selected one for the photo viewer. */
export function useGalleryScreen() {
  const { params } = useRoute<GalleryRouteProp>();
  const images = params.images ?? [];
  const [selected, setSelected] = useState(params.index ?? 0);

  return {
    images,
    selected,
    select: setSelected,
  };
}
