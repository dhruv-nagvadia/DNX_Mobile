import AsyncStorage from '@react-native-async-storage/async-storage';

import { StorageKeys } from './Constants';

/** Where the customer is searching from — either device GPS or a typed city/PIN. */
export interface CustomerLocation {
  mode: 'gps' | 'manual' | 'profile';
  /** Shown on the Home location pill. */
  label: string;
  /** Locality/city only, no postal code — usable as an area/street suggestion. */
  address?: string;
  lat?: number;
  lng?: number;
  city?: string;
  state?: string;
  postalCode?: string;
}

/** Straight-line distance between two coordinates, in km (haversine). */
export function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(bLat - aLat);
  const dLng = rad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

/** Last-saved customer location (null if never set, or on any read error). */
export async function getStoredLocation(): Promise<CustomerLocation | null> {
  try {
    const raw = await AsyncStorage.getItem(StorageKeys.location);
    return raw ? (JSON.parse(raw) as CustomerLocation) : null;
  } catch {
    return null;
  }
}

/** Persists (or clears, when null) the customer's chosen location. */
export async function saveLocation(loc: CustomerLocation | null): Promise<void> {
  try {
    if (loc) await AsyncStorage.setItem(StorageKeys.location, JSON.stringify(loc));
    else await AsyncStorage.removeItem(StorageKeys.location);
  } catch {
    // Best-effort cache; ignore write failures.
  }
}
