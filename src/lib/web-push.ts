import webpush from 'web-push';

import { VAPID_PUBLIC_KEY as publicVapidKey } from './web-push-keys';
const privateVapidKey = 'bOanZ4G6LXTYHUFvZ-vruDdAgqBLCYrP91EO4Fjis_0';

webpush.setVapidDetails(
    'mailto:admin@fixia.app',
    publicVapidKey,
    privateVapidKey
);

export const sendNotification = async (subscription: any, payload: string) => {
    try {
        await webpush.sendNotification(subscription, payload);
        return true;
    } catch (error) {
        console.error('Error sending notification:', error);
        return false;
    }
};

export const VAPID_PUBLIC_KEY = publicVapidKey;
