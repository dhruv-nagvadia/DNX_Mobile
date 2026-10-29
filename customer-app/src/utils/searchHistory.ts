import AsyncStorage from '@react-native-async-storage/async-storage';

import { Provider, ProductSearchResult, ServiceSearchResult } from '@/redux/api/provider/types';

import { StorageKeys } from './Constants';

const MAX_RECENT_SEARCHES = 10;
const MAX_RECENT_VIEWS = 12;

/** Recent search terms, most recent first (empty on any read error). */
export async function getRecentSearches(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(StorageKeys.recentSearches);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/** Records a search term (deduped case-insensitively, most recent first, capped). Returns the new list. */
export async function addRecentSearch(term: string): Promise<string[]> {
  const trimmed = term.trim();
  if (!trimmed) return getRecentSearches();
  try {
    const list = await getRecentSearches();
    const next = [trimmed, ...list.filter((t) => t.toLowerCase() !== trimmed.toLowerCase())].slice(
      0,
      MAX_RECENT_SEARCHES,
    );
    await AsyncStorage.setItem(StorageKeys.recentSearches, JSON.stringify(next));
    return next;
  } catch {
    return getRecentSearches();
  }
}

export async function clearRecentSearches(): Promise<void> {
  try {
    await AsyncStorage.removeItem(StorageKeys.recentSearches);
  } catch {
    // Best-effort cache; ignore write failures.
  }
}

/**
 * A business, service or product opened from a search result — the full
 * result object is kept (not a flattened summary) so "Recently viewed" can
 * render the exact same card as the live search result (price, rating,
 * duration…), not just a name.
 */
export type SearchViewItem =
  | { kind: 'provider'; item: Provider }
  | { kind: 'product'; item: ProductSearchResult }
  | { kind: 'service'; item: ServiceSearchResult };

const sameItem = (a: SearchViewItem, b: SearchViewItem) => a.kind === b.kind && a.item.id === b.item.id;

// Guards against a shape saved by an older version of the app (e.g. a
// flattened entry with no `item`) so a stale on-device cache can't crash
// the screen — it's just silently dropped instead.
const isValidEntry = (v: unknown): v is SearchViewItem =>
  !!v &&
  typeof v === 'object' &&
  'kind' in v &&
  'item' in v &&
  !!(v as { item?: { id?: unknown } }).item &&
  typeof (v as { item: { id?: unknown } }).item.id === 'string';

/** Items opened from search results, most recent first (empty on any read error). */
export async function getRecentSearchViews(): Promise<SearchViewItem[]> {
  try {
    const raw = await AsyncStorage.getItem(StorageKeys.recentSearchViews);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    return Array.isArray(parsed) ? parsed.filter(isValidEntry) : [];
  } catch {
    return [];
  }
}

/** Records an opened item (deduped by kind+id, most recent first, capped). Returns the new list. */
export async function addRecentSearchView(entry: SearchViewItem): Promise<SearchViewItem[]> {
  try {
    const list = await getRecentSearchViews();
    const next = [entry, ...list.filter((v) => !sameItem(v, entry))].slice(0, MAX_RECENT_VIEWS);
    await AsyncStorage.setItem(StorageKeys.recentSearchViews, JSON.stringify(next));
    return next;
  } catch {
    return getRecentSearchViews();
  }
}

export async function clearRecentSearchViews(): Promise<void> {
  try {
    await AsyncStorage.removeItem(StorageKeys.recentSearchViews);
  } catch {
    // Best-effort cache; ignore write failures.
  }
}
