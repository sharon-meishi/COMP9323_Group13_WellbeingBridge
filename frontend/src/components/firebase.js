import firebase from 'firebase/app'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBCtpx2UDCHx6b16kdB-t9uuNyYY0icJbA",
    authDomain: "comp9323-wellbeingbridge.firebaseapp.com",
    projectId: "comp9323-wellbeingbridge",
    storageBucket: "gs://comp9323-wellbeingbridge.appspot.com",
    messagingSenderId: "797890107282",
    appId: "1:797890107282:web:e3acfbe7a712f1d50e534b",
    measurementId: "G-1ZMW6QD2ZB",
}

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage()

export {
    storage, firebase as default
}