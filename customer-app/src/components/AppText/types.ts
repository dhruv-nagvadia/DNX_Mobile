import { TextProps } from 'react-native';

export type AppTextVariant = 'title' | 'subtitle' | 'body' | 'caption';

export interface AppTextProps extends TextProps {
  variant?: AppTextVariant;
  color?: string;
}
