import { deleteObject, getBlob, getDownloadURL, getStorage, listAll, ref, uploadBytes, uploadString } from "firebase/storage";
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
export const getPendingImageFromStorage = async (documentID, imageName) => {
  try {
    const imageRef = ref(FIREBASE_STORAGE, `pendingImages/${documentID}/${imageName}.jpg`);
    const url = await getDownloadURL(imageRef);
    return url;
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
    const blob = await response.blob();

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
export const getPublishedImageFromStorage = async (documentID, imageName) => {
  try {
      const imageRef = ref(FIREBASE_STORAGE, `publishedImages/${documentID}/${imageName}.jpg`);
      const url = await getDownloadURL(imageRef);
      return url;
  } catch(error) {
      console.error(error);
      return null;
  }
}

// upload a business edit image
export const uploadBusinessEditImage = async (filePath, imageName, uri) => {
  try {
    const response = await fetch(uri);
    const imageBlob = await response.blob();
    const storageRef = ref(FIREBASE_STORAGE, `businessEditImages/${filePath}/${imageName}.jpg`);
    await uploadBytes(storageRef, imageBlob);
  } catch (error) {
      console.error(error);
      return null;
  }
}

// upload a business edit image
export const getBusinessEditImage = async (documentID, imageName) => {
  try {
    const imageRef = ref(FIREBASE_STORAGE, `businessEditImages/${documentID}/${imageName}.jpg`);
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
      console.error(error);
      return null;
  }
}

// upload image to published business
export const uploadPublishedImageToStorage = async (documentID, imageName, uri) => {
  try {
    const response = await fetch(uri);
    const imageBlob = await response.blob();
    const imageRef = ref(FIREBASE_STORAGE, `publishedImages/${documentID}/${imageName}.jpg`);
    await uploadBytes(imageRef, imageBlob);
  } catch (error) {
    console.error(error)
    return null;
  }
}

// delete a published image of a business
export const deletePublishedImagesOfBusinessInStorage = async (documentID) => {
  try {
    const businessImagesRef = ref(FIREBASE_STORAGE, `publishedImages/${documentID}`);
    const result = await listAll(businessImagesRef);
    const deleteRefs = result.items.map(fileRef => deleteObject(fileRef));
    await Promise.all(deleteRefs);
  } catch (error) {
    console.error(error);
  }
}

// check if any current images were removed from the edited business
// REMOVES IF NOT
export const removePublishedImageIfNotInURLArray = async (arrayOfImageURLs, documentID) => {
  try {
    const publishedBusinessImageRef = ref(FIREBASE_STORAGE, `publishedImages/${documentID}`);
    const result = await listAll(publishedBusinessImageRef);
    
    // delete ref if not in array
    const urls = await Promise.all(result.items.map(image => getDownloadURL(image)));
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      if (!arrayOfImageURLs.includes(url)) {
        await deleteObject(result.items[i]);
      }
    }
  } catch (error) {
    console.error(error);
  }
}  

// returns an array of image names dependent on the input order
export const returnArrayOfImageNamesInOrderGiven = async (arrayOfImageURLs, documentID) => {
  try {
    const publishedBusinessImageRef = ref(FIREBASE_STORAGE, `publishedImages/${documentID}`);
    const result = await listAll(publishedBusinessImageRef);

    // becomes array of all indexes used
    const arrayOfUsedIndexes = result.items.map(item => {
      const nameParts = item.name.split('_');
      const nameWithoutExtension = nameParts.slice(1).join('_').replace('.jpg', '');
      return nameWithoutExtension;
    })
    const urls = await Promise.all(result.items.map(image => getDownloadURL(image)));
    const urlSet = new Set(urls);

    const returnArray = [];
    for (let i = 0; i < arrayOfImageURLs.length; i++) {
      let fileName = "";
      let index = i;

      // if arrayOfImageURLs[i] is in urls, find url name and push it
      if (urlSet.has(arrayOfImageURLs[i])) {
        fileName = result.items[urls.indexOf(arrayOfImageURLs[i])].name.replace('.jpg', '');
        returnArray.push(fileName);
      } else {
        // else, add file to storage with index that is not used
        while (arrayOfUsedIndexes.includes(index.toString())) {
          index++;
          if (index > 30) {
            console.error('Passed 30 indexes (shouldn\'t happen)');
            break;
          }
        }  
        fileName = `${documentID}_${index}`; 
        await uploadPublishedImageToStorage(documentID, fileName, arrayOfImageURLs[i]);
        returnArray.push(fileName);
      }

      // add index to array
      arrayOfUsedIndexes.push(index.toString());
    }

    return returnArray;
  } catch (error) {
    console.error(error);
  }
}

// delete all files in ref fold
export const deleteFolderInBusinessEditImages = async (folderName) => {
  try {
    const folderRef = ref(FIREBASE_STORAGE, `businessEditImages/${folderName}`);
    const listResult = await listAll(folderRef);

    for (const item of listResult.items) {
      await deleteObject(item);
    }
  } catch (error) {
    console.error(error);
  }
}