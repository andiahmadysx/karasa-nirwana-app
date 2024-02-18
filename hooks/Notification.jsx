import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import PushNotification from "react-native-push-notification";

export const initializeNotifications = async () => {
    // Request permissions only on Android due to Expo requirements
    if (Platform.OS === 'android') {
        const { granted } = await Notifications.requestPermissionsAsync();
        if (!granted) {
            throw new Error('Notification permissions must be granted!');
        }
    }
    return null;
};

export const useNotification = () => {
    const schedulePushNotification = (title, message) => {
        PushNotification.localNotification({
            channelId: 'default', // Specify a channel for Android
            title: title,
            message: message,
            playSound: true,
            soundName: 'default',
        });
    };

    return { schedulePushNotification };
};
