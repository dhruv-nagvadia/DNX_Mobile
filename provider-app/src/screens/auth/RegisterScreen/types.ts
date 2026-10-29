import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';

export type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RegisterScreen'
>;

export interface RegisterForm {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
}
