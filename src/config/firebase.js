import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyCpiXP1B7hhnOUD9Xb6FM4mLg6nFADnwE0",
    authDomain: "kalorimax-cbaf3.firebaseapp.com",
    projectId: "kalorimax-cbaf3",
    storageBucket: "kalorimax-cbaf3.appspot.com",
    messagingSenderId: "127418740425",
    appId: "1:127418740425:web:8aebe0e5f27afdcb9be718"
};

// Initialize Firebase
let app;
let auth;
let db;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    
    console.log('Firebase başarıyla başlatıldı');
} catch (error) {
    console.error('Firebase başlatılırken hata oluştu:', error);
    throw error;
}

export { 
    app,
    auth, 
    db, 
    signInAnonymously, 
    onAuthStateChanged, 
    doc, 
    getDoc, 
    setDoc, 
    serverTimestamp 
};
