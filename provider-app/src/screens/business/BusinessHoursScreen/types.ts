import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';

export type BusinessHoursRouteProp = RouteProp<RootStackParamList, 'BusinessHoursScreen'>;
export type BusinessHoursNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BusinessHoursScreen'>;

export const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const SHORT_DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** The mockup lists the week Monday-first, with Sunday last. */
export const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

/** "Open now" tile, computed from the SAVED hours for the current local time. */
export interface OpenNowStatus {
  state: 'open' | 'closed' | 'break';
  /** Big value: "Open" / "Closed" / "On break". */
  label: string;
  /** Tiny line under it: "till 8:00 PM" / "opens Mon 10:00 AM" / "back 2:00 PM". */
  detail: string | null;
}
