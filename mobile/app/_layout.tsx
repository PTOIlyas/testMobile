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
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="favorites/index" options={{ headerShown: false }} />
          <Stack.Screen name="news/[id]" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </FavoritesProvider>
    </Provider>
  );
}
