import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
  useGetAddressesQuery,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
} from '@/redux/api/address/addressApi';
import { Address } from '@/redux/api/address/types';
import { ROUTES } from '@/navigation/routes';

import { AddressesScreenNavigationProp } from './types';

/** All state and handlers for AddressesScreen — the customer's saved addresses. */
export function useAddressesScreen() {
  const navigation = useNavigation<AddressesScreenNavigationProp>();
  const { data: addresses = [], isLoading } = useGetAddressesQuery();
  const [deleteAddress] = useDeleteAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();

  const addNew = useCallback(() => navigation.navigate(ROUTES.ADD_ADDRESS, {}), [navigation]);

  const edit = useCallback(
    (address: Address) => navigation.navigate(ROUTES.ADD_ADDRESS, { id: address.id }),
    [navigation],
  );

  const makeDefault = useCallback(
    (address: Address) => {
      if (address.isDefault) return;
      updateAddress({ id: address.id, data: { isDefault: true } })
        .unwrap()
        .catch(() => undefined);
    },
    [updateAddress],
  );

  const remove = useCallback(
    (address: Address) => {
      Alert.alert('Delete address', `Delete "${address.label || address.line}"?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteAddress(address.id)
              .unwrap()
              .catch(() => undefined);
          },
        },
      ]);
    },
    [deleteAddress],
  );

  return { addresses, isLoading, addNew, edit, makeDefault, remove };
}
