const admin = require('firebase-admin');

// Path to your downloaded service account key JSON file
const serviceAccount = require('./serviceAccountKey.json');  // Update the path accordingly

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gratify-8179c.firebaseio.com"  // Replace <your-project-id> with your actual Firebase project ID
});

module.exports = admin;
