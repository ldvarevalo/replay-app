import '@/theme';
import { QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { Redirect, Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, type ReactNode } from 'react';
import { useFonts } from 'expo-font';
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
import { AuthProvider, useAuth } from '@/core/auth';
import { createSupabaseAdapter } from '@/core/auth/adapters/supabase';
import { createQueryClient } from '@/lib/react-query/query-client';
import { createSupabaseClient } from '@/lib/supabase/client';
import { createSupabaseRepositories } from '@/repositories/supabase';
import { setRepositories } from '@/repositories/instance';

/**
 * Constants
 */

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = createQueryClient();
const supabase = createSupabaseClient();
setRepositories(createSupabaseRepositories(supabase));
const authAdapter = createSupabaseAdapter(supabase);

/**
 * RedirectGate
 */

const RedirectGate = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user && !pathname.startsWith('/login')) {
    return <Redirect href="/login" />;
  }
  if (user && pathname.startsWith('/login')) {
    return <Redirect href="/home" />;
  }
  return <>{children}</>;
};

/**
 * RootLayout
 */

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Newsreader_400Regular_Italic,
    Newsreader_600SemiBold_Italic,
    Newsreader_700Bold_Italic,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider adapter={authAdapter}>
        <RedirectGate>
          <Stack screenOptions={{ headerShown: false }} />
        </RedirectGate>
        <StatusBar style="auto" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
