import admin from 'firebase-admin';
import firebaseConfig from '../../firebase.json';

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

admin.firestore().settings({ timestampsInSnapshots: true });

const db = admin.firestore();

export default db;
