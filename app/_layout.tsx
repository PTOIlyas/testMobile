import "react-native-reanimated";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FavoritesProvider } from "@/favorites-context";

import { Provider } from "react-redux";
import { store } from "@/store";
import { AuthProvider } from "@/auth-context";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <FavoritesProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="favorites/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="news/[id]"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="notifications/index"
              options={{ headerShown: false }}
            />
          </Stack>
          <StatusBar style="auto" />
        </FavoritesProvider>
      </AuthProvider>
    </Provider>
  );
}
