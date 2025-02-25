import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alert } from 'react-native';

async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Permission refusée pour les notifications !');
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Token Expo:', token);
  }
}

export default function usePushNotifications() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);
}

