const webpush = require('web-push');

// Replace these with your own VAPID keys
const vapidKeys = {
  publicKey: 'YOUR_PUBLIC_VAPID_KEY',
  privateKey: 'YOUR_PRIVATE_VAPID_KEY'
};

webpush.setVapidDetails(
  'mailto:example@yourdomain.org', // Replace with your email
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

module.exports = webpush;
