// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5zfaBeqhWxTLiTgcGZOtjdf8ZP7M7gP0",
  authDomain: "chatapp-e26b8.firebaseapp.com",
  projectId: "chatapp-e26b8",
  storageBucket: "chatapp-e26b8.appspot.com",
  messagingSenderId: "483622305554",
  appId: "1:483622305554:web:5d5247d39c6a978c6a3dcb",
  measurementId: "G-7QG0LNT8WZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };
export default app;
