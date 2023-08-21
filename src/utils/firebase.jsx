// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAw-gVmqxDR_JAEmBrCRGQnyHg0mRthDnQ",
  authDomain: "skkp-mobile.firebaseapp.com",
  projectId: "skkp-mobile",
  storageBucket: "skkp-mobile.appspot.com",
  messagingSenderId: "844645560252",
  appId: "1:844645560252:web:27ef4feeaa8255ab26c5b9",
  measurementId: "G-LN0HYGE0FN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
