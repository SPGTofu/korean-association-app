import { deleteObject, getBlob, getDownloadURL, getStorage, ref, uploadBytes, uploadString } from "firebase/storage";
import { FIREBASE_STORAGE } from "../FirebaseConfig";

// upload a pending image
export const uploadPendingImageToStorage = async (filePath, imageName, uri) => {
    try {
      const response = await fetch(uri);
      const imageBlob = await response.blob();
      const storageRef = ref(FIREBASE_STORAGE, `pendingImages/${filePath}/${imageName}.jpg`);
      await uploadBytes(storageRef, imageBlob);
    }
    catch (error) {
        console.error(error);
        return null;
    }
}


// gets image frmo the pending images
export const getPendingImageFromStorage = async (businessName, imageName) => {
  try {
      const imageFilePath = businessName.replace(/\s/g, '');
      const imageRef = ref(FIREBASE_STORAGE, `pendingImages/${imageFilePath}/${imageName}.jpg`);
      return await getDownloadURL(imageRef);
  } catch(error) {
      console.error(error);
      return null;
  }
}

// upload a published image
export const movePendingImageToPublishedImage = async (imageFilePath, imageName) => {
  try {
    const sourceRef = ref(FIREBASE_STORAGE, `pendingImages/${imageFilePath}/${imageName}.jpg`);
    const destinationRef = ref(FIREBASE_STORAGE, `publishedImages/${imageFilePath}/${imageName}.jpg`);

    // get source file
    const URL = await getDownloadURL(sourceRef);
    const response = await fetch(URL);
    const blob = response.blob();

    // upload to destination
    await uploadBytes(destinationRef, blob);

    // remove original
    await deleteObject(sourceRef);

  } catch (error) {
    console.error(error);
    return null;
  }
}

// gets image from the pending images
export const getPublishedImageFromStorage = async (businessName, imageName) => {
  try {
      const imageFilePath = businessName.replace(/\s/g, '');
      const imageRef = ref(FIREBASE_STORAGE, `publishedImages/${imageFilePath}/${imageName}.jpg`);
      return await getDownloadURL(imageRef);
  } catch(error) {
      console.error(error);
      return null;
  }
}