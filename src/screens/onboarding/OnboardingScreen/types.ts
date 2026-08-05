import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';

export type OnboardingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OnboardingScreen'
>;

/** Which illustration a slide renders. */
export type SlideVisual = 'categories' | 'assistant' | 'organised';

export interface Slide {
  key: SlideVisual;
  title: string;
  accentTail: string;
  body: string;
}
