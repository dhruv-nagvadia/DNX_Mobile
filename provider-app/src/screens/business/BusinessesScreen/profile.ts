import { Business } from '@/redux/api/business/types';

/**
 * Profile-completion progress for one business — ported from the web app's
 * `components/BusinessChecklist/profile.ts` (`profileProgress`) so both apps
 * agree on what "complete" means. Five steps: description, ≥1 service (or
 * product for a STORE), ≥1 photo, ≥1 open business-hours day, contact email.
 */
export function profileProgress(business: Business): { pct: number; pending: number } {
  const isStore = business.type === 'STORE';
  const steps = [
    !!business.description,
    isStore ? (business.products?.length ?? 0) > 0 : business.services.length > 0,
    (business.images?.length ?? 0) > 0,
    (business.businessHours ?? []).some((h) => h.isOpen),
    !!business.email,
  ];
  const pending = steps.filter((done) => !done).length;
  return { pct: Math.round(((steps.length - pending) / steps.length) * 100), pending };
}
