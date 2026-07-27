import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { navigationRef } from './NavigationService';
import { AuthStack, MainStack } from './Navigators';
import { useAppSelector } from '@/redux/hooks';

/**
 * Chooses the stack based on auth state. In a real app the Splash screen
 * bootstraps the session (loads token, fetches /me) before this renders.
 */
export default function RootNavigator() {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

  return (
    <NavigationContainer ref={navigationRef}>
      {isLoggedIn ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
