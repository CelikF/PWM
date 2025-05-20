// uploadUsers.js
const admin = require('firebase-admin');
const serviceAccount = require("C:/Users/celik/Downloads/pvvm-87506-firebase-adminsdk-fbsvc-9509d59666.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// load your array of users
const users = require('./user-data.json');

async function uploadUsers() {
  const batch = db.batch();

  for (const user of users) {
    // use the uid as your document ID
    const userRef = db.collection('users').doc(user.uid);

    // merge: true so it'll update only the provided fields
    batch.set(userRef, {
      username:       user.username,
      email:          user.email,
      image:          user.image,
      created_events: user.created_events,
      attending_events: user.attending_events
    }, { merge: true });
  }

  await batch.commit();
  console.log('✅ Users uploaded/updated successfully');
}

uploadUsers().catch(err => {
  console.error('Upload failed:', err);
  process.exit(1);
});