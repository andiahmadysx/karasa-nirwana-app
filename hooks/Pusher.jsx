// usePusher.js
import {useEffect} from 'react';
import Pusher from 'pusher-js/react-native';

const usePusher = (channelName, eventName, callback) => {

    useEffect(() => {
        // Pusher setup
        const pusher = new Pusher(process.env.PUSHER_APP_KEY, {
            wsHost: process.env.BACKEND_HOST,
            wsPort: process.env.PUSHER_PORT,
            encrypted: false,
            cluster: process.env.PUSHER_APP_CLUSTER,
            forceTLS: false,
            enabledTransports: ['ws'],
        });

        const channel = pusher.subscribe(channelName);

        channel.bind(eventName, callback);

        // Cleanup function
        return () => {
            pusher.unsubscribe(channelName);
            pusher.disconnect();
        };
    }, [channelName, eventName, callback]);

    return null;
};

export default usePusher;
