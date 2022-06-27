// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFlsIa5Ycg11Zj5gFrMR8mNgDI_IXkFu4",
  authDomain: "fridge-app-f7e1f.firebaseapp.com",
  projectId: "fridge-app-f7e1f",
  storageBucket: "fridge-app-f7e1f.appspot.com",
  messagingSenderId: "330763897965",
  appId: "1:330763897965:web:67fbc9e90314b444294364"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
 export const db = getFirestore(app);