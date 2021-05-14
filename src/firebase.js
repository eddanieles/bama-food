import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCQBccYqCJKX4pWNzaOpAUX_ox5bXrjPLY",
    authDomain: "bama-food-thing.firebaseapp.com",
    projectId: "bama-food-thing",
    storageBucket: "bama-food-thing.appspot.com",
    messagingSenderId: "463193229572",
    appId: "1:463193229572:web:2b5e50203b74f9fcd72851",
    measurementId: "G-DJ3L3T9986"
  };
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore();
const auth = firebase.auth();

// collection references
const usersCollection = db.collection('users');
const favoritesCollection = db.collection('favorites');
const trylistCollection = db.collection('trylist');
const networkCollection = db.collection('network');

// export utils/refs
export {
    db,
    auth,
    usersCollection,
    favoritesCollection,
    trylistCollection,
    networkCollection
}