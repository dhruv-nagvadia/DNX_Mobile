import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearLocation, setLocation } from '@/redux/slices/locationSlice';
import { saveLocation } from '@/utils/location';
import { PostOffice, lookupByPincode, resolveGpsLocation, searchByName } from '@/utils/locationApi';

import { LocationPickerNavigationProp } from './types';

const PIN_RE = /^\d{6}$/; // Indian PIN codes are 6 digits.

/** Lets the customer set where they're searching from — GPS, or a typed city/PIN. */
export function useLocationPicker() {
  const navigation = useNavigation<LocationPickerNavigationProp>();
  const dispatch = useAppDispatch();
  const current = useAppSelector((s) => s.location.current);

  const [locating, setLocating] = useState(false);
  const [manualText, setManualText] = useState('');
  const [suggestions, setSuggestions] = useState<PostOffice[]>([]);
  const [searching, setSearching] = useState(false);

  // Shared by both the debounced auto-search and the explicit Search button —
  // a 6-digit PIN looks up its post offices (area names); anything else
  // searches area/city names for matching PINs.
  const runSearch = useCallback(async (query: string, cancelledRef: { current: boolean }) => {
    setSearching(true);
    const results = PIN_RE.test(query) ? await lookupByPincode(query) : await searchByName(query);
    if (!cancelledRef.current) {
      setSuggestions(results);
      setSearching(false);
    }
  }, []);

  // Debounced live suggestions while typing.
  useEffect(() => {
    const query = manualText.trim();
    if (query.length < 3) {
      setSuggestions([]);
      setSearching(false);
      return;
    }
    const cancelledRef = { current: false };
    const timer = setTimeout(() => runSearch(query, cancelledRef), 350);
    return () => {
      cancelledRef.current = true;
      clearTimeout(timer);
    };
  }, [manualText, runSearch]);

  // Explicit "Search" button / keyboard submit — searches immediately
  // instead of waiting out the debounce.
  const search = useCallback(() => {
    const query = manualText.trim();
    if (query.length < 3) {
      return;
    }
    runSearch(query, { current: false });
  }, [manualText, runSearch]);

  const useCurrentLocation = useCallback(async () => {
    setLocating(true);
    const loc = await resolveGpsLocation();
    setLocating(false);
    if (!loc) {
      Alert.alert(
        'Could not get your location',
        'Allow location access in your device settings, or enter your city/PIN code instead.',
      );
      return;
    }
    dispatch(setLocation(loc));
    await saveLocation(loc);
    navigation.goBack();
  }, [dispatch, navigation]);

  const selectSuggestion = useCallback(
    async (item: PostOffice) => {
      const loc = {
        mode: 'manual' as const,
        label: `${item.name}, ${item.district}, ${item.pincode}`,
        city: item.district,
        state: item.state,
        postalCode: item.pincode,
      };
      dispatch(setLocation(loc));
      await saveLocation(loc);
      navigation.goBack();
    },
    [dispatch, navigation],
  );

  const clear = useCallback(async () => {
    dispatch(clearLocation());
    await saveLocation(null);
  }, [dispatch]);

  return {
    current,
    locating,
    manualText,
    setManualText,
    suggestions,
    searching,
    selectSuggestion,
    useCurrentLocation,
    search,
    clear,
  };
}
