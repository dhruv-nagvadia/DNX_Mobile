import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROUTES, RootStackParamList } from './routes';
import { useOnboardingStatus } from './useOnboardingStatus';
import { styles } from './styles';
import { Color, FontWeight } from '@/utils/Theme';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import OnboardingScreen from '@/screens/onboarding/OnboardingScreen';
import HomeScreen from '@/screens/home/HomeScreen';
import CategoryScreen from '@/screens/category/CategoryScreen';
import ProviderListScreen from '@/screens/provider/ProviderListScreen';

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
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: Color.surface },
        headerTintColor: Color.primary,
        headerTitleStyle: { color: Color.textPrimary, fontWeight: FontWeight.bold },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Color.background },
      }}
    >
      <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
      <Stack.Screen
        name={ROUTES.CATEGORY}
        component={CategoryScreen}
        options={({ route }) => ({ headerShown: true, title: route.params.name })}
      />
      <Stack.Screen
        name={ROUTES.PROVIDER_LIST}
        component={ProviderListScreen}
        options={({ route }) => ({ headerShown: true, title: route.params.title })}
      />
    </Stack.Navigator>
  );
}
