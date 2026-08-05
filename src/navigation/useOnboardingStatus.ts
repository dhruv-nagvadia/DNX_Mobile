import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StorageKeys } from '@/utils/Constants';

export type OnboardingStatus = 'loading' | 'pending' | 'done';

/**
 * Whether the intro slides have been seen. Decides the AuthStack's first screen.
 * `loading` covers the AsyncStorage read, which is a few ms — the caller shows
 * an ink-colored placeholder so there's no white flash or wrong-screen flicker.
 */
export function useOnboardingStatus(): OnboardingStatus {
  const [status, setStatus] = useState<OnboardingStatus>('loading');

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(StorageKeys.onboardingDone)
      // If the read fails, showing onboarding again is the safe outcome.
      .catch(() => null)
      .then((value) => {
        if (active) {
          setStatus(value === 'true' ? 'done' : 'pending');
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return status;
}
