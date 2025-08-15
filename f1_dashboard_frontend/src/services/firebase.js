import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, push, ref, serverTimestamp } from 'firebase/database';

const cfg = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

let app = null;
let db = null;

if (cfg.apiKey && cfg.databaseURL) {
  try {
    app = initializeApp(cfg);
    db = getDatabase(app);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to init Firebase', e);
  }
}

// PUBLIC_INTERFACE
export function isFirebaseConfigured() {
  /** Returns true if Firebase configuration is available and initialized. */
  return !!db;
}

// PUBLIC_INTERFACE
export function subscribeToMessages(callback) {
  /**
   * Subscribes to realtime messages at /messages and invokes callback(list) on changes.
   * Returns an unsubscribe function.
   */
  if (!db) return () => {};
  const messagesRef = ref(db, 'messages');
  const off = onValue(messagesRef, (snapshot) => {
    const val = snapshot.val() || {};
    const list = Object.entries(val)
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    callback(list);
  });
  // onValue returns the listener; to unsubscribe we call it with no args per SDK docs:
  return () => off();
}

// PUBLIC_INTERFACE
export async function sendMessage(username, text) {
  /** Sends a message to the realtime database. No-op if Firebase is not configured. */
  if (!db) return false;
  const messagesRef = ref(db, 'messages');
  await push(messagesRef, {
    username: username?.trim() || 'Anonymous',
    text: text?.trim() || '',
    createdAt: Date.now(),
    serverAt: serverTimestamp()
  });
  return true;
}
