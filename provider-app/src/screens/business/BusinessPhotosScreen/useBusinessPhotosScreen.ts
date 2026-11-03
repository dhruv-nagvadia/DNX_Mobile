import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';

import {
  useGetMyBusinessQuery,
  useSetBusinessImagesMutation,
  useUploadBusinessImagesMutation,
} from '@/redux/api/business/businessApi';

import { BusinessPhotosRouteProp } from './types';

/** Server-side cap on photos per business (uploads beyond this are rejected). */
export const MAX_IMAGES = 12;

/**
 * Ports `frontend/src/pages/provider/BusinessDetailPage/useBusinessDetail.ts`'s
 * `addImages`/`setCover`/`removeImage` — same `images: string[]` array on the
 * business record (index 0 = cover), same two endpoints (multipart upload to
 * add, a plain `{images}` PUT to reorder/remove).
 */
export function useBusinessPhotosScreen() {
  const { businessId } = useRoute<BusinessPhotosRouteProp>().params;
  const navigation = useNavigation();

  const { data: business, isLoading, isFetching, refetch } = useGetMyBusinessQuery(businessId);
  const [uploadImages, { isLoading: uploading }] = useUploadBusinessImagesMutation();
  const [setImages, { isLoading: savingImages }] = useSetBusinessImagesMutation();
  const [error, setError] = useState<string | null>(null);

  const images = useMemo(() => business?.images ?? [], [business]);
  const remaining = Math.max(0, MAX_IMAGES - images.length);
  const isFull = remaining === 0;

  const addPhotos = useCallback(async () => {
    setError(null);
    if (remaining <= 0) {
      Alert.alert('Photo limit reached', `Maximum of ${MAX_IMAGES} photos reached — remove one to add another.`);
      return;
    }
    const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: remaining, quality: 0.8 });
    if (result.didCancel || !result.assets?.length) {
      return;
    }
    if (result.assets.length > remaining) {
      Alert.alert(
        'Too many photos',
        `You can add ${remaining} more photo${remaining === 1 ? '' : 's'} (up to ${MAX_IMAGES} in total).`,
      );
      return;
    }
    // The server accepts at most 8 files per request — upload in batches.
    const assets = result.assets.filter((asset) => !!asset.uri);
    try {
      for (let start = 0; start < assets.length; start += 8) {
        const formData = new FormData();
        assets.slice(start, start + 8).forEach((asset, i) => {
          formData.append('images', {
            uri: asset.uri,
            name: asset.fileName ?? `photo-${start + i}.jpg`,
            type: asset.type ?? 'image/jpeg',
          } as unknown as Blob);
        });
        await uploadImages({ id: businessId, formData }).unwrap();
      }
    } catch {
      setError('Could not upload those photos. Please try again.');
    }
  }, [businessId, remaining, uploadImages]);

  const setCover = useCallback(
    async (url: string) => {
      setError(null);
      const next = [url, ...images.filter((img) => img !== url)];
      try {
        await setImages({ id: businessId, images: next }).unwrap();
      } catch {
        setError('Could not set that as the cover photo. Please try again.');
      }
    },
    [businessId, images, setImages],
  );

  const removeImage = useCallback(
    async (url: string) => {
      setError(null);
      const next = images.filter((img) => img !== url);
      try {
        await setImages({ id: businessId, images: next }).unwrap();
      } catch {
        setError('Could not remove that photo. Please try again.');
      }
    },
    [businessId, images, setImages],
  );

  /** Swap a photo with its neighbour (-1 = up/earlier, 1 = down/later). Moving
   * a photo into position 1 makes it the cover. */
  const moveImage = useCallback(
    async (url: string, direction: -1 | 1) => {
      const from = images.indexOf(url);
      const to = from + direction;
      if (from < 0 || to < 0 || to >= images.length) {
        return;
      }
      setError(null);
      const next = [...images];
      next[from] = images[to];
      next[to] = url;
      try {
        await setImages({ id: businessId, images: next }).unwrap();
      } catch {
        setError('Could not move that photo. Please try again.');
      }
    },
    [businessId, images, setImages],
  );

  return {
    businessName: business?.businessName ?? '',
    images,
    remaining,
    isFull,
    goBack: () => navigation.goBack(),
    isLoading,
    refreshing: isFetching,
    refresh: refetch,
    uploading,
    savingImages,
    error,
    addPhotos,
    setCover,
    removeImage,
    moveImage,
  };
}
