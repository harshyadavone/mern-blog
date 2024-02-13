// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-30098.firebaseapp.com",
  projectId: "mern-blog-30098",
  storageBucket: "mern-blog-30098.appspot.com",
  messagingSenderId: "595285769871",
  appId: "1:595285769871:web:d23d75c8f8603efd1a7afa"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

