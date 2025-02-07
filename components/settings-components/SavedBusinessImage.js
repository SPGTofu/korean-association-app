import { useEffect, useState } from "react";
import { getPublishedImageFromStorage } from "../storagecalls";
import noImageIcon from "../../assets/logos/no_image_icon.png"
import { Image } from "react-native";

export default function SavedBusinessImage({ business, style }) {
    const [imageUri, setImageUri] = useState(null);

    useEffect(() => {
        const getImageUri = async () => {
            const imageURL = business.photos[0];
            setImageUri(imageURL);    
        }        
        getImageUri();
        console.log('using effect1 in SavedbusinessImage');
    }, [business]);

    return (
        <Image
            source = {{ uri: imageUri != null ? imageUri : noImageIcon }}
            style = {style}
        />
    )
}