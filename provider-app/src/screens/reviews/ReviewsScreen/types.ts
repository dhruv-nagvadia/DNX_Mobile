import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/routes';

export type ReviewsRouteProp = RouteProp<RootStackParamList, 'ReviewsScreen'>;

export type ReviewSort = 'newest' | 'oldest' | 'highest' | 'lowest';
export type ReviewTypeFilter = 'all' | 'business' | 'product';
export type RatingFilter = 'all' | 'needsReply' | '5' | '4' | 'low';

/** A business or product review normalised into one list row. */
export interface ReviewItem {
  /** Unique across both kinds (`b:<id>` / `p:<id>`). */
  key: string;
  kind: 'business' | 'product';
  id: string;
  rating: number;
  comment: string | null;
  providerReply: string | null;
  repliedAt: string | null;
  createdAt: string;
  userName: string;
  businessId: string;
  businessName: string;
  product?: { id: string; name: string; imageUrl: string | null };
}
