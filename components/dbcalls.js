import { FIREBASE_DB, FIREBASE_STORAGE } from "../FirebaseConfig";
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { uploadImageToStorage } from "./storagecalls";
import { getBlob, ref } from "firebase/storage";

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

export const getUserNameFromDatabase = async (user) => {
    try {
        const userCollectionRef = collection(FIREBASE_DB, "users");
        const userDocRef = doc(userCollectionRef, user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            return userDoc.data().userName;
        } else {
            throw new Error("user does not exist");
        }
    } catch(error) {
        console.error("Error getting username: ", error);
        return null;
    }
}

// create a document in businessRequests to await approval for a publish 
// also upload images to firebase storage
export const createBusinessRequest = async (name, 
                                            description, 
                                            phoneNumber, 
                                            address, 
                                            photosArray, 
                                            user,
                                            businessWebsite,
                                            instagram,
                                            yelp,
                                            facebook,
                                            hours,
                                            hoursDescription
                                        ) => {
    try {
        let arrayOfPhotoNames = [];

        // get user's name
        const userName = await getUserNameFromDatabase(user);

        // set publisher
        const publisher = {
            email: user.email,
            userName: userName
        }
    
        // upload each image to storage
        for (let i = 0; i < photosArray.length; i++) {
            const imageFilePath = name.replace(/\s/g, '');
            const imageNameString = imageFilePath + `${i}`;
            try {
                await uploadImageToStorage(imageFilePath, imageNameString, photosArray[i].uri);
            } catch(error) {
                return error;
            }
            arrayOfPhotoNames.push(imageNameString);
        }

        // add business to pending businesses
        const businessRequestCollectionRef = collection(FIREBASE_DB, "businessRequests");
        await addDoc(businessRequestCollectionRef, {
            name: name,
            description: description,
            phonenumber: phoneNumber,
            photos: [...arrayOfPhotoNames],
            address: address,
            businessWebsiteInfo: businessWebsite,
            instagramInfo: instagram,
            yelpInfo: yelp,
            facebookInfo: facebook,
            hours: hours,
            hoursDescription: hoursDescription,
            publisher: publisher
        });

        return;
    }
    catch (error) {
        console.error(error);
        return error;
    }
}

// checks if user is an admin
export const checkIfUserIsAdmin = async (user) => {
    try {
        const userDocRef = doc(FIREBASE_DB, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            return userDoc.data().roles.includes("admin");
        }
        else {
            console.error('userDoc does not exist');
            return false;
        }
    }
    catch (error) {
        console.error("Error checking for admin: ", error);
        return false;
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
                        publisher: doc.data().publisher,
                        businessWebsiteInfo: doc.data().businessWebsiteInfo,
                        facebookInfo: doc.data().facebookInfo,
                        instagramInfo: doc.data().instagramInfo,
                        yelpInfo: doc.data().yelpInfo

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