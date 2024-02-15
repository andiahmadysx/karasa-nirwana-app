import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export const initializeNotifications = async () => {
    // Request permissions only on Android due to Expo requirements
    if (Platform.OS === 'android') {
        const { granted } = await Notifications.requestPermissionsAsync();
        if (!granted) {
            throw new Error('Notification permissions must be granted!');
        }
    }

    // Get the push token (important for scheduling or sending notifications)
    const { data: token } = await Notifications.getExpoPushTokenAsync();
    return token;
};

export const useNotification = () => {
    useEffect(() => {
        (async () => {
            try {
                await initializeNotifications();
            } catch (error) {
                console.error('Error initializing notifications:', error);
            }
        })();
    }, []);

    const schedulePushNotification = async (title, body) => {
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
