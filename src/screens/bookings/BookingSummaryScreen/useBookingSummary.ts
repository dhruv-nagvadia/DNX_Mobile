import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useAppSelector } from '@/redux/hooks';
import { useGetProviderByIdQuery } from '@/redux/api/provider/providerApi';
import { useGetAddressesQuery } from '@/redux/api/address/addressApi';
import { Address } from '@/redux/api/address/types';
import { PaymentMethod } from '@/redux/api/booking/types';
import { haversineKm } from '@/utils/geo';
import { formatAddress } from '@/utils/formatAddress';
import { ROUTES } from '@/navigation/routes';

import { BookingSummaryRouteProp } from './types';

/** Review-and-pay step between picking a slot and choosing a payment method. */
export function useBookingSummary() {
  const navigation = useNavigation<{ navigate: (r: string, p?: object) => void; goBack: () => void }>();
  const { params } = useRoute<BookingSummaryRouteProp>();

  const { data: provider, isLoading } = useGetProviderByIdQuery({ id: params.providerId });
  const service = provider?.services.find((s) => s.id === params.serviceId) ?? null;

  // Coupon applied via the dedicated Coupons screen (or a quick-apply chip).
  const appliedCoupon = useAppSelector((s) => s.coupons.applied[params.providerId]) ?? null;

  const [methodOpen, setMethodOpen] = useState(false);

  // On-location service — the provider travels to the customer, so an
  // address is required and a distance-based travel fee is added.
  const needsAddress = !!service?.travelRequired;
  const { data: addresses = [] } = useGetAddressesQuery(undefined, { skip: !needsAddress });
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  // Default to the customer's default address the first time addresses load.
  useEffect(() => {
    if (!needsAddress || selectedAddress || addresses.length === 0) return;
    setSelectedAddress(addresses.find((a) => a.isDefault) ?? addresses[0]);
  }, [needsAddress, addresses, selectedAddress]);

  const travelFeeMinor =
    needsAddress && service && selectedAddress && provider?.latitude != null && provider?.longitude != null && selectedAddress.latitude != null && selectedAddress.longitude != null
      ? service.travelBaseFeeMinor! +
        Math.round(
          service.travelPerKmMinor! *
            haversineKm(provider.latitude, provider.longitude, selectedAddress.latitude, selectedAddress.longitude),
        )
      : needsAddress && service
        ? service.travelBaseFeeMinor ?? 0
        : 0;

  const total = (service?.priceMinor ?? 0) - (appliedCoupon?.discountMinor ?? 0) + travelFeeMinor;

  const openAddressModal = useCallback(() => setAddressModalOpen(true), []);
  const closeAddressModal = useCallback(() => setAddressModalOpen(false), []);
  const selectAddress = useCallback((a: Address) => {
    setSelectedAddress(a);
    setAddressModalOpen(false);
  }, []);

  // A slot picked a while ago (e.g. spent time browsing offers here) can go
  // stale by the time the customer actually pays — check before relying on it.
  const isSlotExpired = useCallback(
    () => new Date(params.startTime).getTime() < Date.now(),
    [params.startTime],
  );

  const onSlotGone = useCallback(
    (message: string) => {
      setMethodOpen(false);
      Alert.alert('Time no longer available', message, [
        { text: 'Pick another time', onPress: () => navigation.goBack() },
      ]);
    },
    [navigation],
  );

  const openPayment = useCallback(() => {
    if (isSlotExpired()) {
      onSlotGone('This time has passed. Please pick another time.');
      return;
    }
    if (needsAddress && !selectedAddress) {
      Alert.alert('Choose an address', 'This service requires an address for the provider to visit.');
      setAddressModalOpen(true);
      return;
    }
    setMethodOpen(true);
  }, [isSlotExpired, onSlotGone, needsAddress, selectedAddress]);
  const closePayment = useCallback(() => setMethodOpen(false), []);

  // Hands off to a dedicated full-screen flow that creates the booking and
  // (for online/partial) opens Razorpay itself — mirrors the cart's
  // CheckoutProcessingScreen, and for the same reason: a native checkout
  // sheet needs to open from a plain, fully-settled screen, not from within
  // this modal.
  const chooseMethod = useCallback(
    (method: PaymentMethod) => {
      if (!provider || !service) return;
      if (isSlotExpired()) {
        onSlotGone('This time has passed. Please pick another time.');
        return;
      }
      setMethodOpen(false);
      navigation.navigate(ROUTES.BOOKING_PROCESSING, {
        providerId: provider.id,
        providerName: provider.businessName,
        serviceId: service.id,
        serviceName: service.name,
        startTime: params.startTime,
        method,
        couponCode: appliedCoupon?.code,
        currency: service.currency ?? 'INR',
        // The full formatted address (not just `.line`) is what gets
        // snapshotted onto the booking — it's what the provider and the
        // customer's own booking details later see, so it needs the
        // city/state/PIN too, not just house/flat + area/street.
        serviceAddress: selectedAddress
          ? {
              line: formatAddress(selectedAddress),
              latitude: selectedAddress.latitude ?? undefined,
              longitude: selectedAddress.longitude ?? undefined,
            }
          : undefined,
      });
    },
    [provider, service, params.startTime, appliedCoupon, selectedAddress, isSlotExpired, onSlotGone, navigation],
  );

  const goToAddAddress = useCallback(() => {
    setAddressModalOpen(false);
    navigation.navigate(ROUTES.ADD_ADDRESS, {});
  }, [navigation]);

  return {
    provider,
    service,
    isLoading,
    startTime: params.startTime,
    total,
    currency: service?.currency ?? 'INR',
    depositPercent: provider?.depositPercent || 20,
    appliedCoupon,
    // On-location address
    needsAddress,
    travelFeeMinor,
    addresses,
    selectedAddress,
    addressModalOpen,
    openAddressModal,
    closeAddressModal,
    selectAddress,
    goToAddAddress,
    // Payment method sheet
    methodOpen,
    openPayment,
    closePayment,
    chooseMethod,
  };
}
