import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROUTES, RootStackParamList } from './routes';
import LoginScreen from '@/screens/auth/LoginScreen';
import HomeScreen from '@/screens/home/HomeScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Screens available before login. */
export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
    </Stack.Navigator>
  );
}

/** Screens available after login. */
export function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name={ROUTES.HOME} component={HomeScreen} options={{ title: 'DNX' }} />
    </Stack.Navigator>
  );
}
