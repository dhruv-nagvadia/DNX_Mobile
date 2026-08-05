import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROUTES, RootStackParamList } from './routes';
import { useOnboardingStatus } from './useOnboardingStatus';
import { styles } from './styles';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import OnboardingScreen from '@/screens/onboarding/OnboardingScreen';
import HomeScreen from '@/screens/home/HomeScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Screens available before login. */
export function AuthStack() {
  const onboarding = useOnboardingStatus();

  // Ink placeholder while the flag is read, so there's no white flash and no
  // flicker of the wrong first screen.
  if (onboarding === 'loading') {
    return <View style={styles.bootPlaceholder} />;
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={onboarding === 'pending' ? ROUTES.ONBOARDING : ROUTES.LOGIN}
    >
      <Stack.Screen name={ROUTES.ONBOARDING} component={OnboardingScreen} />
      <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
      <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
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
