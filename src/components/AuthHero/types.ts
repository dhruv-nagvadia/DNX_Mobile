export interface AuthHeroProps {
  /** Leading text of the promise line. */
  promise: string;
  /** Trailing words, rendered in the accent color. */
  accentTail: string;
  /** Drop the category chips to save vertical space on longer forms. */
  compact?: boolean;
}

export interface GlowProps {
  /** Rendered diameter in px. The source asset scales to fit. */
  size: number;
  color: string;
  top: number;
  left?: number;
  right?: number;
  /** Overall intensity. Defaults to 0.55. */
  opacity?: number;
}
