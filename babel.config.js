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
  ],
};
