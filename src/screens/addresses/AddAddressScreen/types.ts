import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';

export type AddAddressScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AddAddressScreen'
>;

export type AddAddressScreenProps = NativeStackScreenProps<RootStackParamList, 'AddAddressScreen'>;

export interface AddressForm {
  label: string;
  houseFlat: string;
  areaStreet: string;
  postalCode: string;
  city: string;
  state: string;
  // Only set when resolved via "use current location" — never required.
  latitude: number | null;
  longitude: number | null;
}
