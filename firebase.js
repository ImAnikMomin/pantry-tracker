// app/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBXHN1qqd-Oe1GYaF1j00eLkfPLxf7qDi8",
  authDomain: "pantry-50409.firebaseapp.com",
  projectId: "pantry-50409",
  storageBucket: "pantry-50409.appspot.com",
  messagingSenderId: "1027054689286",
  appId: "1:1027054689286:web:cb8a4872037aaf98887787",
  measurementId: "G-ZBBL6MTB9S"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { firestore, auth, provider };
