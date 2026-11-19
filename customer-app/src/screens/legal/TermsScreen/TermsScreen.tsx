import React from 'react';

import { LEGAL_LAST_UPDATED, TERMS_SECTIONS } from '@/utils/legalContent';

import { LegalLayout } from '../LegalLayout';

/** Terms of Service — reachable from Profile → About and at signup. */
export default function TermsScreen() {
  return (
    <LegalLayout
      title="Terms of Service"
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={TERMS_SECTIONS}
    />
  );
}
