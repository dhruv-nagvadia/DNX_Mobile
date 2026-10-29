import { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useCreateProductMutation, useGetMyBusinessQuery, useUpdateProductMutation } from '@/redux/api/business/businessApi';
import { Measure } from '@/redux/api/business/types';
import { measureUnits, splitAmount, toBase, unitFactor } from '@/utils/units';

import { ProductForm, ProductFormNavigationProp, ProductFormRouteProp } from './types';

const EMPTY: ProductForm = {
  name: '',
  description: '',
  measure: 'count',
  unit: 'piece',
  price: '',
  priceQty: '1',
  section: '',
  trackStock: true,
  stockQty: '',
  stepQty: '1',
  codEnabled: false,
  partialPayEnabled: false,
};

/**
 * Ports `frontend/src/components/ProductsManager/useProductsManager.ts`'s form
 * logic. One unit is shared across price-qty/stock/step for simplicity (the
 * web form lets each differ, but every value still round-trips through the
 * same `toBase`/`splitAmount` math, so this stays numerically identical).
 */
export function useProductFormScreen() {
  const route = useRoute<ProductFormRouteProp>();
  const navigation = useNavigation<ProductFormNavigationProp>();
  const { businessId, productId } = route.params;
  const isNew = !productId;

  const { data: business } = useGetMyBusinessQuery(businessId);
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

  const [form, setForm] = useState<ProductForm>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const codLocked = business?.codEnabled === false;
  const partialPayLocked = business?.partialPayEnabled === false;

  useEffect(() => {
    if (isNew || !business) return;
    const p = business.products?.find((x) => x.id === productId);
    if (!p) return;
    const priceSplit = splitAmount(p.priceQty, p.measure);
    const factor = unitFactor(p.measure, priceSplit.unit);
    setForm({
      name: p.name,
      description: p.description ?? '',
      measure: p.measure,
      unit: priceSplit.unit,
      price: String(p.priceMinor / 100),
      priceQty: String(priceSplit.value),
      section: p.section ?? '',
      trackStock: !p.unlimitedStock,
      stockQty: String(p.stockQty / factor),
      stepQty: String(p.stepQty / factor),
      codEnabled: !!p.codEnabled,
      partialPayEnabled: !!p.partialPayEnabled,
    });
  }, [isNew, business, productId]);

  const onChange = useCallback(<K extends keyof ProductForm>(key: K, value: ProductForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setMeasure = useCallback((measure: Measure) => {
    setForm((prev) => ({ ...prev, measure, unit: measureUnits(measure)[0].value }));
  }, []);

  const submit = useCallback(async () => {
    setError(null);
    const price = Number(form.price);
    const priceQty = Number(form.priceQty);

    if (!form.name.trim()) return setError('Enter a product name');
    if (!Number.isFinite(price) || price <= 0) return setError('Enter a valid price');
    if (!Number.isFinite(priceQty) || priceQty <= 0) return setError('Enter a valid quantity');
    if (form.trackStock && (!form.stockQty.trim() || Number(form.stockQty) < 0)) {
      return setError('Enter the stock you have');
    }

    const data = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      measure: form.measure,
      price,
      priceQty: toBase(priceQty, form.measure, form.unit),
      section: form.section.trim() || undefined,
      unlimitedStock: !form.trackStock,
      stockQty: form.trackStock ? toBase(Number(form.stockQty) || 0, form.measure, form.unit) : undefined,
      stepQty: toBase(Number(form.stepQty) || 1, form.measure, form.unit),
      codEnabled: codLocked ? false : form.codEnabled,
      partialPayEnabled: partialPayLocked ? false : form.partialPayEnabled,
    };

    try {
      if (isNew) {
        await createProduct({ businessId, data }).unwrap();
      } else {
        await updateProduct({ businessId, productId: productId!, data }).unwrap();
      }
      navigation.goBack();
    } catch (err) {
      const msg = (err as { data?: { message?: string } })?.data?.message;
      setError(msg || 'Could not save this product. Please try again.');
    }
  }, [form, isNew, businessId, productId, createProduct, updateProduct, codLocked, partialPayLocked, navigation]);

  return {
    isNew,
    form,
    onChange,
    setMeasure,
    unitOptions: measureUnits(form.measure),
    error,
    saving: creating || updating,
    codLocked,
    partialPayLocked,
    submit,
  };
}
