import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import {useEffect} from "react";

// Ensure Notifications initialization occurs once app is ready
export const initializeNotifications = async () => {
    // Request permissions only on Android due to Expo requirements
    if (Platform.OS === 'android') {
        const { granted } = await Notifications.requestPermissionsAsync();
        if (!granted) {
            throw new Error('Notification permissions must be granted!');
        }
    }

    // Get the push token (important for scheduling or sending notifications)
    await Notifications.getExpoPushTokenAsync();
};
export const useNotification = () => {
    const schedulePushNotification = async (title, body) => {
        useEffect(() => {
            initializeNotifications();
        }, []);
        try {
            const trigger = { seconds: 2 }; // Adjust trigger based on your requirements
            const response = await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                },
                trigger,
            });
            console.log('Notification scheduled successfully:', response);
        } catch (error) {
            console.error('Error scheduling notification:', error);
            // Handle errors gracefully, e.g., display an error message to the user
        }
    };

    return { schedulePushNotification };
};
