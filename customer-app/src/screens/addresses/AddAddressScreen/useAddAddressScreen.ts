import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

import {
  useCreateAddressMutation,
  useGetAddressesQuery,
  useUpdateAddressMutation,
} from '@/redux/api/address/addressApi';
import { lookupByPincode, resolveGpsLocation } from '@/utils/locationApi';

import { AddAddressScreenProps, AddressForm } from './types';

const PIN_RE = /^\d{6}$/;

const EMPTY: AddressForm = {
  label: '',
  houseFlat: '',
  areaStreet: '',
  postalCode: '',
  city: '',
  state: '',
  latitude: null,
  longitude: null,
};

/** Add or edit a saved address — used to tell an on-location provider where to go. */
export function useAddAddressScreen({ route, navigation }: AddAddressScreenProps) {
  const id = route.params?.id;
  const isEdit = !!id;

  const { data: addresses = [] } = useGetAddressesQuery();
  const [createAddress, { isLoading: creating }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: updating }] = useUpdateAddressMutation();

  const [form, setForm] = useState<AddressForm>(EMPTY);
  const [locating, setLocating] = useState(false);
  const [resolvingPincode, setResolvingPincode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only auto-lookup city/state when the customer types the PIN themselves —
  // not when "use current location" already set it directly (avoids an
  // unnecessary refetch that could overwrite Nominatim's city/state with
  // India Post's slightly different naming for the same pincode).
  const pincodeEditedByUser = useRef(false);

  useEffect(() => {
    if (!id) return;
    const existing = addresses.find((a) => a.id === id);
    if (existing) {
      setForm({
        label: existing.label ?? '',
        houseFlat: existing.houseFlat ?? '',
        areaStreet: existing.areaStreet,
        postalCode: existing.postalCode ?? '',
        city: existing.city ?? '',
        state: existing.state ?? '',
        latitude: existing.latitude,
        longitude: existing.longitude,
      });
    }
  }, [id, addresses]);

  const onField = useCallback(
    (key: 'label' | 'houseFlat' | 'areaStreet' | 'city' | 'state', value: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const onPostalCode = useCallback((value: string) => {
    pincodeEditedByUser.current = true;
    setForm((prev) => ({ ...prev, postalCode: value.replace(/\D/g, '').slice(0, 6) }));
  }, []);

  // Debounced PIN → city/state autofill (India Post) — same pattern as
  // signup/profile. The customer can still edit either field afterward.
  useEffect(() => {
    if (!pincodeEditedByUser.current) return;
    const pincode = form.postalCode.trim();
    if (!PIN_RE.test(pincode)) {
      setResolvingPincode(false);
      return;
    }
    let cancelled = false;
    setResolvingPincode(true);
    const timer = setTimeout(async () => {
      const matches = await lookupByPincode(pincode);
      if (!cancelled) {
        const best = matches[0];
        if (best) setForm((prev) => ({ ...prev, city: best.district, state: best.state }));
        setResolvingPincode(false);
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [form.postalCode]);

  // Optional convenience — not required to save an address. Useful when the
  // customer IS at the address right now; prefills postal/city/state and, if
  // area/street is still empty, suggests it too. Also captures precise
  // coordinates (a manually-typed address gets an approximate one server-side
  // from its postal code instead).
  const useCurrentLocation = useCallback(async () => {
    setLocating(true);
    setError(null);
    const loc = await resolveGpsLocation();
    setLocating(false);
    if (!loc || loc.lat == null || loc.lng == null) {
      Alert.alert(
        'Could not get your location',
        'Allow location access in your device settings and try again.',
      );
      return;
    }
    setForm((prev) => ({
      ...prev,
      areaStreet: prev.areaStreet || loc.address || loc.label,
      city: loc.city ?? prev.city,
      state: loc.state ?? prev.state,
      postalCode: loc.postalCode ?? prev.postalCode,
      latitude: loc.lat ?? null,
      longitude: loc.lng ?? null,
    }));
  }, []);

  const save = useCallback(async () => {
    setError(null);
    if (!form.areaStreet.trim()) {
      setError('Enter the area, street, or sector');
      return;
    }
    if (!PIN_RE.test(form.postalCode.trim())) {
      setError('Enter a valid 6-digit PIN code');
      return;
    }

    const data = {
      label: form.label.trim() || undefined,
      houseFlat: form.houseFlat.trim() || undefined,
      areaStreet: form.areaStreet.trim(),
      city: form.city.trim() || undefined,
      state: form.state.trim() || undefined,
      postalCode: form.postalCode.trim(),
      latitude: form.latitude ?? undefined,
      longitude: form.longitude ?? undefined,
    };

    try {
      if (isEdit && id) {
        await updateAddress({ id, data }).unwrap();
      } else {
        await createAddress(data).unwrap();
      }
      navigation.goBack();
    } catch {
      setError('Could not save the address. Please try again.');
    }
  }, [form, isEdit, id, createAddress, updateAddress, navigation]);

  return {
    isEdit,
    form,
    error,
    locating,
    resolvingPincode,
    saving: creating || updating,
    onField,
    onPostalCode,
    useCurrentLocation,
    save,
  };
}
