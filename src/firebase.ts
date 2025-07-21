// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRHcfMg6V4fD_QtMErzOYPUjsEp162CBc",
  authDomain: "house-hold-app-4bcb8.firebaseapp.com",
  projectId: "house-hold-app-4bcb8",
  storageBucket: "house-hold-app-4bcb8.firebasestorage.app",
  messagingSenderId: "785065101060",
  appId: "1:785065101060:web:86b454f41f69f10b9df251"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};