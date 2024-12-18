import { useTheme } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Button, FlatList, Image, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { handleCreateToast } from "../settings-components/Toast";
import noImageIcon from "../../assets/no-image-icon.jpg"
import Toast from "react-native-toast-message";
import { getImageFromStorage } from "../storagecalls";
import ImageButton from "../settings-components/ImageButton";

export default function PendingBusinessPage({ route }) {
    const { businessData } = route.params;
    const [publishingName, setPublishingName] = useState(businessData.name);
    const [publishingPhoneNumber, setPublishingPhoneNumber] = useState(businessData.phoneNumber);
    const [publishingAddress, setPublishingAddress] = useState(businessData.address);
    const [publishingDescription, setPublishingDescription] = useState(businessData.description);
    const { colors } = useTheme();
    const nameRef = useRef(null);
    const addressRef = useRef(null);
    const descriptionRef = useRef(null);
    const numberRef = useRef(null);
    const [publishingImages, setPublishingImages] = useState([]);
    const [publishingBusinessWebsite, setPublishingBusinessWebsite] = useState(businessData.businessWebsiteInfo);
    const [publishingBusinessFacebookInfo, setPublishingBusinessFacebookInfo] = useState(businessData.facebookInfo);
    const [publishingBusinessInstagramInfo, setPublishingBusinessInstagramInfo] = useState(businessData.instagramInfo);
    const [publishingBusinessYelpInfo, setPublishingBusinessYelpInfo] = useState(businessData.yelpInfo);
    const businessWebsiteRef = useRef(null);
    const businessFacebookRef = useRef(null);
    const businessInstagramRef = useRef(null);
    const businessYelpRef = useRef(null);
    const [imageSelectedValue, setImageSelectedValue] = useState(-1);

    const fetchPendingBusinessImages = async () => {
        if (businessData?.photos?.length > 0) {
            const fetchedURLs = [];
            for (const photo of businessData.photos) {
                const imageURL = await getImageFromStorage(businessData.name, photo);
                fetchedURLs.push(imageURL);
            }
            setPublishingImages(fetchedURLs);
        }
    };

    useEffect(() => {
        fetchPendingBusinessImages();
    }, [businessData]);

    // testing purposes
    //  useEffect(() => {
    //      console.log(businessData);
    // }, [businessData]);


    const handleResetDefault = () => {
        setPublishingName(businessData.name);
        setPublishingPhoneNumber(businessData.phoneNumber);
        setPublishingAddress(businessData.address);
        setPublishingDescription(businessData.description);
        setPublishingBusinessWebsite(businessData.businessWebsiteInfo);
        setPublishingBusinessFacebookInfo(businessData.facebookInfo);
        setPublishingBusinessInstagramInfo(businessData.instagramInfo);
        setPublishingBusinessYelpInfo(businessData.yelpInfo);

        fetchPendingBusinessImages();
        handleCreateToast('success', 'Reset information to default', 'bottom');
    };
    
    // sets image selected value to the index of image
    const handleImageClicked = (imageIndex) => {
        setImageSelectedValue(imageIndex);
    }

    // function for when cancel is clicked on iamge
    const handleCancelClicked = () => {
        setImageSelectedValue(-1);
    }

    // function for when right is clicked on image
    const handleRightClicked = () => {
        if (imageSelectedValue < publishingImages.length - 1) {
            const newOrder = [...publishingImages];
            [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
            setPublishingImages(newOrder);
        }
    }

    return (
        <View>
            <TouchableWithoutFeedback onPress = {() => Keyboard.dismiss()}>
                <ScrollView
                    contentContainerStyle = {styles.container}
                >
                    <Text style = {[styles.header, {color: colors.text}]}>
                        Review Business Information
                    </Text>
                    <Text style = {{color: colors.text, fontSize: 16}}>
                        Publisher: {businessData.publisher.userName}
                    </Text>
                    <Button 
                        title = "Reset to Default"
                        color = '#19b0b5'
                        onPress = {() => handleResetDefault()}
                    />
                    <View style = {[styles.line, {backgroundColor: colors.text}]}/>

                    <Text style = {{color: colors.text}}>Name</Text>
                    <TextInput
                        style = {[styles.inputBox, {borderColor: colors.text, color: colors.text}]}
                        ref = {nameRef}
                        value = {publishingName}
                        onChangeText = {(text) => setPublishingName(text)}
                    />

                    <Text style = {{color: colors.text}}>Phone Number</Text>
                    <TextInput
                        style = {[styles.inputBox, {borderColor: colors.text, color: colors.text}]}
                        value = {publishingPhoneNumber}
                        ref = {numberRef}
                        onChangeText = {(text) => setPublishingPhoneNumber(text)}

                    />

                    <Text style = {{color: colors.text}}>Address</Text>
                    <TextInput 
                        style = {[styles.inputBox, {borderColor: colors.text, color: colors.text}]}
                        ref = {addressRef}
                        value = {publishingAddress}
                        onChangeText = {(text) => setPublishingAddress(text)}

                    />

                    <Text style = {{color: colors.text}}>Description</Text>
                    <TextInput 
                        style = {[styles.descriptionBox, {borderColor: colors.text, color: colors.text}]}
                        ref = {descriptionRef}
                        value = {publishingDescription}
                        onChangeText = {(text) => setPublishingDescription(text)}
                        multiline
                    />

                    <Text style = {{color: colors.text}}>Business Website Info</Text>
                    <TextInput
                        style = {[styles.inputBox, {borderColor: colors.text, color: colors.text}]} 
                        ref = {businessWebsiteRef}
                        value = {publishingBusinessWebsite}
                        onChangeText = {(text) => setPublishingBusinessWebsite(text)}
                    />

                    <Text style = {{color: colors.text}}>Facebook Info</Text>
                    <TextInput
                        style = {[styles.inputBox, {borderColor: colors.text, color: colors.text}]} 
                        ref = {businessFacebookRef}
                        value = {publishingBusinessFacebookInfo}
                        onChangeText = {(text) => setPublishingBusinessFacebookInfo(text)}
                    />

                    <Text style = {{color: colors.text}}>Instagram Info</Text>
                    <TextInput
                        style = {[styles.inputBox, {borderColor: colors.text, color: colors.text}]} 
                        ref = {businessInstagramRef}
                        value = {publishingBusinessInstagramInfo}
                        onChangeText = {(text) => setPublishingBusinessInstagramInfo(text)}
                    />

                    <Text style = {{color: colors.text}}>Yelp Info</Text>
                    <TextInput
                        style = {[styles.inputBox, {borderColor: colors.text, color: colors.text}]} 
                        ref = {businessYelpRef}
                        value = {publishingBusinessYelpInfo}
                        onChangeText = {(text) => setPublishingBusinessYelpInfo(text)}
                    />

                    <Text style = {{color: colors.text}}>Photos</Text>
                    <View style = {[styles.photoContainer, {borderColor: colors.text}]}>
                        <FlatList
                            horizontal
                            alwaysBounceHorizontal
                            data = {publishingImages}
                            keyExtractor = {(item) => item}
                            contentContainerStyle = {styles.photosArray}
                            renderItem = {({item, index}) => {
                                console.log(item);
                                return (
                                    <TouchableOpacity 
                                        style = {styles.photoView}
                                        onPress = {() => handleImageClicked(index)}
                                    > 
                                        <Image
                                            source = {item? {uri: item} : noImageIcon} 
                                            style = {styles.photo}
                                        />
                                        {imageSelectedValue == index && 
                                            <View style = {styles.imageOverlay}>
                                                <ImageButton 
                                                    title = 'Left'
                                                />
                                                <View style = {{backgroundColor: 'yellow'}}>
                                                    <ImageButton
                                                        title = 'Remove' 
                                                    />
                                                    <ImageButton 
                                                        title = 'Cancel'
                                                        onPress = {handleCancelClicked}
                                                    />
                                                </View>
                                                <ImageButton 
                                                    title = 'Right'
                                                />
                                            </View>
                                        }
                                    </TouchableOpacity>
                                )
                            }}
                        />
                    </View>
                    
                    <Button 
                        title = "Publish"
                    />
                </ScrollView>
            </TouchableWithoutFeedback>
            <Toast />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        margin: 8,
        fontWeight: 600
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    inputBox: {
        height: 40,
        width: 290,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        margin: 8,
    },
    descriptionBox: {
        height: 200,
        width: 290,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        margin: 8,
    },
    button: {
        borderWidth: 1,
        color: 'green'
    },
    line: {
        height: 1,
        width: '100%',
        margin: 4
    },
    photosArray: {
        alignItems: 'center', 
        justifyContent: 'center', 
        initialScrollIndex: 0
    },
    photoContainer: {
        borderWidth: 1,
        height: 160,
        width: 310,
        margin: 8,
        borderRadius: 8,
        marginBottom: 10,
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3,
        flex: 1
    },
    photo: {
        width: 159, 
        height: 159, 
        margin: 1, 
        borderRadius: 8        
    },
    photoView: {
        activeOpacity: .1
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgray',
        opacity: '.6',
        flexDirection: 'row',
        flex: 1,
    }
})