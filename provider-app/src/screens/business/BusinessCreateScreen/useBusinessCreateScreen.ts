import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';

import { useCreateBusinessMutation, useUploadBusinessImagesMutation } from '@/redux/api/business/businessApi';
import { useGetCategoriesQuery } from '@/redux/api/category/categoryApi';
import { Business, BusinessType } from '@/redux/api/business/types';
import { ROUTES } from '@/navigation/routes';
import { lookupPincode } from '@/utils/pincode';
import { getDeviceLocation } from '@/utils/location';

import { MAX_IMAGES } from '../BusinessPhotosScreen/useBusinessPhotosScreen';
import {
  BUSINESS_CREATE_STEPS,
  BusinessCreateErrors,
  BusinessCreateForm,
  BusinessCreateNavigationProp,
  BusinessCreateStepId,
  LocalPhoto,
} from './types';

const EMPTY: BusinessCreateForm = {
  type: 'SERVICE',
  categoryId: '',
  subcategoryId: '',
  businessName: '',
  phone: '',
  email: '',
  description: '',
  addressLine: '',
  city: '',
  state: '',
  postalCode: '',
  depositPercent: '',
  codEnabled: true,
  partialPayEnabled: true,
};

const PHONE_RE = /^[0-9+\-\s()]{8,15}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Backend default when no deposit % is set (`provider.depositPercent || 20`). */
export const DEFAULT_DEPOSIT = 20;
/** Stepper bounds — the API accepts 0–100; 0 would just fall back to the
 * default 20%, so the stepper starts at one step above 0. */
export const DEPOSIT_STEP = 5;
export const DEPOSIT_MIN = DEPOSIT_STEP;
export const DEPOSIT_MAX = 100;
export const MAX_PHOTOS = MAX_IMAGES;

/** A step-by-step wizard — type → details → payments → photos → location,
 * then a "done" view with next steps once the business exists. */
export function useBusinessCreateScreen() {
  const navigation = useNavigation<BusinessCreateNavigationProp>();
  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();
  const [createBusiness, { isLoading: creating }] = useCreateBusinessMutation();
  const [uploadImages, { isLoading: uploading }] = useUploadBusinessImagesMutation();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<BusinessCreateForm>(EMPTY);
  const [errors, setErrors] = useState<BusinessCreateErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<LocalPhoto[]>([]);
  const [created, setCreated] = useState<Business | null>(null);

  const saving = creating || uploading;

  const categoriesForType = useMemo(
    () => categories.filter((c) => !c.type || c.type === form.type),
    [categories, form.type],
  );
  const selectedCategory = categoriesForType.find((c) => c.id === form.categoryId);
  const subcategories = selectedCategory?.subcategories ?? [];

  // PIN-code auto-fill: the India Post match for the current PIN, and which of
  // City/State were filled by it (typing in either clears its "Auto-filled" tag).
  const [pinMatch, setPinMatch] = useState<{ city: string; state: string } | null>(null);
  const [autoFilled, setAutoFilled] = useState({ city: false, state: false });

  // "Use my current location" — GPS coordinates saved with the business (so it
  // shows on the map / in "nearest" search) plus a best-effort address fill.
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const locateMe = useCallback(async () => {
    setLocating(true);
    const loc = await getDeviceLocation();
    setLocating(false);
    if (!loc) {
      Alert.alert(
        "Couldn't get your location",
        'Allow location access for DNX in your phone settings, turn on GPS, then try again.',
      );
      return;
    }
    setCoords({ lat: loc.lat, lng: loc.lng });
    // Fill only empty fields — never overwrite what the owner typed.
    setForm((prev) => ({
      ...prev,
      addressLine: prev.addressLine.trim() ? prev.addressLine : loc.address ?? prev.addressLine,
      postalCode: prev.postalCode.trim() ? prev.postalCode : loc.postalCode ?? prev.postalCode,
      city: prev.city.trim() ? prev.city : loc.city ?? prev.city,
      state: prev.state.trim() ? prev.state : loc.state ?? prev.state,
    }));
    setAutoFilled((prev) => ({
      city: prev.city || (!cityRef.current.trim() && !!loc.city),
      state: prev.state || (!stateRef.current.trim() && !!loc.state),
    }));
  }, []);

  const onChange = useCallback(<K extends keyof BusinessCreateForm>(key: K, value: BusinessCreateForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (key === 'city' || key === 'state') {
      setAutoFilled((prev) => ({ ...prev, [key]: false }));
    }
  }, []);

  // Latest values for the async lookup below, without re-running it on every keystroke.
  const cityRef = useRef(form.city);
  const stateRef = useRef(form.state);
  const autoFilledRef = useRef(autoFilled);
  cityRef.current = form.city;
  stateRef.current = form.state;
  autoFilledRef.current = autoFilled;

  const pin = form.postalCode.trim();
  useEffect(() => {
    if (!/^\d{6}$/.test(pin)) {
      setPinMatch(null);
      return;
    }
    let cancelled = false;
    lookupPincode(pin).then((match) => {
      if (cancelled) {
        return;
      }
      setPinMatch(match);
      if (!match) {
        return;
      }
      // Fill only fields that are empty or were auto-filled before — never
      // overwrite something the owner typed themselves.
      const fillCity = !cityRef.current.trim() || autoFilledRef.current.city;
      const fillState = !stateRef.current.trim() || autoFilledRef.current.state;
      setForm((prev) => ({
        ...prev,
        city: fillCity ? match.city : prev.city,
        state: fillState ? match.state : prev.state,
      }));
      setAutoFilled({ city: fillCity, state: fillState });
    });
    return () => {
      cancelled = true;
    };
  }, [pin]);

  const setType = useCallback((type: BusinessType) => {
    setForm((prev) => (prev.type === type ? prev : { ...prev, type, categoryId: '', subcategoryId: '' }));
  }, []);

  const setCategory = useCallback((categoryId: string) => {
    setForm((prev) => ({ ...prev, categoryId, subcategoryId: '' }));
    setErrors((prev) => ({ ...prev, categoryId: undefined, subcategoryId: undefined }));
  }, []);

  // ── Deposit stepper ─────────────────────────────────────────────────────
  const depositValue = Number(form.depositPercent) > 0 ? Number(form.depositPercent) : DEFAULT_DEPOSIT;
  const changeDeposit = useCallback(
    (direction: -1 | 1) => {
      const nextValue = Math.min(DEPOSIT_MAX, Math.max(DEPOSIT_MIN, depositValue + direction * DEPOSIT_STEP));
      onChange('depositPercent', String(nextValue));
    },
    [depositValue, onChange],
  );

  // ── Photos (local until the business exists) ───────────────────────────
  const addPhotos = useCallback(async () => {
    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) {
      Alert.alert('Photo limit reached', `Maximum of ${MAX_PHOTOS} photos — remove one to add another.`);
      return;
    }
    const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: remaining, quality: 0.8 });
    if (result.didCancel || !result.assets?.length) {
      return;
    }
    const stamp = Date.now();
    const picked: LocalPhoto[] = [];
    result.assets.forEach((asset, i) => {
      if (asset.uri) {
        picked.push({
          uri: asset.uri,
          name: asset.fileName ?? `photo-${stamp}-${i}.jpg`,
          type: asset.type ?? 'image/jpeg',
        });
      }
    });
    if (result.assets.length > remaining) {
      Alert.alert(
        'Too many photos',
        `Only the first ${remaining} photo${remaining === 1 ? '' : 's'} were added (up to ${MAX_PHOTOS} in total).`,
      );
    }
    setPhotos((prev) => [...prev, ...picked].slice(0, MAX_PHOTOS));
  }, [photos.length]);

  const removePhoto = useCallback((index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // ── Validation / navigation between steps ───────────────────────────────
  const validateStep = useCallback(
    (id: BusinessCreateStepId): BusinessCreateErrors => {
      const next: BusinessCreateErrors = {};
      if (id === 'type') {
        if (!form.categoryId) {
          next.categoryId = 'Please choose a category';
        } else if (subcategories.length > 0 && !form.subcategoryId) {
          next.subcategoryId = 'Please choose your business type';
        }
      }
      if (id === 'details') {
        if (!form.businessName.trim() || form.businessName.trim().length < 2) {
          next.businessName = 'Enter a valid business name';
        }
        if (!form.phone.trim()) {
          next.phone = 'Business phone is required';
        } else if (!PHONE_RE.test(form.phone.trim())) {
          next.phone = 'Enter a valid phone number';
        }
        if (form.email.trim() && !EMAIL_RE.test(form.email.trim())) {
          next.email = 'Enter a valid email';
        }
      }
      return next;
    },
    [form, subcategories.length],
  );

  const stepId = BUSINESS_CREATE_STEPS[step];
  const isLastStep = step === BUSINESS_CREATE_STEPS.length - 1;

  const next = useCallback(() => {
    const stepErrors = validateStep(stepId);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, BUSINESS_CREATE_STEPS.length - 1));
  }, [stepId, validateStep]);

  const back = useCallback(() => {
    setErrors({});
    setServerError(null);
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  /** Anything entered yet? Decides whether ✕ asks before discarding. */
  const isDirty = useMemo(
    () => photos.length > 0 || (Object.keys(EMPTY) as (keyof BusinessCreateForm)[]).some((k) => form[k] !== EMPTY[k]),
    [form, photos.length],
  );

  const close = useCallback(() => {
    if (!isDirty) {
      navigation.goBack();
      return;
    }
    Alert.alert('Discard this business?', "What you've entered so far will be lost.", [
      { text: 'Keep editing', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  }, [isDirty, navigation]);

  // ── Create (+ upload photos) ────────────────────────────────────────────
  const submit = useCallback(async () => {
    setServerError(null);
    const typeErrors = validateStep('type');
    const detailErrors = validateStep('details');
    const allErrors = { ...typeErrors, ...detailErrors };
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setStep(typeErrors.categoryId || typeErrors.subcategoryId ? 0 : 1);
      return;
    }

    let business: Business;
    try {
      business = await createBusiness({
        businessName: form.businessName.trim(),
        type: form.type,
        categoryId: form.categoryId,
        subcategoryId: form.subcategoryId || undefined,
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        description: form.description.trim() || undefined,
        addressLine: form.addressLine.trim() || undefined,
        city: form.city.trim() || undefined,
        state: form.state.trim() || undefined,
        postalCode: form.postalCode.trim() || undefined,
        latitude: coords?.lat,
        longitude: coords?.lng,
        depositPercent: form.depositPercent.trim() ? Number(form.depositPercent) : undefined,
        codEnabled: form.type === 'STORE' ? form.codEnabled : undefined,
        partialPayEnabled: form.partialPayEnabled,
      }).unwrap();
    } catch (err) {
      const msg = (err as { data?: { message?: string } })?.data?.message;
      setServerError(msg || 'Could not create this business. Please try again.');
      return;
    }

    if (photos.length > 0) {
      // Same multipart shape as BusinessPhotosScreen: one `images` part per file,
      // in batches of 8 — the server accepts at most 8 files per request.
      try {
        for (let i = 0; i < photos.length; i += 8) {
          const formData = new FormData();
          photos.slice(i, i + 8).forEach((photo) => {
            formData.append('images', { uri: photo.uri, name: photo.name, type: photo.type } as unknown as Blob);
          });
          business = await uploadImages({ id: business.id, formData }).unwrap();
        }
      } catch {
        Alert.alert(
          'Photos not uploaded',
          "Business created, but photos couldn't be uploaded — add them from the Photos screen.",
        );
      }
    }
    setCreated(business);
  }, [form, photos, coords, createBusiness, uploadImages, validateStep]);

  // ── Done view actions ───────────────────────────────────────────────────
  const goToBusiness = useCallback(() => {
    if (created) {
      navigation.replace(ROUTES.BUSINESS_DETAIL, { businessId: created.id });
    }
  }, [created, navigation]);

  const goToCatalog = useCallback(() => {
    if (!created) {
      return;
    }
    const isStore = (created.type ?? form.type) === 'STORE';
    navigation.navigate(isStore ? ROUTES.PRODUCTS : ROUTES.SERVICES, { businessId: created.id });
  }, [created, form.type, navigation]);

  const goToHours = useCallback(() => {
    if (created) {
      navigation.navigate(ROUTES.BUSINESS_HOURS, { businessId: created.id });
    }
  }, [created, navigation]);

  const goToPhotos = useCallback(() => {
    if (created) {
      navigation.navigate(ROUTES.BUSINESS_PHOTOS, { businessId: created.id });
    }
  }, [created, navigation]);

  const backToList = useCallback(() => navigation.goBack(), [navigation]);

  return {
    step,
    stepId,
    steps: BUSINESS_CREATE_STEPS,
    isLastStep,
    next,
    back,
    close,
    form,
    onChange,
    pinMatch,
    autoFilled,
    locationSaved: !!coords,
    locating,
    locateMe,
    setType,
    setCategory,
    categoriesForType,
    categoriesLoading,
    subcategories,
    errors,
    serverError,
    saving,
    submit,
    depositValue,
    changeDeposit,
    photos,
    addPhotos,
    removePhoto,
    created,
    goToBusiness,
    goToCatalog,
    goToHours,
    goToPhotos,
    backToList,
  };
}
