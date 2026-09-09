import { useCallback, useState } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearLocation, setLocation } from '@/redux/slices/locationSlice';
import { saveLocation } from '@/utils/location';

import { LocationPickerNavigationProp } from './types';

const PIN_RE = /^\d{6}$/; // Indian PIN codes are 6 digits.

/** Request Android's runtime location permission (iOS prompts automatically). */
async function requestAndroidPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
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

/** Lets the customer set where they're searching from — GPS, or a typed city/PIN. */
export function useLocationPicker() {
  const navigation = useNavigation<LocationPickerNavigationProp>();
  const dispatch = useAppDispatch();
  const current = useAppSelector((s) => s.location.current);

  const [locating, setLocating] = useState(false);
  const [manualText, setManualText] = useState('');

  const useCurrentLocation = useCallback(async () => {
    const allowed = await requestAndroidPermission();
    if (!allowed) {
      Alert.alert(
        'Location access needed',
        'Allow location access in your device settings to use this.',
      );
      return;
    }
    setLocating(true);
    Geolocation.getCurrentPosition(
      async (pos) => {
        const loc = {
          mode: 'gps' as const,
          label: 'Current location',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        dispatch(setLocation(loc));
        await saveLocation(loc);
        setLocating(false);
        navigation.goBack();
      },
      () => {
        setLocating(false);
        Alert.alert('Could not get your location', 'Please try again, or enter your city/PIN code instead.');
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 10_000 },
    );
  }, [dispatch, navigation]);

  const saveManual = useCallback(async () => {
    const value = manualText.trim();
    if (!value) return;
    const loc = PIN_RE.test(value)
      ? { mode: 'manual' as const, label: value, postalCode: value }
      : { mode: 'manual' as const, label: value, city: value };
    dispatch(setLocation(loc));
    await saveLocation(loc);
    navigation.goBack();
  }, [manualText, dispatch, navigation]);

  const clear = useCallback(async () => {
    dispatch(clearLocation());
    await saveLocation(null);
  }, [dispatch]);

  return {
    current,
    locating,
    manualText,
    setManualText,
    useCurrentLocation,
    saveManual,
    clear,
  };
}
