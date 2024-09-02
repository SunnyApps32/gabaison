import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
 
  apiKey: "AIzaSyBGg9ott0si4ZcfAzSvwULbgoHq4lsL60Y",
 
  authDomain: "gabaison.firebaseapp.com",
 
  projectId: "gabaison",
 
  storageBucket: "gabaison.appspot.com",
 
  messagingSenderId: "699202983308",
 
  appId: "1:699202983308:web:cff774f3d95d6d34e232a9"
 
};


  // firebaseConfigの値を元にfirebaseの初期化
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  
  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);
  // Initialize Authentication
  const auth = getAuth(app)
  
  export default { analytics, db, auth };
