import webpush from 'web-push';

// VAPID keys generated for Fixia
const publicVapidKey = 'BAe4hkL2QSfUlgegiIkitfH5L8tEFMBxe4KZTUA231yXmiaapWzAjHlFOVJNIbCUS1eq5-WSoUSB66Y09ubefto';
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
