import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
//DB
import { SQLiteProvider } from '@/context/SQLiteContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useDb from '@/hooks/useDB';
import React from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const { createDB, loading } = useDb();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded && !loading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, loading]);

  useEffect(() => {
    (async () => {
      await createDB();
    })();
  }, []);

  if (!loaded || loading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SQLiteProvider databaseName="dataBase.db">
        <Stack>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SQLiteProvider>
    </QueryClientProvider>
  );
}
