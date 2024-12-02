import { FIREBASE_DB } from "../FirebaseConfig";
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";

/* create a document with the business' 
name, description, phone number, and address */
export const addBusinessWithData = async (name, description, phoneNumber, address) => {
    try {
        const businessCollectionRef = collection(FIREBASE_DB, "database");
        await addDoc(businessCollectionRef, {
            name: name,
            description: description,
            phonenumber: phoneNumber,
            address: address
        });
        return CREATION_SUCCESS;
    }
    catch (error) {
        return error;
    }
}

// create a document in businessRequests to await approval for a publish 
export const createBusinessRequest = async (name, description, phoneNumber, address, photosArray, user) => {
    try {
        const businessRequestCollectionRef = collection(FIREBASE_DB, "businessRequests");
        await addDoc(businessRequestCollectionRef, {
            name: name,
            description: description,
            phonenumber: phoneNumber,
            address: address,
            photos: [...photosArray],
            publisher: user
        });
        return;
    }
    catch (error) {
        return error;
    }
}

// checks if user is an admin
export const checkIfUserIsAdmin = async (user) => {
    try {
        const userCollectionRef = collection(FIREBASE_DB, "users");
        const userDoc = await getDoc(userCollectionRef, user.uid);
        if (userDoc.exists()) {
            return userDoc.data().contains("admin");
        }
        else {
            console.error('userDoc does not exist');
            return false;
        }
    }
    catch (error) {
        return error;
    }
}

// return an array of all pending businesses
export const getArrayOfPendingBusinessesFromRequests = async () => {

}


// return collection of business requests from db
export const returnBusinessRequestCollectionRef = () => {
    const returnCollection = collection(FIREBASE_DB, "businessRequests");
    return returnCollection;
}

// return listener to collection of pending business requests
export const subscribeToPendingBusinesses = (setArrayOfPendingBusinesses) => {
    try {
        const collectionRef = collection(FIREBASE_DB, "businessRequests");
        const businessQuery = query(collectionRef, where("name", "!=", ""));
        const unsub = onSnapshot(businessQuery, (snapshot) => {
                const tempArrayOfPendingBusinesses = [];
                snapshot.forEach((doc) => {
                    tempArrayOfPendingBusinesses.push({
                        name: doc.data().name,
                        phoneNumber: doc.data().phonenumber,
                        photos: doc.data().photos,
                        address: doc.data().address,
                        description: doc.data().description,                    
                    });
                });
                setArrayOfPendingBusinesses(tempArrayOfPendingBusinesses);
            })
            return unsub;
     }
     catch(error) {
        console.error('error returning query of business requests: ', error);
        return[];
     }
}
