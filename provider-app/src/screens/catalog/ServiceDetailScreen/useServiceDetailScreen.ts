import { useMemo } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  useDeleteServiceMutation,
  useGetBusinessBookingsQuery,
  useGetCouponsQuery,
  useGetMyBusinessQuery,
  useUpdateServiceMutation,
} from '@/redux/api/business/businessApi';
import { BusinessBooking, Coupon } from '@/redux/api/business/types';
import { ROUTES } from '@/navigation/routes';
import { formatMoney } from '@/utils/money';
import { CouponStatus, couponState } from '@/screens/catalog/CouponsScreen/useCouponsScreen';

import { ServiceDetailNavigationProp, ServiceDetailRouteProp } from './types';

const DAY_MS = 86_400_000;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const UPCOMING_LIMIT = 3;

const nameKey = (name: string) => name.trim().toLowerCase();
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

export function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) {
    return `${m} min`;
  }
  if (m === 0) {
    return `${h} hr`;
  }
  return `${h} hr ${m} min`;
}

function formatTime(d: Date): string {
  const h = d.getHours();
  const m = d.getMinutes();
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

/** "Today" / "Tomorrow" / "Nov 15" + "10:00 AM". */
function slotLabel(iso: string): { day: string; time: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return { day: '—', time: '' };
  }
  const diff = Math.round((startOfDay(d) - startOfDay(new Date())) / DAY_MS);
  const day = diff <= 0 ? 'Today' : diff === 1 ? 'Tomorrow' : `${MONTHS[d.getMonth()]} ${d.getDate()}`;
  return { day, time: formatTime(d) };
}

function lastBookedLabel(ts: number | null): string {
  if (ts === null) {
    return '—';
  }
  const diff = Math.max(0, Math.round((startOfDay(new Date()) - startOfDay(new Date(ts))) / DAY_MS));
  if (diff === 0) {
    return 'Today';
  }
  if (diff === 1) {
    return 'Yesterday';
  }
  return `${diff} days ago`;
}

/** Short payment line for an upcoming booking, e.g. "Cash • ₹699 due". */
function paymentText(b: BusinessBooking): string {
  const due = Math.max(0, b.amountMinor - (b.amountPaidMinor ?? 0));
  const money = (minor: number) => formatMoney(minor, b.currency);
  switch (b.paymentStatus) {
    case 'PAID':
      return `Paid • ${money(b.amountMinor)}`;
    case 'PARTIAL':
      return `Part-paid • ${money(due)} due`;
    case 'REFUNDED':
      return 'Refunded';
    case 'FAILED':
      return `Payment failed • ${money(due)} due`;
  }
  if (b.paymentMethod === 'CASH') {
    return due > 0 ? `Cash • ${money(due)} due` : 'Cash';
  }
  return due > 0 ? `Payment pending • ${money(due)}` : 'Payment pending';
}

export interface UpcomingItem {
  id: string;
  day: string;
  time: string;
  customer: string;
  payment: string;
  status: BusinessBooking['status'];
}

export interface OfferItem {
  id: string;
  code: string;
  value: string;
  status: CouponStatus;
}

const couponValue = (c: Coupon, currency: string) =>
  c.discountType === 'PERCENT' ? `${c.discountValue}% off` : `${formatMoney(c.discountValue, currency)} off`;

export function useServiceDetailScreen() {
  const route = useRoute<ServiceDetailRouteProp>();
  const navigation = useNavigation<ServiceDetailNavigationProp>();
  const { businessId, serviceId } = route.params;

  const { data: business, isLoading, isFetching, refetch } = useGetMyBusinessQuery(businessId);
  const {
    data: bookings,
    isFetching: bookingsFetching,
    refetch: refetchBookings,
  } = useGetBusinessBookingsQuery(businessId);
  const { data: coupons, isFetching: couponsFetching, refetch: refetchCoupons } = useGetCouponsQuery(businessId);
  const [updateService] = useUpdateServiceMutation();
  const [deleteService, { isLoading: deleting }] = useDeleteServiceMutation();

  const service = useMemo(() => business?.services.find((s) => s.id === serviceId), [business, serviceId]);

  // Bookings only carry the service name — match it like the Services list does.
  const serviceBookings = useMemo(() => {
    if (!service) {
      return [];
    }
    const key = nameKey(service.name);
    return (bookings ?? []).filter((b) => !!b.service?.name && nameKey(b.service.name) === key);
  }, [bookings, service]);

  const performance = useMemo(() => {
    let count = 0;
    let revenueMinor = 0;
    let completed = 0;
    let cancelled = 0;
    let noShow = 0;
    let latest: number | null = null;
    for (const b of serviceBookings) {
      if (b.status === 'CANCELLED') {
        cancelled += 1;
        continue;
      }
      count += 1;
      if (b.status === 'COMPLETED') {
        completed += 1;
      }
      if (b.status === 'NO_SHOW') {
        noShow += 1;
      } else {
        revenueMinor += b.amountMinor ?? 0;
      }
      const ts = new Date(b.createdAt || b.startTime).getTime();
      if (!Number.isNaN(ts) && (latest === null || ts > latest)) {
        latest = ts;
      }
    }
    return { count, revenueMinor, completed, cancelled, noShow, lastBooked: lastBookedLabel(latest) };
  }, [serviceBookings]);

  const upcoming = useMemo(() => {
    const now = Date.now();
    const list = serviceBookings
      .filter((b) => {
        if (b.status === 'CANCELLED' || b.status === 'COMPLETED' || b.status === 'NO_SHOW') {
          return false;
        }
        return b.status === 'IN_PROGRESS' || new Date(b.startTime).getTime() >= now;
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    const items: UpcomingItem[] = list.slice(0, UPCOMING_LIMIT).map((b) => ({
      id: b.id,
      ...slotLabel(b.startTime),
      customer: b.user?.fullName || 'Customer',
      payment: paymentText(b),
      status: b.status,
    }));
    return { total: list.length, items };
  }, [serviceBookings]);

  const offers = useMemo<OfferItem[]>(() => {
    if (!service) {
      return [];
    }
    const now = Date.now();
    const key = nameKey(service.name);
    return (coupons ?? [])
      .filter(
        (c) =>
          c.scope === 'SERVICE' &&
          (c.serviceId ? c.serviceId === service.id : !!c.service?.name && nameKey(c.service.name) === key),
      )
      .map((c) => ({
        id: c.id,
        code: c.code,
        value: couponValue(c, service.currency),
        status: couponState(c, now).status,
      }));
  }, [coupons, service]);

  const homeVisit = useMemo(() => {
    if (!service?.travelRequired) {
      return null;
    }
    const base = service.travelBaseFeeMinor ?? 0;
    const perKm = service.travelPerKmMinor ?? 0;
    const baseText = base > 0 ? formatMoney(base, service.currency) : null;
    const kmText = perKm > 0 ? formatMoney(perKm, service.currency) : null;
    const short = [baseText, kmText && `${kmText}/km`].filter(Boolean).join(' + ') || 'No fee';
    let detail = 'No travel fee.';
    if (baseText && kmText) {
      detail = `Base fee ${baseText} + ${kmText} per km.`;
    } else if (baseText) {
      detail = `Base fee ${baseText}.`;
    } else if (kmText) {
      detail = `${kmText} per km.`;
    }
    return { short, detail };
  }, [service]);

  const businessPartial = business?.partialPayEnabled === true;
  const partialAllowed = !!service?.partialPayEnabled && businessPartial;
  const depositPercent = business?.depositPercent;
  let partialDetail = 'Customers pay the full amount.';
  if (partialAllowed) {
    partialDetail =
      depositPercent != null ? `Customers pay ${depositPercent}% online.` : 'Customers pay a deposit online.';
  } else if (service?.partialPayEnabled && !businessPartial) {
    partialDetail = 'Turned off for this business.';
  }

  const toggleActive = () => {
    if (!service) {
      return;
    }
    updateService({ businessId, serviceId: service.id, data: { isActive: service.isActive === false } })
      .unwrap()
      .catch(() => undefined);
  };

  const remove = () => {
    deleteService({ businessId, serviceId })
      .unwrap()
      .then(() => navigation.goBack())
      .catch(() => undefined);
  };

  const refresh = () => {
    refetch();
    refetchBookings();
    refetchCoupons();
  };

  return {
    service,
    businessName: business?.businessName,
    isLoading,
    notFound: !isLoading && !service,
    refreshing: isFetching || bookingsFetching || couponsFetching,
    refresh,
    performance,
    upcoming,
    offers,
    homeVisit,
    partialAllowed,
    partialDetail,
    deleting,
    toggleActive,
    remove,
    goBack: () => navigation.goBack(),
    editService: () => navigation.navigate(ROUTES.SERVICE_FORM, { businessId, serviceId }),
    viewAllBookings: () => navigation.navigate(ROUTES.BOOKINGS_ORDERS, { businessId, tab: 'bookings' }),
    openBooking: (bookingId: string) => navigation.navigate(ROUTES.BOOKING_DETAIL, { bookingId }),
    openOffer: (couponId: string) => navigation.navigate(ROUTES.COUPON_FORM, { businessId, couponId }),
    createOffer: () => navigation.navigate(ROUTES.COUPON_FORM, { businessId }),
  };
}
