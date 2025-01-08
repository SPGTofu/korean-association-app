import { initializeApp, firebase } from "firebase/app";
import { connectAuthEmulator, getReactNativePersistence, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENTID,
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, { persistence: getReactNativePersistence(AsyncStorage) });
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage();

// Emulator setup
// if (__DEV__) {
//   connectAuthEmulator(FIREBASE_AUTH, "http://localhost:9099");
//   connectFirestoreEmulator(FIREBASE_DB, "127.0.0.1", 8081);
//   connectStorageEmulator(FIREBASE_STORAGE, "127.0.0.1", 9199);
// }