// useNotification.js
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';



Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});


export const useNotification = () => {
    const schedulePushNotification = async (title, body) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
            },
            trigger: { seconds: 2 },
        });
    };

    return { schedulePushNotification };
};
