import { useCallback, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ROUTES } from '@/navigation/routes';
import { StorageKeys } from '@/utils/Constants';
import DEBUG_LOGGER, { ERROR } from '@/utils/DebugLogger';

import { SLIDES } from './slides';
import { OnboardingScreenNavigationProp } from './types';

const FILE = 'useOnboardingScreen';

/** Paging state and the finish/skip handlers for OnboardingScreen. */
export function useOnboardingScreen() {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const isLast = index === SLIDES.length - 1;

  /** Marks onboarding seen, then hands over to sign-in. */
  const finish = useCallback(async () => {
    try {
      await AsyncStorage.setItem(StorageKeys.onboardingDone, 'true');
    } catch {
      // A failed write only means onboarding shows again — never block entry.
      DEBUG_LOGGER('Could not persist onboarding flag', 'finish', FILE, '27', ERROR);
    }
    navigation.replace(ROUTES.LOGIN);
  }, [navigation]);

  const next = useCallback(() => {
    if (isLast) {
      finish();
      return;
    }
    const target = index + 1;
    scrollRef.current?.scrollTo({ x: target * width, animated: true });
    setIndex(target);
  }, [finish, index, isLast, width]);

  /** Keeps the dots in sync when the user swipes instead of tapping. */
  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const page = Math.round(e.nativeEvent.contentOffset.x / width);
      setIndex(page);
    },
    [width],
  );

  return { width, scrollRef, index, isLast, slides: SLIDES, next, finish, onMomentumScrollEnd };
}
