import firebase from 'firebase/app';
import 'firebase/storage';
import configData from '../../configData.json'

firebase.initializeApp(configData.firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
