# Reward Goals Mobile

The Reward Goals mobile client is a React Native application built with Expo and
Expo Router. It owns presentation, user interaction, and communication with the
Reward Goals API.

## Prerequisites

- Node.js
- pnpm
- Expo Go, an Android emulator, an iOS simulator, or a web browser

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

Use the terminal shortcuts shown by Expo to open the app on a connected device,
emulator, simulator, or the web.

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

## Commands

| Command                 | Purpose                           |
| ----------------------- | --------------------------------- |
| `pnpm dev:mobile`       | Start the Expo development server |
| `pnpm mobile android`   | Start Expo and open Android       |
| `pnpm mobile ios`       | Start Expo and open iOS           |
| `pnpm mobile web`       | Start Expo for the web            |
| `pnpm mobile typecheck` | Type-check the mobile application |
| `pnpm mobile lint`      | Lint the mobile application       |
| `pnpm mobile lint:fix`  | Fix lint issues where possible    |

Run `pnpm validate` from the repository root before opening a pull request.
