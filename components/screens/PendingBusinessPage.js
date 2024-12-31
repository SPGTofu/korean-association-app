import { useEffect, useState } from "react";
import { View } from "react-native";
import { handleCreateToast } from "../settings-components/Toast";
import Toast from "react-native-toast-message";
import { getPendingImageFromStorage } from "../storagecalls";
import BusinessPage from "../settings-components/EditBusinessPage";
import { PendingBusinessPageContext } from "../contexts/PendingBusinessPageContext";

export default function PendingBusinessPage({ route, navigation }) {
    const { businessData } = route.params;

    // creating context for businesses
    const [owner, setOwner] = useState(businessData.publisher);
    const [publishingPhoneNumber, setPublishingPhoneNumber] = useState(businessData.phoneNumber);
    const [publishingAddress, setPublishingAddress] = useState(businessData.address);
    const [publishingName, setPublishingName] = useState(businessData.name);
    const [publishingHours, setPublishingHours] = useState(businessData.hours);
    const [publishingHoursDescription, setPublishingHoursDescription] = useState(businessData.hoursDescription);
    const [publishingDescription, setPublishingDescription] = useState(businessData.description);
    const [publishingImages, setPublishingImages] = useState([]);
    const [publishingBusinessWebsite, setPublishingBusinessWebsite] = useState(businessData.businessWebsiteInfo);
    const [publishingBusinessFacebookInfo, setPublishingBusinessFacebookInfo] = useState(businessData.facebookInfo);
    const [publishingBusinessInstagramInfo, setPublishingBusinessInstagramInfo] = useState(businessData.instagramInfo);
    const [publishingBusinessYelpInfo, setPublishingBusinessYelpInfo] = useState(businessData.yelpInfo);
    const [tags, setTags] = useState(["" , "", ""]);
    const [arrayOfPhotoNames, setArrayOfPhotoNames] = useState(businessData.photos);
    
    // fetches all of the pending business' images
    const fetchPendingBusinessImages = async () => {
        if (businessData?.photos?.length > 0) {
            const fetchedURLs = [];
            for (const photo of businessData.photos) {
                const imageURL = await getPendingImageFromStorage(businessData.docID, photo);
                fetchedURLs.push(imageURL);
            }
            setPublishingImages(fetchedURLs);
        }
    };
    
    // setup for context
    const pendingBusinessPageContextData = { 
        publishingImages, setPublishingImages,
        publishingName, setPublishingName,
        tags, setTags,
        publishingBusinessWebsite, setPublishingBusinessWebsite,
        publishingBusinessFacebookInfo, setPublishingBusinessFacebookInfo,
        publishingBusinessInstagramInfo, setPublishingBusinessInstagramInfo,
        publishingBusinessYelpInfo, setPublishingBusinessYelpInfo,
        publishingDescription, setPublishingDescription,
        publishingHours, setPublishingHours,
        publishingAddress, setPublishingAddress,
        publishingPhoneNumber, setPublishingPhoneNumber,
        owner, setOwner,
        publishingHoursDescription, setPublishingHoursDescription,
        fetchPendingBusinessImages,
        arrayOfPhotoNames, setArrayOfPhotoNames
    };

    const handleNavigationToBusinessPreview = () => {
        const previewData = {
            name: publishingName,
            tags: tags,
            phoneNumber: publishingPhoneNumber,
            businessWebsiteInfo: publishingBusinessWebsite,
            instagramInfo: publishingBusinessInstagramInfo,
            facebookInfo: publishingBusinessFacebookInfo,
            yelpInfo: publishingBusinessYelpInfo,
            description: publishingDescription,
            hours: publishingHours,
            address: publishingAddress,
            publisher: owner,
            photos: publishingImages,
            photoNames: arrayOfPhotoNames,
            docID: businessData.docID
        };
        navigation.navigate('PublishingPagePreview', { previewData });
    }
    
    useEffect(() => {
        fetchPendingBusinessImages();
    }, [businessData]);
    
    const createToastForPage = (type, message, location) => {
        handleCreateToast(type, message, location);
    } 

    return (
        <PendingBusinessPageContext.Provider value = {pendingBusinessPageContextData}>
            <View>
                <BusinessPage 
                    businessData = {businessData}
                    createToastForPage = {createToastForPage}
                    navigation = {navigation}
                    handleNavigationToBusinessPreview = {handleNavigationToBusinessPreview}
                />
                <Toast />
            </View>
        </PendingBusinessPageContext.Provider>
    )
}