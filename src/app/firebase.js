// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
import {getAuth} from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API,
  authDomain: "food-pantry-84c10.firebaseapp.com",
  databaseURL: "https://food-pantry-84c10-default-rtdb.firebaseio.com",
  projectId: "food-pantry-84c10",
  storageBucket: "food-pantry-84c10.appspot.com",
  messagingSenderId: "766545090664",
  appId: "1:766545090664:web:e0584051e46a9a742d03dd",
  measurementId: "G-5FLXZ1BRMM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
const auth = getAuth(app)
//const analytics = getAnalytics(app);

export {app, firestore, auth}