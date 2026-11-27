import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { navigationRef } from './NavigationService';
import { AuthStack, MainStack } from './Navigators';
import { useAppSelector } from '@/redux/hooks';
import { CartSync } from '@/components/CartSync';
import { LocationSync } from '@/components/LocationSync';
import { NavigationBarBackdrop } from '@/components/NavigationBarBackdrop';
import { usePushNotifications } from '@/hooks/usePushNotifications';

/**
 * Chooses the stack based on auth state. In a real app the Splash screen
 * bootstraps the session (loads token, fetches /me) before this renders.
 */
export default function RootNavigator() {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  usePushNotifications(isLoggedIn);

  return (
    <View style={styles.root}>
      <CartSync />
      <LocationSync />
      <NavigationContainer ref={navigationRef}>
        {isLoggedIn ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
      {/* Solid strip behind Android's navigation buttons (signed-in screens only). */}
      {isLoggedIn && <NavigationBarBackdrop />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
