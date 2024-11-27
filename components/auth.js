import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, getAuth } from "firebase/auth";
import { FIREBASE_AUTH } from "../FirebaseConfig";

//creates account with email and password
export const doCreateUserWithEmailAndPassword = async (email, password) => {
    await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
    const userID = getAuth().currentUser.uid;
    await setDoc(doc(db, 'users', userID), {
        email: email,
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