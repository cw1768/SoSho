import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { supabase } from '@/lib/supabase'
import Auth from '@/components/auth'
import { View  } from 'react-native'
import { Session } from '@supabase/supabase-js'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false); // Set loading to false after session is fetched
    };

    fetchSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session); // Debugging log
      setSession(session);
    });

    // Clean up the auth listener on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [])

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>

      <View style={{ flex: 1 }}>

        {session && session.user ? (
          <>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} initialParams={{ key: session.user.id, session }} />
              <Stack.Screen name="post/[id]" options={{ headerShown: true, headerTitle: "", headerBackTitle: "Back" }} />
              <Stack.Screen name="user/[id]" options={{ headerShown: true, headerTitle: "", headerBackTitle: "Back" }} />
              <Stack.Screen name="list/[id]" options={{ headerShown: true, headerTitle: "", headerBackTitle: "Back" }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </>
        ) : (
          <Auth />
        )}
      </View>
    </ThemeProvider>
  );
}
