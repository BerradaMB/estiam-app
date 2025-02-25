import { useEffect, useState } from 'react';
import { Stack, useNavigationContainerRef, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';
import usePushNotifications from '../hooks/usePushNotifications';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': 'https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19',
    'Inter-Medium': 'https://rsms.me/inter/font-files/Inter-Medium.woff2?v=3.19',
    'Inter-SemiBold': 'https://rsms.me/inter/font-files/Inter-SemiBold.woff2?v=3.19',
    'Inter-Bold': 'https://rsms.me/inter/font-files/Inter-Bold.woff2?v=3.19',
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const navigationRef = useNavigationContainerRef();

  usePushNotifications();

  useEffect(() => {
    async function requestNotifications() {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert('Autorisation requise', 'Veuillez activer les notifications dans les paramètres.');
        }
      }
    }
    
    async function showNotification() {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Bienvenue !",
          body: "Merci d'utiliser notre application. Profitez de votre expérience !",
        },
        trigger: null,
      });
    }
    
    requestNotifications();
    showNotification();

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
    if (!isAuthenticated && navigationRef.isReady()) {
      router.push('/(auth)/login');
    }
  }, [fontsLoaded, isAuthenticated, navigationRef]);

  if (!fontsLoaded) return null;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
