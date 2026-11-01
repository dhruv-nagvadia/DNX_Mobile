import { ReactNode } from 'react';

export interface AppHeaderProps {
  title?: string;
  /** Small text under the title — only shown on the logo (tab-root) form. */
  subtitle?: string;
  onBack?: () => void;
  /** Shows the back chevron instead of the brand mark. Defaults to true
   * whenever `logo` isn't set — pass `showBack={false}` for a root screen
   * that has neither (rare). */
  showBack?: boolean;
  /** Shows the "D" brand mark instead of a back button — for tab-root screens. */
  logo?: boolean;
  right?: ReactNode;
}
