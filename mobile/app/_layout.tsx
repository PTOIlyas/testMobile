import "react-native-reanimated";
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FavoritesProvider } from "@/favorites-context";

import { Provider } from 'react-redux';
import { store } from '@/store';

export default function RootLayout() {

  return (
    <Provider store={store}>
      <FavoritesProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="auto" />
      </FavoritesProvider>
    </Provider>
  );
}
