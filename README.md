# Bandmate App

A small Expo React Native app for managing band merch and gigs. Built with Expo, `expo-router`, and a local SQLite database for mobile.

This repository contains the app made for Module 3 of the course "Building and Deploying Cross Platform Mobile Apps"

## Features
- Firebase authentication
- Gig management
- Merch management (stock management)

## Requirements
- Node.js (recommend v18+)
- npm (or yarn)
- Expo CLI
- An iOS or Android device/emulator for full database functionality

## Install
Open a PowerShell terminal in the project root and run:

```powershell
# install dependencies
npm install
```

## Run the app
Start the Metro bundler / Expo dev server using the Expo CLI.

```powershell
# start Expo (Metro)
expo start
# start with cache reset
expo start -c
```

Platform-specific flags:
```powershell
expo start --android
expo start --ios
expo start --web
```

You can also scan the QR code shown in the terminal using your phone camera (Expo Go app needed)

## Database
This project uses `expo-sqlite` for local storage. The SQLite database is available on iOS and Android only. When you open the app in a web browser you'll see a placeholder message and the add/list features that depend on SQLite will be disabled.

Data schema (in `db/index.js`):
- gigs table: id, title, date (TEXT, saved as `YYYY-MM-DD`), venue, city
- merch table: id, name, price, stock

## Date selector behavior
- The Add Gig form uses three selectors (Day / Month / Year).
- The app validates the selected combination (no invalid dates like Feb 31).
- The selected date must be today or in the future. Past dates not allowed.

## Troubleshooting
-- Metro cache issues: `expo start -c`.
- If native builds fail on Android/iOS, make sure your emulator or device setup is correct and that Android SDK/Xcode are installed and configured.