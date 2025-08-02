import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD6qiwAuo3iz9HXV39iWU1xNVS0pbM7ZxM",
  authDomain: "shopay-firebase.firebaseapp.com",
  projectId: "shopay-firebase",
  storageBucket: "shopay-firebase.firebasestorage.app",
  messagingSenderId: "204445991752",
  appId: "1:204445991752:web:92a8ec541cbb2e3b08697d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
