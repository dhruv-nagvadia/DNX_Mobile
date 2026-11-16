import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

import { PILL } from '@/utils/modernTheme';

export type SheetTone = keyof typeof PILL;

export interface BottomSheetProps {
  visible: boolean;
  /** Backdrop tap, the close (X) button and Android back all call this. */
  onClose: () => void;
  title?: string;
  subtitle?: string;
  /** Shown left of the title (e.g. a photo thumbnail). */
  leading?: ReactNode;
  /** Shown between the title and the close button (e.g. a spinner). */
  headerRight?: ReactNode;
  /** Hides the round close (X) button. Default true. */
  showClose?: boolean;
  /** Pinned below the content — usually one or two `SheetButton`s. */
  footer?: ReactNode;
  /** Wraps the content in a ScrollView (long option lists). */
  scrollable?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  /** Rendered over the whole modal (above the sheet), e.g. an inline `ConfirmDialog`. */
  overlay?: ReactNode;
  children?: ReactNode;
}

export interface SheetOptionProps {
  label: string;
  description?: string;
  /** Icon drawn inside the 40px pastel box. */
  icon?: LucideIcon;
  /** Pastel colour pair for the icon box. Default 'blue' (or 'red' for destructive). */
  tone?: SheetTone;
  /** Custom leading node in place of the icon box (e.g. a photo). */
  leading?: ReactNode;
  /** Custom node under the label (e.g. a pill). */
  meta?: ReactNode;
  selected?: boolean;
  destructive?: boolean;
  disabled?: boolean;
  /** Use 'radio' for a pick-one list. Default 'button'. */
  role?: 'button' | 'radio';
  onPress: () => void;
}

export type SheetButtonVariant = 'primary' | 'secondary' | 'danger';

export interface SheetButtonProps {
  title: string;
  onPress: () => void;
  variant?: SheetButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}
