import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';

export type AddReminderNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type AddReminderRouteProp = RouteProp<RootStackParamList, 'AddReminderScreen'>;
