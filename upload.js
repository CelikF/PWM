// uploadData.js
const admin = require('firebase-admin');
const serviceAccount = require("C:/Users/celik/Downloads/pvvm-87506-firebase-adminsdk-fbsvc-9509d59666.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Assuming your JSON file exports an array, not an object
// e.g. module.exports = [ { id:1, title:"Rome Tour", … }, { id:2, … } ];
const events = require('./data.json');

async function uploadData() {
  const batch = db.batch();

  for (const event of events) {
    const eventId = String(event.id);
    const eventRef = db.collection('events').doc(eventId);

    // 1) Set the top-level event doc
    batch.set(eventRef, {
      image: event.image,
      host_id: event.host_id,
      title: event.title,
      location: event.location,
      // convert ISO string to Firestore Timestamp
      datetime: admin.firestore.Timestamp.fromDate(new Date(event.datetime)),
      description: event.description
      // you could also embed attendees/activities/news here as arrays
    });

    // 2) attendees subcollection
    for (const att of event.attendees || []) {
      const attRef = eventRef.collection('attendees').doc(String(att.user_id));
      batch.set(attRef, {
        status: att.status
      });
    }

    // 3) activities subcollection
    for (const [idx, act] of (event.activities || []).entries()) {
      // use idx or a unique name for each activity doc
      const actRef = eventRef.collection('activities').doc(String(idx + 1));
      batch.set(actRef, {
        activity_name: act.activity_name,
        start_time: act.start_time,
        end_time: act.end_time
      });
    }

    // 4) news subcollection
    for (const news of event.news || []) {
      const newsRef = eventRef.collection('news').doc(String(news.id));
      batch.set(newsRef, {
        image: news.image,
        title: news.title,
        description: news.description,
        content: news.content,
        event_id: news.event_id
      });
    }
  }

  await batch.commit();
  console.log('✅ All data uploaded!');
}

uploadData().catch(err => {
  console.error('Upload failed:', err);
  process.exit(1);
});
