module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Enables the `@/` alias (must mirror tsconfig.json "paths").
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
        },
        extensions: ['.ios.ts', '.android.ts', '.ts', '.ios.tsx', '.android.tsx', '.tsx', '.js', '.json'],
      },
    ],
    // Reads `.env.<APP_ENV>` and exposes its values via
    // `import { API_BASE_URL } from '@env'`. `envName: 'APP_ENV'` is explicit
    // (not the plugin's default of NODE_ENV/BABEL_ENV) so this never gets
    // flipped by React Native's own internal `--dev false` flag — only the
    // `android:*`/`ios:*`/`start:*` npm scripts (which set APP_ENV) decide
    // which of .env.development/.env.staging/.env.production applies.
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};
