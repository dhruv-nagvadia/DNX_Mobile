import { useNavigation, useRoute } from '@react-navigation/native';

import { useGetMyBusinessQuery, useDeleteServiceMutation, useUpdateServiceMutation } from '@/redux/api/business/businessApi';
import { Service } from '@/redux/api/business/types';
import { ROUTES } from '@/navigation/routes';

import { ServicesNavigationProp, ServicesRouteProp } from './types';

export function useServicesScreen() {
  const route = useRoute<ServicesRouteProp>();
  const navigation = useNavigation<ServicesNavigationProp>();
  const { businessId } = route.params;

  const { data: business, isLoading, isFetching, refetch } = useGetMyBusinessQuery(businessId);
  const [updateService] = useUpdateServiceMutation();
  const [deleteService, { isLoading: deleting }] = useDeleteServiceMutation();

  const toggleActive = (service: Service) => {
    updateService({ businessId, serviceId: service.id, data: { isActive: service.isActive === false } })
      .unwrap()
      .catch(() => undefined);
  };

  const remove = (serviceId: string) => {
    deleteService({ businessId, serviceId }).unwrap().catch(() => undefined);
  };

  return {
    services: business?.services ?? [],
    isLoading,
    refreshing: isFetching,
    refresh: refetch,
    deleting,
    toggleActive,
    remove,
    addService: () => navigation.navigate(ROUTES.SERVICE_FORM, { businessId }),
    editService: (serviceId: string) => navigation.navigate(ROUTES.SERVICE_FORM, { businessId, serviceId }),
  };
}
