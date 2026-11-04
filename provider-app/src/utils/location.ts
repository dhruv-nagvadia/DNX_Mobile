import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import { networkCall } from '@/api/apiConfigs';
import { endpoints } from '@/api/APIUtils';

/** Where the device is, plus a best-effort address for it (any part may be missing). */
export interface DeviceLocation {
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

/** Android needs a runtime prompt; iOS prompts on first use (Info.plist text). */
async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
      title: 'Location permission',
      message: 'DNX uses your location to pin your business on the map so customers can find you.',
      buttonPositive: 'Allow',
      buttonNegative: 'Not now',
    });
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
}

function getCurrentCoords(): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 10_000 },
    );
  });
}

interface ReverseGeocodeResult {
  address: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
}

/** Address / city / state / PIN for coordinates, via our backend (Nominatim). */
async function reverseGeocode(lat: number, lng: number): Promise<Omit<DeviceLocation, 'lat' | 'lng'>> {
  try {
    const res = await networkCall.get<{ data: ReverseGeocodeResult }>(endpoints.geoReverse, {
      params: { lat, lng },
    });
    const { address, city, state, postalCode } = res.data.data;
    return {
      address: address ?? undefined,
      city: city ?? undefined,
      state: state ?? undefined,
      postalCode: postalCode ?? undefined,
    };
  } catch {
    return {};
  }
}

/**
 * Permission → GPS → reverse geocode. Mirrors the customer app's
 * `resolveGpsLocation`. Resolves `null` (never throws) when permission is
 * denied or GPS fails; the address parts are best-effort.
 */
export async function getDeviceLocation(): Promise<DeviceLocation | null> {
  const allowed = await requestLocationPermission();
  if (!allowed) {
    return null;
  }
  const coords = await getCurrentCoords();
  if (!coords) {
    return null;
  }
  return { ...coords, ...(await reverseGeocode(coords.lat, coords.lng)) };
}
