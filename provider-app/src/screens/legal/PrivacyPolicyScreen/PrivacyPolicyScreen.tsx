import React from 'react';

import { LEGAL_LAST_UPDATED, PRIVACY_POLICY_SECTIONS } from '@/utils/legalContent';

import { LegalLayout } from '../LegalLayout';

/** Privacy Policy — from sign-up/login and Profile → Help & legal. */
export default function PrivacyPolicyScreen() {
  return <LegalLayout title="Privacy Policy" lastUpdated={LEGAL_LAST_UPDATED} sections={PRIVACY_POLICY_SECTIONS} />;
}
