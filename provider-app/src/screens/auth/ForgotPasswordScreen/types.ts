import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';

export type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ForgotPasswordScreen'
>;

export type ForgotPasswordStep = 'request' | 'reset';

export interface ForgotPasswordForm {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ForgotPasswordErrors {
  email?: string;
  otp?: string;
  newPassword?: string;
}
