import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';
import { BusinessType } from '@/redux/api/business/types';

export type BusinessCreateNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BusinessCreateScreen'>;

/** Mirrors the web dashboard's `BusinessFormPage` step order for create
 * (type → details → payments → location) — photos are left out here since
 * there's no image-upload endpoint this app's RTK Query layer can call yet;
 * a provider can still add photos from the web dashboard. */
export type BusinessCreateStepId = 'type' | 'details' | 'payments' | 'location';

export const BUSINESS_CREATE_STEPS: BusinessCreateStepId[] = ['type', 'details', 'payments', 'location'];

export interface BusinessCreateForm {
  type: BusinessType;
  categoryId: string;
  subcategoryId: string;
  businessName: string;
  phone: string;
  email: string;
  description: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  depositPercent: string;
  codEnabled: boolean;
  partialPayEnabled: boolean;
}

export type BusinessCreateErrors = Partial<Record<keyof BusinessCreateForm, string>>;
