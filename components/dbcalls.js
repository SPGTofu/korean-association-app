import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import { addDoc, collection } from "firebase/firestore";

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
export const createBusinessRequest = async (name, description, phoneNumber, address, photosArray) => {
    try {
        const businessRequestCollectionRef = collection(FIREBASE_DB, "businessRequests");
        await addDoc(businessRequestCollectionRef, {
            name: name,
            description: description,
            phonenumber: phoneNumber,
            address: address,
            photos: [...photosArray]
        });
        return;
    }
    catch (error) {
        return error;
    }
}