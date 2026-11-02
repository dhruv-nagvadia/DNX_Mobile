import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type BadgeTone = 'warning' | 'accent' | 'success' | 'neutral' | 'error' | 'brand';

export interface StatusBadgeProps {
  label: string;
  tone: BadgeTone;
  /** Square corners instead of a pill — used when stacking badges together. */
  square?: boolean;
  /** Flat, borderless right edge (rounded left) — for a badge flush against a
   * card's right border, so it reads as "cut off" by the card's edge. */
  cutRight?: boolean;
  /** Extra positioning overrides (e.g. a negative margin to pull the badge
   * flush against its container's edge, countering the container's padding). */
  style?: StyleProp<ViewStyle>;
  /** Overrides for the label text (e.g. a smaller font when stacking two
   * badges in a tight space) — merged on top of the default text style. */
  textStyle?: StyleProp<TextStyle>;
}
