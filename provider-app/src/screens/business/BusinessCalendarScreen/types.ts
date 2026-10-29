import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/routes';

export type BusinessCalendarRouteProp = RouteProp<RootStackParamList, 'BusinessCalendarScreen'>;

export interface DayForm {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}
