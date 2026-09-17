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

  // Debounced live suggestions: a 6-digit PIN looks up its post offices
  // (area names); anything else searches area/city names for matching PINs.
  useEffect(() => {
    const query = manualText.trim();
    if (query.length < 3) {
      setSuggestions([]);
      setSearching(false);
      return;
    }
    let cancelled = false;
    setSearching(true);
    const timer = setTimeout(async () => {
      const results = PIN_RE.test(query) ? await lookupByPincode(query) : await searchByName(query);
      if (!cancelled) {
        setSuggestions(results);
        setSearching(false);
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [manualText]);

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

  const saveManual = useCallback(async () => {
    const value = manualText.trim();
    if (!value) {
      return;
    }

    // Prefer an exact match among the live suggestions (carries a resolved
    // city + PIN code); otherwise fall back to the raw typed value.
    const exact = suggestions.find((s) => s.name.toLowerCase() === value.toLowerCase());
    if (exact) {
      await selectSuggestion(exact);
      return;
    }

    const loc = PIN_RE.test(value)
      ? { mode: 'manual' as const, label: value, postalCode: value }
      : { mode: 'manual' as const, label: value, city: value };
    dispatch(setLocation(loc));
    await saveLocation(loc);
    navigation.goBack();
  }, [manualText, suggestions, selectSuggestion, dispatch, navigation]);

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
    saveManual,
    clear,
  };
}
