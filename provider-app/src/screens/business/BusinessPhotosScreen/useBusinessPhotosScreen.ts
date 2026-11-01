import { useCallback, useMemo, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';

import {
  useGetMyBusinessQuery,
  useSetBusinessImagesMutation,
  useUploadBusinessImagesMutation,
} from '@/redux/api/business/businessApi';

import { BusinessPhotosRouteProp } from './types';

/**
 * Ports `frontend/src/pages/provider/BusinessDetailPage/useBusinessDetail.ts`'s
 * `addImages`/`setCover`/`removeImage` — same `images: string[]` array on the
 * business record (index 0 = cover), same two endpoints (multipart upload to
 * add, a plain `{images}` PUT to reorder/remove).
 */
export function useBusinessPhotosScreen() {
  const { businessId } = useRoute<BusinessPhotosRouteProp>().params;

  const { data: business, isLoading, isFetching, refetch } = useGetMyBusinessQuery(businessId);
  const [uploadImages, { isLoading: uploading }] = useUploadBusinessImagesMutation();
  const [setImages, { isLoading: savingImages }] = useSetBusinessImagesMutation();
  const [error, setError] = useState<string | null>(null);

  const images = useMemo(() => business?.images ?? [], [business]);

  const addPhotos = useCallback(async () => {
    setError(null);
    const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 0, quality: 0.8 });
    if (result.didCancel || !result.assets?.length) {
      return;
    }
    const formData = new FormData();
    result.assets.forEach((asset, i) => {
      if (!asset.uri) {
        return;
      }
      formData.append('images', {
        uri: asset.uri,
        name: asset.fileName ?? `photo-${i}.jpg`,
        type: asset.type ?? 'image/jpeg',
      } as unknown as Blob);
    });
    try {
      await uploadImages({ id: businessId, formData }).unwrap();
    } catch {
      setError('Could not upload those photos. Please try again.');
    }
  }, [businessId, uploadImages]);

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

  return {
    images,
    isLoading,
    refreshing: isFetching,
    refresh: refetch,
    uploading,
    savingImages,
    error,
    addPhotos,
    setCover,
    removeImage,
  };
}
