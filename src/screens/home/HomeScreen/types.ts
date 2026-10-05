import { ImageSourcePropType } from 'react-native';
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
  // Set when the coupon is restricted to one category — tapping the card
  // takes the customer straight there. Null/undefined means it works anywhere.
  categorySlug?: string | null;
  categoryName?: string | null;
}

export interface HeroBanner {
  id: string;
  image: ImageSourcePropType;
  headline: string;
  subtitle: string;
  // Which third of the artwork is left quiet for this text overlay to sit over.
  textPosition: 'left' | 'bottom';
}
