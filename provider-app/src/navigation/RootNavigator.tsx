import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { navigationRef } from './NavigationService';
import { AuthStack, MainStack } from './Navigators';
import { useAppSelector } from '@/redux/hooks';
import { NavigationBarBackdrop } from '@/components/NavigationBarBackdrop';
import { usePushNotifications } from '@/hooks/usePushNotifications';

/** Chooses the stack based on auth state. */
export default function RootNavigator() {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  usePushNotifications(isLoggedIn);

  return (
    <View style={styles.root}>
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
