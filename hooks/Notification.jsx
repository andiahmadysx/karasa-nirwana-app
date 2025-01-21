import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import PushNotification from "react-native-push-notification";

export const initializeNotifications = async () => {
    // Request permissions only on Android due to Expo requirements
    return null;
};

export const useNotification = () => {
    const schedulePushNotification = (title, message) => {

    };

    return { schedulePushNotification };
};
