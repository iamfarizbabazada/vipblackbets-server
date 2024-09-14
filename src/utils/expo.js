const { Expo } = require('expo-server-sdk');
const Notification = require('../models/notification');
const { BadRequestError } = require('./errors');

const expo = new Expo();

const validateExpoPushToken = (pushToken) => {
    return Expo.isExpoPushToken(pushToken);
};

const createNotificationDocument = (message, status) => {
    return new Notification({
        receiver: message.data.receiver,
        title: message.title,
        body: message.body,
        status: status
    });
};

const sendPushNotification = async ({ pushToken = '', title, sticky = false, body, status, subtitle, data }) => {
    if (!validateExpoPushToken(pushToken)) {
        console.log(`Push token ${pushToken} is not a valid Expo push token`);
        return;
    }

    const message = {
        to: pushToken,
        title,
        body,
        data,
        priority: 'high',
        channelId: sticky ? 'sticky' : 'default',
        subtitle
    };

    try {
        const [result] = await expo.sendPushNotificationsAsync([message]);

        if (result.status === 'ok') {
            const notification = createNotificationDocument(message, status);
            await notification.save();
        } else {
            console.error(`Failed to send push notification: ${result.status}`);
        }
    } catch (err) {
        console.error('Error sending push notification:', err);
        throw new BadRequestError('Error sending push notification');
    }
};

const sendPushNotificationBulk = async ({ pushTokens, title, status, body, data }) => {
    const validMessages = pushTokens
        .filter(validateExpoPushToken)
        .map(pushToken => ({
            to: pushToken,
            title,
            body,
            data,
            priority: 'high',
            channelId: 'default'
        }));

    if (validMessages.length === 0) {
        console.log('No valid push tokens provided.');
        return;
    }

    try {
        const results = await expo.sendPushNotificationsAsync(validMessages);

        const successfulResults = results.filter(result => result.status === 'ok');
        if (successfulResults.length > 0) {
            const notifications = validMessages.map((message, index) => 
                createNotificationDocument(message, status)
            );
            await Notification.insertMany(notifications);
        } else {
            console.error('No push notifications were successfully sent.');
        }
    } catch (err) {
        console.error('Error sending bulk push notifications:', err);
        throw new BadRequestError('Error sending bulk push notifications');
    }
};

module.exports = {
    sendPushNotification,
    sendPushNotificationBulk
};
