import React from 'react';

import { REFUND_LAST_UPDATED, REFUND_POLICY_SECTIONS } from '@/utils/legalContent';

import { LegalLayout } from '../LegalLayout';

/** Refund & Cancellation Policy — reachable from Profile → About. */
export default function RefundPolicyScreen() {
  return (
    <LegalLayout
      title="Refund & Cancellation"
      lastUpdated={REFUND_LAST_UPDATED}
      sections={REFUND_POLICY_SECTIONS}
    />
  );
}
