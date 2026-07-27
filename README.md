# DNX Mobile — AI Life Services Platform

React Native **CLI** + TypeScript + Redux Toolkit + RTK Query.

> Code structure follows the Healppy architecture guide, **adapted from Expo to
> RN CLI**: env is read via `react-native-config` (`.env` → `Config.BASE_URL`)
> instead of `expo-constants`/`app.config.js`.

## ⚠️ First-time setup (generate the native project)

This folder contains the **`src/` architecture + config only**. The native
`android/` and `ios/` shells are machine-generated — create them once, then keep
this `src/` folder:

```bash
# From the DNX/ parent folder — generate a fresh RN CLI project into a temp dir
npx @react-native-community/cli@latest init DNXTemp --version 0.76.6

# Copy the generated android/ and ios/ folders into this `mobile/` folder,
# then install our dependencies here:
cd mobile
npm install

# iOS pods
cd ios && pod install && cd ..
```

Then wire up native modules (autolinked on install):
`react-native-config`, `react-native-screens`, `react-native-safe-area-context`,
`react-native-svg`, `@react-native-async-storage/async-storage`.
Follow each library's iOS/Android setup notes (react-native-config needs a small
Gradle + Xcode build-phase edit).

## Run

```bash
cp .env.example .env      # set BASE_URL to your backend
npm start                 # Metro bundler
npm run android           # or: npm run ios
```

## Folder structure

```
src/
├── @types/        # env.d.ts (react-native-config), images.d.ts, svg.d.ts
├── api/           # APIUtils.ts (BASE_URL + endpoints), apiConfigs.ts (axios + axiosBaseQuery)
├── assets/        # fonts/, images/ (+ index.ts barrel)
├── components/    # Reusable UI — one folder per component (AppText example)
├── constants/     # App-wide non-theme constants
├── contexts/      # React contexts
├── hooks/         # Shared custom hooks
├── navigation/    # routes.ts, RootNavigator, Navigators, NavigationService
├── redux/
│   ├── store.ts   # configureStore — all reducers + middleware
│   ├── hooks.ts   # useAppDispatch / useAppSelector
│   ├── api/       # RTK Query slices, one folder per domain (auth, category, provider)
│   └── slices/    # Local-state slices (userSlice)
├── screens/       # One folder per screen (5-file pattern)
├── services/      # Device/background services
├── types/         # Global shared types
└── utils/         # Theme.ts, Constants.ts, DebugLogger.ts
```

## The screen pattern (copy this for every new screen)

```
ScreenName/
├── ScreenName.tsx       # JSX ONLY — no state, no StyleSheet
├── useScreenName.ts     # ALL state, effects, handlers, API calls
├── types.ts             # ALL interfaces / navigation prop types
├── styles.ts            # ALL StyleSheet.create()
├── validation.ts        # (forms only) field validation
└── index.ts             # barrel: export { default } from './ScreenName'
```

## Rules (enforced by convention)

- `.tsx` files hold JSX only — logic goes in `use*.ts`.
- All types in `types.ts`, all styles in `styles.ts`.
- No hardcoded colors/fonts — use `Color.*` / `Font.*` / `FontSize.*` from `@/utils/Theme`.
- Server data → RTK Query (`redux/api/*`). Local/global UI state → slice (`redux/slices/*`).
- Never read `Config` directly outside `APIUtils.ts`.
- Import via the `@/` alias, never `../../..`.
- Navigate with `ROUTES.*` constants, never raw strings.
- Use `useAppDispatch` / `useAppSelector`, never the plain react-redux hooks.
```
