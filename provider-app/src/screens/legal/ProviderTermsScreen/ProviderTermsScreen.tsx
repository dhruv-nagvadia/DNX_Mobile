import React from 'react';

import { PROVIDER_TERMS_LAST_UPDATED, PROVIDER_TERMS_SECTIONS } from '@/utils/legalContent';

import { LegalLayout } from '../LegalLayout';

/** Provider Terms — from sign-up/login and Profile → Help & legal. */
export default function ProviderTermsScreen() {
  return <LegalLayout title="Provider Terms" lastUpdated={PROVIDER_TERMS_LAST_UPDATED} sections={PROVIDER_TERMS_SECTIONS} />;
}
