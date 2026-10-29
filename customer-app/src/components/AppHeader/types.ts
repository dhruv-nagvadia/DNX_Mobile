import { ReactNode } from 'react';

export interface AppHeaderProps {
  title?: string;
  /** Defaults to navigation.goBack(). */
  onBack?: () => void;
  /** `dark` for ink backgrounds (e.g. the gallery). */
  variant?: 'light' | 'dark';
  /** Overlay the header on top of the content (e.g. a hero image) with just a back chip. */
  floating?: boolean;
  /** Optional right-aligned actions. */
  right?: ReactNode;
}
