import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/routes';

export type BusinessHoursRouteProp = RouteProp<RootStackParamList, 'BusinessHoursScreen'>;

export const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const SHORT_DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** The mockup lists the week Monday-first, with Sunday last. */
export const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
