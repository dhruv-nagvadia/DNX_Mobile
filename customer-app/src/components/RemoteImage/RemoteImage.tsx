import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { Image, ImageProps } from 'react-native';

interface RemoteImageProps extends Omit<ImageProps, 'source'> {
  /** Candidate URLs from the API, best first; empty / missing ones are skipped. */
  uris: (string | null | undefined)[];
  /** Rendered when no URL is available or every one fails to load. */
  fallback?: ReactNode;
}

/**
 * Shows the first API image that loads, trying the next on error. No images
 * are bundled in the app — when nothing loads, `fallback` (an icon tile) shows.
 */
export function RemoteImage({ uris, fallback = null, ...rest }: RemoteImageProps) {
  const candidates = useMemo(() => uris.filter((u): u is string => !!u), [uris]);
  const key = candidates.join('|');
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [key]);

  const uri = candidates[index];
  if (!uri) {
    return <>{fallback}</>;
  }
  return <Image {...rest} source={{ uri }} onError={() => setIndex((i) => i + 1)} />;
}
