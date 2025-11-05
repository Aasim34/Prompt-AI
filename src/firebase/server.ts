
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

function getFirebaseAdmin() {
  if (getApps().length) {
    return getSdks(getApp());
  }
  
  let firebaseApp;
  try {
    // This will only work if GOOGLE_APPLICATION_CREDENTIALS is set
    firebaseApp = initializeApp();
  } catch (e) {
    if (process.env.NODE_ENV === "production") {
      console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
    }
    // Fallback for local development
    firebaseApp = initializeApp(firebaseConfig);
  }

  return getSdks(firebaseApp);
}

function getSdks(firebaseApp: FirebaseApp) {
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  return {
    firebaseApp,
    auth,
    firestore
  };
}

export { getFirebaseAdmin };
