// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaJ8enou9uX90GQRLBxYSqzbQP3UzTdQ8",
  authDomain: "react-vocablear ning.firebaseapp.com",
  projectId: "react-vocablearning",
  storageBucket: "react-vocablearning.appspot.com",
  messagingSenderId: "300527619606",
  appId: "1:300527619606:web:0e88401e283c1aa677af37",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
