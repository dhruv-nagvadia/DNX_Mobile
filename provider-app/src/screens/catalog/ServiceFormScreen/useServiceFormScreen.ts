import { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useCreateServiceMutation, useGetMyBusinessQuery, useUpdateServiceMutation } from '@/redux/api/business/businessApi';

import { ServiceForm, ServiceFormNavigationProp, ServiceFormRouteProp } from './types';

const EMPTY: ServiceForm = {
  name: '',
  description: '',
  price: '',
  hours: '0',
  minutes: '30',
  travelRequired: false,
  travelBaseFee: '',
  travelPerKm: '',
  partialPayEnabled: false,
};

/** Ports `frontend/src/components/ServicesManager/useServicesManager.ts`'s form logic. */
export function useServiceFormScreen() {
  const route = useRoute<ServiceFormRouteProp>();
  const navigation = useNavigation<ServiceFormNavigationProp>();
  const { businessId, serviceId } = route.params;
  const isNew = !serviceId;

  const { data: business } = useGetMyBusinessQuery(businessId);
  const [createService, { isLoading: creating }] = useCreateServiceMutation();
  const [updateService, { isLoading: updating }] = useUpdateServiceMutation();

  const [form, setForm] = useState<ServiceForm>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const partialPayLocked = business?.partialPayEnabled === false;

  useEffect(() => {
    if (isNew || !business) return;
    const s = business.services.find((x) => x.id === serviceId);
    if (!s) return;
    setForm({
      name: s.name,
      description: s.description ?? '',
      price: String(s.priceMinor / 100),
      hours: String(Math.floor(s.durationMin / 60)),
      minutes: String(s.durationMin % 60),
      travelRequired: !!s.travelRequired,
      travelBaseFee: s.travelBaseFeeMinor ? String(s.travelBaseFeeMinor / 100) : '',
      travelPerKm: s.travelPerKmMinor ? String(s.travelPerKmMinor / 100) : '',
      partialPayEnabled: !!s.partialPayEnabled,
    });
  }, [isNew, business, serviceId]);

  const onChange = useCallback(<K extends keyof ServiceForm>(key: K, value: ServiceForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const submit = useCallback(async () => {
    setError(null);
    const price = Number(form.price);
    const durationMin = (Number(form.hours) || 0) * 60 + (Number(form.minutes) || 0);

    if (!form.name.trim()) return setError('Enter a service name');
    if (!Number.isFinite(price) || price <= 0) return setError('Enter a valid price');
    if (durationMin <= 0) return setError('Enter a duration');

    const data = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      price,
      durationMin,
      travelRequired: form.travelRequired,
      travelBaseFee: form.travelRequired && form.travelBaseFee ? Number(form.travelBaseFee) : undefined,
      travelPerKm: form.travelRequired && form.travelPerKm ? Number(form.travelPerKm) : undefined,
      partialPayEnabled: partialPayLocked ? false : form.partialPayEnabled,
    };

    try {
      if (isNew) {
        await createService({ businessId, data }).unwrap();
      } else {
        await updateService({ businessId, serviceId: serviceId!, data }).unwrap();
      }
      navigation.goBack();
    } catch (err) {
      const msg = (err as { data?: { message?: string } })?.data?.message;
      setError(msg || 'Could not save this service. Please try again.');
    }
  }, [form, isNew, businessId, serviceId, createService, updateService, partialPayLocked, navigation]);

  return {
    isNew,
    form,
    onChange,
    error,
    saving: creating || updating,
    partialPayLocked,
    submit,
  };
}
