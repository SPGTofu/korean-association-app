import { getBlob, getDownloadURL, getStorage, ref, uploadBytes, uploadString } from "firebase/storage";
import { FIREBASE_STORAGE } from "../FirebaseConfig";

// upload an image to storage
export const uploadImageToStorage = async (filePath, imageName, uri) => {
    try {
      const response = await fetch(uri);
      const imageBlob = await response.blob();
      const storageRef = ref(FIREBASE_STORAGE, `images/${filePath}/${imageName}.jpg`);
      await uploadBytes(storageRef, imageBlob);
    }
    catch (error) {
        console.error(error);
        return error;
    }
}


// first image from array
export const getImageFromStorage = async (businessName, imageName) => {
  try {
      const imageFilePath = businessName.replace(/\s/g, '');
      const imageRef = ref(FIREBASE_STORAGE, `images/${imageFilePath}/${imageName}.jpg`);
      return await getDownloadURL(imageRef);
  } catch(error) {
      console.error(error);
      return null;
  }
}