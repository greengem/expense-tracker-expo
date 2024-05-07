import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { initDB } from './services/database';
import { Slot } from 'expo-router';
import "../global.css"

import { useColorScheme } from '@/components/useColorScheme';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding immediately.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Initialization status of the DB and fonts
  useEffect(() => {
    async function prepare() {
      try {
        // Await both the database initialization and font loading
        await Promise.all([
          initDB(), // Initialize the database
          fontsLoaded // This already returns a promise that resolves when fonts are loaded
        ]);
      } catch (e) {
        console.warn(e);
      } finally {
        // Once both are done, hide the splash screen
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [fontsLoaded]); // Note: The dependency array ensures this effect runs once on mount

  if (!fontsLoaded) {
    return null; // Return null while waiting on fonts to avoid rendering errors
  }

  return <RootLayoutNav />;
}

const CustomDefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // Latte
    background: '#eff1f5', // ctp-crust
    text: '#4c4f69', // ctp-text
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    // Mocha
    background: '#1e1e2e', // ctp-crust
    text: '#cdd6f4', // ctp-text
  },
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : CustomDefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="new-category-modal" 
          options={{ 
            presentation: 'modal', 
            title: 'New Category'
          }} 
        />
      </Stack>
    </ThemeProvider>
  );
}
