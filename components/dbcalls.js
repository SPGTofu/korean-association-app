import { FIREBASE_DB, FIREBASE_STORAGE } from "../FirebaseConfig";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { movePendingImageToPublishedImage, uploadPendingImageToStorage, uploadingPublishedImageToStorage } from "./storagecalls";
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

// get the user's name from the database
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
export const createBusinessRequest = async (businessData, user) => {
    try {
        // setup doc to get the ID of it for naming purposes
        const businessRequestCollectionRef = collection(FIREBASE_DB, "businessRequests");
        const docRef = await addDoc(businessRequestCollectionRef, {});
        const docID = docRef.id

        let arrayOfPhotoNames = [];
        let publisher = {
            email: "",
            userName: "",
        }
        console.log('check1');
        // set submitter: 
        const submitter = {
            userName: await getUserNameFromDatabase(user),
            email: user.email
        };

        // set publisher
        if (businessData.isOwner) {
            publisher = submitter;
        };
        console.log('check2');

        // upload each image to storage
        for (let i = 0; i < businessData.imageUriArray.length; i++) {
            const imageFilePath = docID;
            const imageNameString = `${imageFilePath}_${i}`;
            try {
                await uploadPendingImageToStorage(
                    imageFilePath, 
                    imageNameString, 
                    businessData.imageUriArray[i].uri
                );
            } catch(error) {
                console.error(error);
                return error;
            }
            arrayOfPhotoNames.push(imageNameString);
        };
        console.log('check3');

        // add business to pending businesses
        console.log('setting');
        await setDoc(docRef, {
            name: businessData.businessName,
            description: businessData.businessDescription,
            phonenumber: businessData.businessPhoneNumber,
            photos: [...arrayOfPhotoNames],
            address: businessData.businessAddress,
            businessWebsiteInfo: businessData.businessWebsite,
            instagramInfo: businessData.instagram,
            yelpInfo: businessData.yelp,
            facebookInfo: businessData.facebook,
            hours: businessData.hours,
            hoursDescription: businessData.hoursDescription,
            submitter: submitter,
            publisher: publisher
        });
        console.log('done: ', docID);
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
        } else {
            console.error('userDoc does not exist');
            return false;
        }
    }
    catch (error) {
        console.error("Error checking for admin: ", error);
        return false;
    }
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
                        yelpInfo: doc.data().yelpInfo,
                        hours: doc.data().hours,
                        hoursDescription: doc.data().hoursDescription,
                        docID: doc.id 
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

// sends business into database
export const sendBusinessDataToDatabase = async (businessData) => {
    try {
        // add doc to database
        const databaseCollectionRef = collection(FIREBASE_DB, "database");
        const pubDocRef = doc(databaseCollectionRef, businessData.docID);
        await setDoc(pubDocRef, {
            name: businessData.name,
            tags: businessData.tags,
            phoneNumber: businessData.phoneNumber,
            businessWebsiteInfo: businessData.businessWebsiteInfo,
            instagramInfo: businessData.instagramInfo,
            facebookInfo: businessData.facebookInfo,
            yelpInfo: businessData.yelpInfo,
            description: businessData.description,
            hours: businessData.hours,
            address: businessData.address,
            publisher: businessData.publisher,
            photos: businessData.photoNames
        });
        console.log('doc addition successful');

        // remove doc from pending businesses
        const businessRequestsCollectionRef = collection(FIREBASE_DB, "businessRequests");
        const docRef = doc(businessRequestsCollectionRef, businessData.docID);
        const docSnapshot = await getDoc(docRef);

        if (!docSnapshot.exists()) {
            console.error("No documents found");
            return;
        }
        await deleteDoc(docRef);
        console.log('doc deletion successful');
        
        // add images to published images and removes from pending images
        for (let i = 0; i < businessData.photos.length; i++) {
            const imageFilePath = businessData.docID;
            const imageNameString = `${imageFilePath}_${i}`;
            await movePendingImageToPublishedImage(imageFilePath, imageNameString);
        }
    } catch(error) {
        console.error(error);
        return null;
    }
}

// gets business by its name
export const getPublishedBusinessByID = async (documentID) => {
    try {
        const databaseCollectionRef = collection(FIREBASE_DB, "database");
        const docRef = doc(databaseCollectionRef, documentID);
        const snapshot = await getDoc(docRef);
    
        if (snapshot.exists()) {
            return {...snapshot.data(), docID: documentID};
        } else {
            console.error('document not found');
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}


// gets a user's current saved list of businesses
export const getSavedBusinessesOfUser = async (user) => {
    try {
        const userCollectionRef = collection(FIREBASE_DB, "users");
        const userDocRef = doc(userCollectionRef, user.uid);
        const userDoc = await getDoc(userDocRef);
        
        // checks if user even exists
        if (userDoc.exists()) {
            const userDocSaved = userDoc.data().saved;
            let arrayOfSavedBusinesses = [];
            for (const business of userDocSaved) {
                const businessData = await getPublishedBusinessByID(business);
                arrayOfSavedBusinesses.push(businessData);
            }
            return arrayOfSavedBusinesses;
        } else {
            console.error('userDoc does not exist');
            return [];
        }
    } catch (error) {
        console.error(error);
        return [];
    }    
}