// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {
    getAuth,
    GoogleAuthProvider,
  } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlLYUGhSMwq8kFE-cc89xZJCcMTlp8MRU",
  authDomain: "silakbo-ff484.firebaseapp.com",
  databaseURL: "https://silakbo-ff484-default-rtdb.firebaseio.com",
  projectId: "silakbo-ff484",
  storageBucket: "silakbo-ff484.firebasestorage.app",
  messagingSenderId: "932268373029",
  appId: "1:932268373029:web:04fba139f922806e61bbcc",
  measurementId: "G-P9TSCY9K8N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
