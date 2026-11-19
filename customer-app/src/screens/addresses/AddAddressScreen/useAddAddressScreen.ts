import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

import {
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useUpdateAddressMutation,
} from '@/redux/api/address/addressApi';
import { lookupByPincode, resolveGpsLocation } from '@/utils/locationApi';

import { AddAddressScreenProps, AddressForm, AddressFormErrors } from './types';

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

  const { data: addresses = [], isSuccess: addressesLoaded } = useGetAddressesQuery();
  const [createAddress, { isLoading: creating }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: updating }] = useUpdateAddressMutation();
  const [deleteAddress, { isLoading: deleting }] = useDeleteAddressMutation();

  const [form, setForm] = useState<AddressForm>(EMPTY);
  const [locating, setLocating] = useState(false);
  const [resolvingPincode, setResolvingPincode] = useState(false);
  const [errors, setErrors] = useState<AddressFormErrors>({});
  // City/state the PIN auto-lookup resolved to — shown as "✓ City, State".
  const [pinResolved, setPinResolved] = useState<string | null>(null);
  // Opt-in "make this my default" — only ever sends `isDefault: true`, so the
  // backend's own rules (first address becomes default) are left untouched.
  const [makeDefault, setMakeDefault] = useState(false);

  // Only auto-lookup city/state when the customer types the PIN themselves —
  // not when "use current location" already set it directly (avoids an
  // unnecessary refetch that could overwrite Nominatim's city/state with
  // India Post's slightly different naming for the same pincode).
  const pincodeEditedByUser = useRef(false);

  const existing = id ? addresses.find((a) => a.id === id) : undefined;
  const alreadyDefault = !!existing?.isDefault;
  // The backend makes a customer's first address the default automatically.
  const firstAddress = !isEdit && addressesLoaded && addresses.length === 0;

  useEffect(() => {
    if (!existing) {
      return;
    }
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
  }, [existing]);

  const onField = useCallback(
    (key: 'label' | 'houseFlat' | 'areaStreet' | 'city' | 'state', value: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      if (key === 'areaStreet') {
        setErrors((prev) => ({ ...prev, areaStreet: undefined }));
      }
    },
    [],
  );

  const onPostalCode = useCallback((value: string) => {
    pincodeEditedByUser.current = true;
    setErrors((prev) => ({ ...prev, postalCode: undefined }));
    setForm((prev) => ({ ...prev, postalCode: value.replace(/\D/g, '').slice(0, 6) }));
  }, []);

  // Debounced PIN → city/state autofill (India Post) — same pattern as
  // signup/profile. The customer can still edit either field afterward.
  useEffect(() => {
    if (!pincodeEditedByUser.current) {
      return;
    }
    const pincode = form.postalCode.trim();
    setPinResolved(null);
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
        if (best) {
          setForm((prev) => ({ ...prev, city: best.district, state: best.state }));
          setPinResolved(`${best.district}, ${best.state}`);
        }
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
    setErrors((prev) => ({ ...prev, submit: undefined }));
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
    setErrors({});
  }, []);

  const save = useCallback(async () => {
    // Same rules as before, but every failing field is flagged inline at once.
    const next: AddressFormErrors = {};
    if (!form.areaStreet.trim()) {
      next.areaStreet = 'Enter the area, street, or sector';
    }
    if (!PIN_RE.test(form.postalCode.trim())) {
      next.postalCode = 'Enter a valid 6-digit PIN code';
    }
    setErrors(next);
    if (next.areaStreet || next.postalCode) {
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
      ...(makeDefault && !alreadyDefault ? { isDefault: true } : {}),
    };

    try {
      if (isEdit && id) {
        await updateAddress({ id, data }).unwrap();
      } else {
        await createAddress(data).unwrap();
      }
      navigation.goBack();
    } catch {
      setErrors({ submit: 'Could not save the address. Please try again.' });
    }
  }, [form, makeDefault, alreadyDefault, isEdit, id, createAddress, updateAddress, navigation]);

  // Edit mode only — same confirm as the Addresses list.
  const remove = useCallback(() => {
    if (!id) {
      return;
    }
    Alert.alert('Delete address', `Delete "${form.label.trim() || form.areaStreet}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteAddress(id).unwrap();
            navigation.goBack();
          } catch {
            setErrors({ submit: 'Could not delete the address. Please try again.' });
          }
        },
      },
    ]);
  }, [id, form.label, form.areaStreet, deleteAddress, navigation]);

  return {
    isEdit,
    form,
    errors,
    locating,
    resolvingPincode,
    pinResolved,
    saving: creating || updating,
    deleting,
    isDefaultLocked: alreadyDefault || firstAddress,
    makeDefault: makeDefault || alreadyDefault || firstAddress,
    setMakeDefault,
    onField,
    onPostalCode,
    useCurrentLocation,
    save,
    remove,
  };
}
