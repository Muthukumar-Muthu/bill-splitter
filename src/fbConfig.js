// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBttOlgyIvVNC21lB0N1TnbUbIdhgDDgWU",
  authDomain: "bill-splitter-d1f87.firebaseapp.com",
  projectId: "bill-splitter-d1f87",
  storageBucket: "bill-splitter-d1f87.appspot.com",
  messagingSenderId: "785951106193",
  appId: "1:785951106193:web:3a516828f837981bafcb30",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { app, db, auth };
