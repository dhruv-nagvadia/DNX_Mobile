export type BadgeTone = 'warning' | 'accent' | 'success' | 'neutral' | 'error' | 'brand';

export interface StatusBadgeProps {
  label: string;
  tone: BadgeTone;
}
