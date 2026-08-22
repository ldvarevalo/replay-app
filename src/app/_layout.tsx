import { AuthProvider } from '@/core/auth';
import { createSupabaseAdapter } from '@/core/auth/adapters/supabase';
import { createQueryClient } from '@/lib/react-query/query-client';
import { createSupabaseClient } from '@/lib/supabase/client';
import { setRepositories } from '@/repositories/instance';
import { createSupabaseRepositories } from '@/repositories/supabase';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Newsreader_400Regular_Italic,
  Newsreader_600SemiBold_Italic,
  Newsreader_700Bold_Italic,
} from '@expo-google-fonts/newsreader';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

const queryClient = createQueryClient();
const supabase = createSupabaseClient();
setRepositories(createSupabaseRepositories(supabase));
const authAdapter = createSupabaseAdapter(supabase);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Newsreader_400Regular_Italic,
    Newsreader_600SemiBold_Italic,
    Newsreader_700Bold_Italic,
  });

  useEffect(() => {
    if (!fontsLoaded) return;
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider adapter={authAdapter}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
