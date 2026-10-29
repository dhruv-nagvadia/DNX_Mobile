import React from 'react';
import { StatusBar, View } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import store from '@/redux/store';
import RootNavigator from '@/navigation/RootNavigator';
import { useSessionBootstrap } from '@/hooks/useSessionBootstrap';
import { Color } from '@/utils/Theme';

/** Restores the session before rendering, so a reload doesn't flash the login screen. */
function AppContent() {
  const ready = useSessionBootstrap();
  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: Color.ink }} />;
  }
  return <RootNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}
