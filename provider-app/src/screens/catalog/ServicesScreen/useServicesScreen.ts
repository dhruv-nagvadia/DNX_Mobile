import { useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  useDeleteServiceMutation,
  useGetBusinessBookingsQuery,
  useGetMyBusinessQuery,
  useUpdateServiceMutation,
} from '@/redux/api/business/businessApi';
import { Service } from '@/redux/api/business/types';
import { ROUTES } from '@/navigation/routes';

import { ServicesNavigationProp, ServicesRouteProp } from './types';

export type ServiceFilter = 'all' | 'active' | 'inactive' | 'home';

export const FILTERS: { key: ServiceFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'inactive', label: 'Inactive' },
  { key: 'home', label: 'Home visit' },
];

export type ServiceStats = { count: number; revenueMinor: number };

const EMPTY_STATS: ServiceStats = { count: 0, revenueMinor: 0 };

const nameKey = (name: string) => name.trim().toLowerCase();

export function useServicesScreen() {
  const route = useRoute<ServicesRouteProp>();
  const navigation = useNavigation<ServicesNavigationProp>();
  const { businessId } = route.params;

  const { data: business, isLoading, isFetching, refetch } = useGetMyBusinessQuery(businessId);
  const {
    data: bookings,
    isFetching: bookingsFetching,
    refetch: refetchBookings,
  } = useGetBusinessBookingsQuery(businessId);
  const [updateService] = useUpdateServiceMutation();
  const [deleteService, { isLoading: deleting }] = useDeleteServiceMutation();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ServiceFilter>('all');

  const services = useMemo(() => business?.services ?? [], [business?.services]);

  // Bookings carry only the service name, so stats are keyed by name.
  // Cancelled bookings count towards neither bookings nor revenue.
  const statsByName = useMemo(() => {
    const map = new Map<string, ServiceStats>();
    for (const b of bookings ?? []) {
      if (b.status === 'CANCELLED' || !b.service?.name) {
        continue;
      }
      const key = nameKey(b.service.name);
      const prev = map.get(key) ?? EMPTY_STATS;
      map.set(key, { count: prev.count + 1, revenueMinor: prev.revenueMinor + (b.amountMinor ?? 0) });
    }
    return map;
  }, [bookings]);

  const statsFor = (s: Service): ServiceStats => statsByName.get(nameKey(s.name)) ?? EMPTY_STATS;

  // Summary tiles are over ALL services, not the filtered list.
  const summary = useMemo(() => {
    const active = services.filter((s) => s.isActive !== false);
    const priced = active.length > 0 ? active : services;
    const avgPriceMinor =
      priced.length > 0 ? priced.reduce((sum, s) => sum + s.priceMinor, 0) / priced.length : null;

    let top: { service: Service; count: number } | null = null;
    for (const s of services) {
      const count = statsByName.get(nameKey(s.name))?.count ?? 0;
      if (count > 0 && (!top || count > top.count)) {
        top = { service: s, count };
      }
    }

    return {
      activeCount: active.length,
      avgPriceMinor,
      avgCurrency: priced[0]?.currency ?? 'INR',
      mostBooked: top,
    };
  }, [services, statsByName]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services.filter((s) => {
      const active = s.isActive !== false;
      if (filter === 'active' && !active) {
        return false;
      }
      if (filter === 'inactive' && active) {
        return false;
      }
      if (filter === 'home' && !s.travelRequired) {
        return false;
      }
      if (!q) {
        return true;
      }
      return [s.name, s.description].some((t) => t?.toLowerCase().includes(q));
    });
  }, [services, query, filter]);

  const toggleActive = (service: Service) => {
    updateService({ businessId, serviceId: service.id, data: { isActive: service.isActive === false } })
      .unwrap()
      .catch(() => undefined);
  };

  const remove = (serviceId: string) => {
    deleteService({ businessId, serviceId }).unwrap().catch(() => undefined);
  };

  const refresh = () => {
    refetch();
    refetchBookings();
  };

  return {
    businessName: business?.businessName,
    services,
    filtered,
    summary,
    statsFor,
    query,
    setQuery,
    filter,
    setFilter,
    isLoading,
    refreshing: isFetching || bookingsFetching,
    refresh,
    deleting,
    toggleActive,
    remove,
    goBack: () => navigation.goBack(),
    addService: () => navigation.navigate(ROUTES.SERVICE_FORM, { businessId }),
    editService: (serviceId: string) => navigation.navigate(ROUTES.SERVICE_FORM, { businessId, serviceId }),
    openService: (serviceId: string) => navigation.navigate(ROUTES.SERVICE_DETAIL, { businessId, serviceId }),
  };
}
