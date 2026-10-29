import { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useGetMyBusinessQuery, useUpdateBusinessMutation } from '@/redux/api/business/businessApi';

import { BusinessEditForm, BusinessEditNavigationProp, BusinessEditRouteProp } from './types';

const EMPTY: BusinessEditForm = {
  businessName: '',
  phone: '',
  email: '',
  description: '',
  addressLine: '',
  city: '',
  state: '',
  postalCode: '',
};

/**
 * A single-screen edit for a business's own details — a simpler counterpart
 * to the web dashboard's multi-step create/edit wizard (which also handles
 * category/type selection, photos, and location picking; this screen only
 * edits the fields a provider would plausibly change day-to-day from a phone).
 */
export function useBusinessEditScreen() {
  const route = useRoute<BusinessEditRouteProp>();
  const navigation = useNavigation<BusinessEditNavigationProp>();
  const { businessId } = route.params;

  const { data: business, isLoading } = useGetMyBusinessQuery(businessId);
  const [updateBusiness, { isLoading: saving }] = useUpdateBusinessMutation();

  const [form, setForm] = useState<BusinessEditForm>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!business) return;
    setForm({
      businessName: business.businessName,
      phone: business.phone,
      email: business.email ?? '',
      description: business.description ?? '',
      addressLine: business.addressLine ?? '',
      city: business.city ?? '',
      state: business.state ?? '',
      postalCode: business.postalCode ?? '',
    });
  }, [business]);

  const onChange = useCallback((key: keyof BusinessEditForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const save = useCallback(async () => {
    setError(null);
    if (!form.businessName.trim()) return setError('Business name is required');
    if (!form.phone.trim()) return setError('Phone is required');

    try {
      await updateBusiness({
        id: businessId,
        data: {
          businessName: form.businessName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          description: form.description.trim() || undefined,
          addressLine: form.addressLine.trim() || undefined,
          city: form.city.trim() || undefined,
          state: form.state.trim() || undefined,
          postalCode: form.postalCode.trim() || undefined,
        },
      }).unwrap();
      navigation.goBack();
    } catch (err) {
      const data = (err as { data?: { message?: string } })?.data;
      setError(data?.message || 'Could not save your changes. Please try again.');
    }
  }, [form, businessId, updateBusiness, navigation]);

  return { isLoading, saving, form, onChange, error, save };
}
