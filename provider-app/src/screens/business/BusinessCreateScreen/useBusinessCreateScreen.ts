import { useCallback, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { useCreateBusinessMutation } from '@/redux/api/business/businessApi';
import { useGetCategoriesQuery } from '@/redux/api/category/categoryApi';
import { BusinessType } from '@/redux/api/business/types';
import { ROUTES } from '@/navigation/routes';

import {
  BUSINESS_CREATE_STEPS,
  BusinessCreateErrors,
  BusinessCreateForm,
  BusinessCreateNavigationProp,
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

/** A step-by-step wizard — same step order as the web dashboard's
 * `BusinessFormPage` (type → details → payments → location) so the create
 * flow feels like the same product, just laid out for a phone: one step's
 * fields on screen at a time instead of the web's single long form. */
export function useBusinessCreateScreen() {
  const navigation = useNavigation<BusinessCreateNavigationProp>();
  const { data: categories = [] } = useGetCategoriesQuery();
  const [createBusiness, { isLoading: saving }] = useCreateBusinessMutation();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<BusinessCreateForm>(EMPTY);
  const [errors, setErrors] = useState<BusinessCreateErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const categoriesForType = useMemo(
    () => categories.filter((c) => !c.type || c.type === form.type),
    [categories, form.type],
  );
  const selectedCategory = categoriesForType.find((c) => c.id === form.categoryId);
  const subcategories = selectedCategory?.subcategories ?? [];

  const onChange = useCallback(<K extends keyof BusinessCreateForm>(key: K, value: BusinessCreateForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const setType = useCallback((type: BusinessType) => {
    setForm((prev) => ({ ...prev, type, categoryId: '', subcategoryId: '' }));
  }, []);

  const setCategory = useCallback((categoryId: string) => {
    setForm((prev) => ({ ...prev, categoryId, subcategoryId: '' }));
    setErrors((prev) => ({ ...prev, categoryId: undefined, subcategoryId: undefined }));
  }, []);

  const validateStep = useCallback(
    (stepId: (typeof BUSINESS_CREATE_STEPS)[number]): BusinessCreateErrors => {
      const next: BusinessCreateErrors = {};
      if (stepId === 'type') {
        if (!form.categoryId) {
          next.categoryId = 'Please choose a category';
        } else if (subcategories.length > 0 && !form.subcategoryId) {
          next.subcategoryId = 'Please choose your business type';
        }
      }
      if (stepId === 'details') {
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
    setStep((s) => Math.max(s - 1, 0));
  }, []);

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

    try {
      const business = await createBusiness({
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
        depositPercent: form.depositPercent.trim() ? Number(form.depositPercent) : undefined,
        codEnabled: form.type === 'STORE' ? form.codEnabled : undefined,
        partialPayEnabled: form.partialPayEnabled,
      }).unwrap();
      navigation.replace(ROUTES.BUSINESS_DETAIL, { businessId: business.id });
    } catch (err) {
      const msg = (err as { data?: { message?: string } })?.data?.message;
      setServerError(msg || 'Could not create this business. Please try again.');
    }
  }, [form, createBusiness, navigation, validateStep]);

  return {
    step,
    stepId,
    steps: BUSINESS_CREATE_STEPS,
    isLastStep,
    next,
    back,
    form,
    onChange,
    setType,
    setCategory,
    categoriesForType,
    subcategories,
    errors,
    serverError,
    saving,
    submit,
  };
}
