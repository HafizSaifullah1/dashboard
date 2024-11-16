// firebaseConfig.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth} from 'firebase/auth';
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyBxD6jk7QMyu_1dS_ZRE3sQ9rodkWE5Log",
    authDomain: "sastabazar-82a8b.firebaseapp.com",
    databaseURL: "https://sastabazar-82a8b-default-rtdb.firebaseio.com",
    projectId: "sastabazar-82a8b",
    storageBucket: "sastabazar-82a8b.appspot.com",
    messagingSenderId: "246279486066",
    appId: "1:246279486066:web:8081c1a83906e8921160eb",
    measurementId: "G-88BP7LN4TW"
};

// Initialize Firebase app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Export Firebase services for use in other files
export { db, auth, storage, };
