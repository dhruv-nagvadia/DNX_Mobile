import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';

export type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'LoginScreen'
>;

export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginErrors {
  email?: string;
  password?: string;
}
