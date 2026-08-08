import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, CalendarDays, Bell, User } from 'lucide-react-native';

import { ROUTES, RootStackParamList } from './routes';
import { useOnboardingStatus } from './useOnboardingStatus';
import { styles } from './styles';
import { Color, FontWeight } from '@/utils/Theme';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import OnboardingScreen from '@/screens/onboarding/OnboardingScreen';
import HomeScreen from '@/screens/home/HomeScreen';
import BookingsScreen from '@/screens/bookings/BookingsScreen';
import RemindersScreen from '@/screens/reminders/RemindersScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import CategoryScreen from '@/screens/category/CategoryScreen';
import ProviderListScreen from '@/screens/provider/ProviderListScreen';
import ProviderDetailScreen from '@/screens/provider/ProviderDetailScreen';
import GalleryScreen from '@/screens/gallery/GalleryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

/** Bottom tabs for the signed-in customer: Home, Bookings, Reminders, Profile. */
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Color.primary,
        tabBarInactiveTintColor: Color.textSecondary,
        tabBarStyle: {
          backgroundColor: Color.surface,
          borderTopColor: Color.border,
          height: 88,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: FontWeight.semibold },
      }}
    >
      <Tab.Screen
        name={ROUTES.HOME}
        component={HomeScreen}
        options={{ tabBarLabel: 'Home', tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }}
      />
      <Tab.Screen
        name={ROUTES.BOOKINGS}
        component={BookingsScreen}
        options={{
          tabBarLabel: 'Bookings',
          tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name={ROUTES.REMINDERS}
        component={RemindersScreen}
        options={{ tabBarLabel: 'Reminders', tabBarIcon: ({ color, size }) => <Bell color={color} size={size} /> }}
      />
      <Tab.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile', tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}

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
      <Stack.Screen name={ROUTES.TABS} component={TabNavigator} />
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
      <Stack.Screen
        name={ROUTES.PROVIDER_DETAILS}
        component={ProviderDetailScreen}
        options={({ route }) => ({ headerShown: true, title: route.params.name ?? 'Business' })}
      />
      <Stack.Screen
        name={ROUTES.GALLERY}
        component={GalleryScreen}
        options={{
          headerShown: true,
          title: 'Photos',
          headerStyle: { backgroundColor: Color.ink },
          headerTintColor: Color.onDark,
          headerTitleStyle: { color: Color.onDark, fontWeight: FontWeight.bold },
        }}
      />
    </Stack.Navigator>
  );
}
