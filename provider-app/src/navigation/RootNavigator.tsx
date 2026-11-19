import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { navigationRef } from './NavigationService';
import { AuthStack, MainStack } from './Navigators';
import { useAppSelector } from '@/redux/hooks';
import { usePushNotifications } from '@/hooks/usePushNotifications';

/** Chooses the stack based on auth state. */
export default function RootNavigator() {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  usePushNotifications(isLoggedIn);

  return (
    <NavigationContainer ref={navigationRef}>
      {isLoggedIn ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
