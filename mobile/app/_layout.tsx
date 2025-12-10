import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { FavoritesProvider } from '../favorites-context';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Provider } from 'react-redux';
import { store } from '@/store';


export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <FavoritesProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="news/[id]" options={{ headerShown: true }} />
            <Stack.Screen name="favorites/index" options={{ title: "Favorites" }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </FavoritesProvider>
    </Provider>
  );
}
