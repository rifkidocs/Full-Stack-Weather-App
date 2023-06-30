import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAeW-eSPjlbwNc5-bJCqBYQPRxtbD71jdw",
  authDomain: "wheater-app-52a22.firebaseapp.com",
  projectId: "wheater-app-52a22",
  storageBucket: "wheater-app-52a22.appspot.com",
  messagingSenderId: "135781108471",
  appId: "1:135781108471:web:180ac92a9894095d4b61f2",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);