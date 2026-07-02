// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHtvYlOiuU34d5HldO_NkvZ1i9DPv79sA",
  authDomain: "sgrh-ushuaia.firebaseapp.com",
  databaseURL: "https://sgrh-ushuaia-default-rtdb.firebaseio.com",
  projectId: "sgrh-ushuaia",
  storageBucket: "sgrh-ushuaia.firebasestorage.app",
  messagingSenderId: "837788985439",
  appId: "1:837788985439:web:e1e6d1552e22aad0f753ea"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)