import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import { networkCall } from '@/api/apiConfigs';
import { endpoints } from '@/api/APIUtils';
import DEBUG_LOGGER, { INFO, WARNING } from '@/utils/DebugLogger';
import { CustomerLocation, distanceKm } from './location';

/** One post office entry from India Post's free, keyless PIN-code directory. */
export interface PostOffice {
  name: string;
  district: string;
  state: string;
  pincode: string;
}

const POSTAL_BASE = 'https://api.postalpincode.in';

interface RawPostOfficeResponse {
  Status?: string;
  PostOffice?: {
    Name?: string;
    District?: string;
    State?: string;
    Pincode?: string;
  }[];
}

function toPostOffices(json: unknown): PostOffice[] {
  const first = Array.isArray(json) ? (json[0] as RawPostOfficeResponse) : null;
  if (!first || first.Status !== 'Success' || !Array.isArray(first.PostOffice)) {
    return [];
  }
  return first.PostOffice.map((p) => ({
    name: p.Name ?? '',
    district: p.District ?? '',
    state: p.State ?? '',
    pincode: p.Pincode ?? '',
  })).filter((p) => p.name && p.pincode);
}

/** All post offices under an exact 6-digit PIN code — India Post, free & keyless. */
export async function lookupByPincode(pincode: string): Promise<PostOffice[]> {
  try {
    const res = await fetch(`${POSTAL_BASE}/pincode/${encodeURIComponent(pincode)}`);
    if (!res.ok) {
      return [];
    }
    return toPostOffices(await res.json());
  } catch {
    return [];
  }
}

/**
 * Post offices whose name contains `query` (India Post does substring, not
 * prefix, matching — so this re-ranks prefix matches first and caps the list
 * to keep an autocomplete dropdown usable).
 */
export async function searchByName(query: string): Promise<PostOffice[]> {
  const q = query.trim().toLowerCase();
  if (q.length < 3) {
    return [];
  }
  try {
    const res = await fetch(`${POSTAL_BASE}/postoffice/${encodeURIComponent(query.trim())}`);
    if (!res.ok) {
      return [];
    }
    const items = toPostOffices(await res.json());
    return items
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1;
        const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1;
        return aStarts - bStarts || a.name.localeCompare(b.name);
      })
      .slice(0, 20);
  } catch {
    return [];
  }
}

interface ReverseGeocodeResult {
  address: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
}

/**
 * Best-effort human-readable place (locality/city, state, PIN) for a GPS
 * coordinate. Goes through our own backend (which calls Nominatim) rather
 * than a geocoding API directly — BigDataCloud almost never returns a real
 * postal code for Indian addresses, while Nominatim reliably does.
 */
export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<{ address?: string; city?: string; state?: string; postalCode?: string }> {
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

// ── Device GPS + permission ──────────────────────────────────────────────

/** Requests Android's runtime location permission (iOS prompts automatically). */
export async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location permission',
        message: 'DNX uses your location to show nearby businesses and sort by distance.',
        buttonPositive: 'Allow',
        buttonNegative: 'Not now',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
}

function readCoords(
  highAccuracy: boolean,
  timeout: number,
): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        DEBUG_LOGGER(
          `GPS ${highAccuracy ? 'high-accuracy' : 'network'} fix failed: ${err?.message ?? err}`,
          'readCoords',
          'locationApi',
          '',
          WARNING,
        );
        resolve(null);
      },
      // maximumAge 0: always a fresh reading, never a cached one from earlier.
      { enableHighAccuracy: highAccuracy, timeout, maximumAge: 0 },
    );
  });
}

/** Fresh position: precise GPS first, then (indoors / weak sky view) a quicker network fix. */
async function getCurrentCoords(): Promise<{ lat: number; lng: number } | null> {
  return (await readCoords(true, 8_000)) ?? (await readCoords(false, 8_000));
}

/**
 * Full GPS flow: permission → coordinates → human-readable reverse geocode.
 * Resolves `null` (never throws) if permission is denied or GPS/geocoding fails.
 */
export async function resolveGpsLocation(): Promise<CustomerLocation | null> {
  const allowed = await requestLocationPermission();
  if (!allowed) {
    return null;
  }
  const coords = await getCurrentCoords();
  if (!coords) {
    return null;
  }

  const { address, city, state, postalCode } = await reverseGeocode(coords.lat, coords.lng);
  const label = [address, postalCode].filter(Boolean).join(', ') || 'Current location';
  return { mode: 'gps', label, address, lat: coords.lat, lng: coords.lng, city, state, postalCode };
}

/**
 * Quiet re-check of where the customer is now. Unlike resolveGpsLocation it never
 * asks for permission (returns null unless it is already granted), and returns null
 * when the customer is within `minMoveKm` (200 m) of `previous` — so it only reverse-geocodes
 * and updates when they have actually moved.
 */
export async function refreshGpsLocation(
  previous: CustomerLocation,
  minMoveKm = 0.2,
): Promise<CustomerLocation | null> {
  const log = (msg: string) =>
    DEBUG_LOGGER(msg, 'refreshGpsLocation', 'locationApi', '', INFO);
  if (Platform.OS === 'android') {
    try {
      // Android 12+ lets people share only an approximate location — that's enough here.
      const fine = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      const coarse = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      );
      if (!fine && !coarse) {
        log('skipped — location permission not granted, keeping saved location');
        return null;
      }
    } catch {
      return null;
    }
  }
  const coords = await getCurrentCoords();
  if (!coords) {
    log('skipped — could not read GPS, keeping saved location');
    return null;
  }
  if (previous.lat != null && previous.lng != null) {
    const moved = distanceKm(previous.lat, previous.lng, coords.lat, coords.lng);
    if (moved < minMoveKm) {
      log(`skipped — only ${moved.toFixed(2)} km from the saved location`);
      return null;
    }
    log(`moved ${moved.toFixed(1)} km from "${previous.label}" — updating`);
  } else {
    log(`saved location "${previous.label}" has no coordinates — updating from GPS`);
  }

  const { address, city, state, postalCode } = await reverseGeocode(coords.lat, coords.lng);
  const label = [address, postalCode].filter(Boolean).join(', ') || 'Current location';
  log(`now at "${label}" (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`);
  return { mode: 'gps', label, address, lat: coords.lat, lng: coords.lng, city, state, postalCode };
}
