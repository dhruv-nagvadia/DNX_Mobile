import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';

export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;

// ── Static/mock content (swap for real data later) ────────────────────
export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  bg: string;
}

export interface RecentProvider {
  id: string;
  name: string;
  type: string;
  categorySlug: string;
  rating: number;
}

export interface TrustStat {
  id: string;
  value: string;
  label: string;
}
