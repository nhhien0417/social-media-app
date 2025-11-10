### 📱 Social Media App (Expo + TypeScript + Tamagui)

Social-media-app UI built with **Expo**, **TypeScript**, **Tamagui**, **Expo Router**, **React Query**, and **FlashList**.  
Fully type-safe, clean architecture, and mobile-first responsive.

### 🧰 Environment Requirements

| Tool     | Recommended Version |
| -------- | ------------------- |
| Node.js  | >= 18.x (LTS)       |
| npm      | >= 9                |
| Expo CLI | via `npx expo`      |
| Git      | >= 2.30             |

### 🚀 Getting Started

### 1️⃣ Clone project

```bash
git clone <repo-url>
cd social-media-app
```

### 2️⃣ Install dependencies

```bash
npm install
# UI & Tamagui
npm i tamagui @tamagui/core @tamagui/config @tamagui/themes @tamagui/lucide-icons

# React Native dependencies (Expo auto-link)
npx expo install react-native-reanimated react-native-gesture-handler react-native-safe-area-context react-native-svg
npx expo install expo-media-library

# Routing, data fetching & lists
npm i expo-router expo-secure-store @shopify/flash-list @tanstack/react-query

# Babel plugin for Tamagui
npm i -D @tamagui/babel-plugin

# Run
npx expo-router@latest typegen
npx expo start
```

//TODO

- Api post feed
- Preview media before post
- Fix incorrect stretch camera
- Signup need unique username
