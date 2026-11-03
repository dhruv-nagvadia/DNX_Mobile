import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';
import { BusinessType } from '@/redux/api/business/types';

export type BusinessCreateNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BusinessCreateScreen'>;

/** Mockup "Mobile Business Onboarding Flow.png": type → details → payments →
 * photos → location, then a "Done" screen once the business is created.
 * Photos are held locally (the upload endpoint needs the new business id) and
 * uploaded right after the create call succeeds. */
export type BusinessCreateStepId = 'type' | 'details' | 'payments' | 'photos' | 'location';

export const BUSINESS_CREATE_STEPS: BusinessCreateStepId[] = ['type', 'details', 'payments', 'photos', 'location'];

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

/** A photo picked from the library, waiting to be uploaded once the business exists. */
export interface LocalPhoto {
  uri: string;
  name: string;
  type: string;
}
