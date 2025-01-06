// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBNN6dHPw2wc-5HuEbXLOBN1u0mdrfaEM",
  authDomain: "chatapp-e26b8.firebaseapp.com",
  projectId: "chatapp-e26b8",
  storageBucket: "chatapp-e26b8.firebasestorage.app",
  messagingSenderId: "483622305554",
  appId: "1:483622305554:web:b0c987585e219d096a3dcb",
  measurementId: "G-33M58LJLQM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };
export default app;
