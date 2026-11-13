import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAppDispatch } from '@/redux/hooks';
import { loadTokenFromStorage } from '@/api/apiConfigs';
import { authApi } from '@/redux/api/auth/authApi';
import { setCurrentUser } from '@/redux/slices/userSlice';
import { StorageKeys } from '@/utils/Constants';

/**
 * Restores the session on app launch (and after a full reload): loads the saved
 * token, then fetches /me to rehydrate the current user. Returns `true` once the
 * check is done, so the UI doesn't flash the login screen while restoring.
 */
export function useSessionBootstrap(): boolean {
  const dispatch = useAppDispatch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      // Signed in without "Keep me signed in": drop that session on a fresh launch.
      if ((await AsyncStorage.getItem(StorageKeys.sessionOnly)) === '1') {
        await AsyncStorage.multiRemove([
          StorageKeys.accessToken,
          StorageKeys.refreshToken,
          StorageKeys.sessionOnly,
        ]);
      }
      const token = await loadTokenFromStorage();
      if (token) {
        try {
          const user = await dispatch(
            authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true }),
          ).unwrap();
          if (active) {dispatch(setCurrentUser(user));}
        } catch {
          // Expired/invalid token: the 401 interceptor tries a refresh; if that
          // also fails the user simply stays logged out.
        }
      }
      if (active) {setReady(true);}
    })();
    return () => {
      active = false;
    };
  }, [dispatch]);

  return ready;
}
