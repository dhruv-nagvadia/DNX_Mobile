import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import { CustomerLocation } from './location';

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

/** Best-effort human-readable place (locality, city, state, PIN) for a GPS coordinate. */
export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<{ locality?: string; city?: string; state?: string; postalCode?: string }> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
    );
    if (!res.ok) {
      return {};
    }
    const data = await res.json();
    const city: string | undefined = data.city || undefined;
    const state: string | undefined = data.principalSubdivision || undefined;
    const locality: string | undefined = data.locality || undefined;
    let postalCode: string | undefined = data.postcode || undefined;

    // This API frequently comes back with no PIN code for Indian addresses —
    // best-effort fill it in via the postal directory's name search.
    if (!postalCode && (locality || city)) {
      const matches = await searchByName(locality || city || '');
      const best =
        matches.find((m) => !!city && m.district.toLowerCase().includes(city.toLowerCase())) ??
        matches[0];
      if (best) {
        postalCode = best.pincode;
      }
    }

    return { locality, city, state, postalCode };
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

function getCurrentCoords(): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 10_000 },
    );
  });
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

  const { locality, city, state, postalCode } = await reverseGeocode(coords.lat, coords.lng);
  const label = [locality, city, postalCode].filter(Boolean).join(', ') || 'Current location';
  return { mode: 'gps', label, lat: coords.lat, lng: coords.lng, city, state, postalCode };
}
