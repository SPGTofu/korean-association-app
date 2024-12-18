import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, getAuth } from "firebase/auth";
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";

//creates account with email and password
export const doCreateUserWithEmailAndPassword = async (email, password, userName) => {
    await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
    const userID = getAuth().currentUser.uid;
    await setDoc(doc(FIREBASE_DB, 'users', userID), {
        email: email,
        userName: userName,
        saved: [],
        roles: ['user']
    });
    return;
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
