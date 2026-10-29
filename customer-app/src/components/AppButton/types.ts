import { StyleProp, ViewStyle } from 'react-native';

/** `accent` is for dark surfaces, where navy-on-ink has too little contrast. */
export type AppButtonVariant = 'primary' | 'secondary' | 'accent';

export interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: AppButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}
