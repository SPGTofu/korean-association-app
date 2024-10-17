import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import { addDoc, collection } from "firebase/firestore";

//creates account with email and password
export const doCreateUserWithEmailAndPassword = async (email, password) => {
    const userCollectionRef = collection(FIREBASE_DB, "users");
    await addDoc(userCollectionRef, { 
        email: email,
        saved: []
     });
    return await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
}

//signs in with email and password
export const doSignInWithEmailAndPassword = async (email, password) => {
    return await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
}

//function signs out
export const doSignOut = async () => {
    return await FIREBASE_AUTH.signOut();
}

//function sends email for password reset
export const doSendPasswordResetEmail = async (email) => {
    return await sendPasswordResetEmail(FIREBASE_AUTH, email);
}