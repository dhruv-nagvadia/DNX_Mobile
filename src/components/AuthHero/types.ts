export interface AuthHeroProps {
  /** Leading text of the promise line. */
  promise: string;
  /** Trailing words, rendered in the accent color. */
  accentTail: string;
  /** Drop the category chips to save vertical space on longer forms. */
  compact?: boolean;
  /** Show a back arrow above the logo (for screens pushed on top of another). */
  showBack?: boolean;
  /** What the arrow does. Defaults to going back one screen. */
  onBack?: () => void;
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
