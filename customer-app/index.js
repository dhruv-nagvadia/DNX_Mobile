/**
 * React Native CLI entry point.
 * @format
 */
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { registerBackgroundPushHandler } from './src/utils/push';

// Push messages received while the app is backgrounded/quit (no-op without Firebase).
registerBackgroundPushHandler();

AppRegistry.registerComponent(appName, () => App);
