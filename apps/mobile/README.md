# Reward Goals Mobile

The Reward Goals mobile client is a React Native application built with Expo and
Expo Router. It owns presentation, user interaction, and communication with the
Reward Goals API.

## Prerequisites

- Node.js
- pnpm
- Android Studio for Android development builds, Xcode for iOS development
  builds, or a web browser

Run the commands below from the repository root.

## Setup

Install dependencies and create the local mobile environment file:

```bash
pnpm install
cp apps/mobile/.env.example apps/mobile/.env
```

Start the Expo development server:

```bash
pnpm dev:mobile
```

Unistyles includes native code and does not run in Expo Go. Build the native app
with `pnpm mobile android` or `pnpm mobile ios` the first time, then use
`pnpm dev:mobile` to reconnect an installed development build to Metro. Use
`pnpm mobile web` for browser development.

## Environment

| Variable              | Purpose                        | Default                 |
| --------------------- | ------------------------------ | ----------------------- |
| `EXPO_PUBLIC_API_URL` | Base URL used for API requests | `http://localhost:3000` |

Expo embeds `EXPO_PUBLIC_` values in the client bundle. Never store secrets in
these variables.

The correct API host depends on where the app runs:

- iOS simulator or web: `localhost`
- Android emulator: `10.0.2.2`
- Physical device: the development machine's LAN address

The API must listen on `0.0.0.0` when accessed from an emulator or physical
device.

## Authentication sessions

On Android and iOS, the refresh token is encrypted by Expo SecureStore and the
access token stays in application memory. The app restores a native session by
rotating the saved refresh token when it starts.

Web sessions intentionally keep both tokens in memory. Reloading or closing the
browser tab signs the user out; refresh tokens are never written to browser
storage.

## Commands

| Command                 | Purpose                           |
| ----------------------- | --------------------------------- |
| `pnpm dev:mobile`       | Start the Expo development server |
| `pnpm mobile android`   | Build and run the Android app     |
| `pnpm mobile ios`       | Build and run the iOS app         |
| `pnpm mobile web`       | Start Expo for the web            |
| `pnpm mobile typecheck` | Type-check the mobile application |
| `pnpm mobile lint`      | Lint the mobile application       |
| `pnpm mobile lint:fix`  | Fix lint issues where possible    |

Run `pnpm validate` from the repository root before opening a pull request.
