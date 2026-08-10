import AsyncStorage from '@react-native-async-storage/async-storage';

import { StorageKeys } from './Constants';

/** A business the customer has opened, cached on-device for the Home screen. */
export interface RecentProvider {
  id: string;
  name: string;
  type: string;
  categorySlug: string;
  rating: number;
}

const MAX_RECENT = 8;

/** Recently opened businesses, most recent first (empty on any read error). */
export async function getRecentlyViewed(): Promise<RecentProvider[]> {
  try {
    const raw = await AsyncStorage.getItem(StorageKeys.recentlyViewed);
    return raw ? (JSON.parse(raw) as RecentProvider[]) : [];
  } catch {
    return [];
  }
}

/** Records a viewed business (deduped by id, most recent first, capped). */
export async function addRecentlyViewed(item: RecentProvider): Promise<void> {
  try {
    const list = await getRecentlyViewed();
    const next = [item, ...list.filter((p) => p.id !== item.id)].slice(0, MAX_RECENT);
    await AsyncStorage.setItem(StorageKeys.recentlyViewed, JSON.stringify(next));
  } catch {
    // Best-effort cache; ignore write failures.
  }
}
