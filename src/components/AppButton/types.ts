import { StyleProp, ViewStyle } from 'react-native';

export type AppButtonVariant = 'primary' | 'secondary';

export interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: AppButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}
