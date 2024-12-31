import { useContext, useEffect, useState } from "react";
import { Button, Dimensions, Image, Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { PendingBusinessPageContext } from "../contexts/PendingBusinessPageContext";
import { useTheme } from "@react-navigation/native";
import Line from "../other-components/Line";
import OpenButton from "./OpenButton";
import ImageButton from "./ImageButton";
import addImageIcon from "../../assets/logos/add_image_icon_transparent.png";
import * as ImagePicker from 'expo-image-picker';

const screenWidth = Dimensions.get("window").width;

export default function BusinessPage({ businessData, createToastForPage, handleNavigationToBusinessPreview}) {
    const { colors } = useTheme();
    const { 
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
        setArrayOfPhotoNames
    } = useContext(PendingBusinessPageContext);
    const [selectedImage, setSelectedImage] = useState(null);
    // used for the mappedLinks
    const businessLinks = [        
        ["Business Website: ", publishingBusinessWebsite, setPublishingBusinessWebsite],
        ["Facebook Link: ", publishingBusinessFacebookInfo, setPublishingBusinessFacebookInfo],
        ["Instagram Link: ", publishingBusinessInstagramInfo, setPublishingBusinessInstagramInfo],
        ["Yelp Link: ", publishingBusinessYelpInfo, setPublishingBusinessYelpInfo]
    ];
    
    // maps the tags to have their own text inputs
    const mappedTags = tags?.map((tag, index) => {
        return (
            <View key = {index} style = {styles.tagsWrapper}>
                <Text style = {[styles.tagText, {color: colors.text}]}>{index + 1}. </Text>
                <TextInput 
                    style = {[styles.tagInput, {color: colors.text, borderColor: colors.text}]}
                    value = {tag}
                    placeholder = 'Tag (optional)'
                    placeholderTextColor = 'gray'
                    onChangeText = {(text) => {
                        setTags((prevState) => {
                            const newTags = [...prevState];
                            newTags[index] = text;
                            return newTags;
                        })
                    }}
                />
            </View>
        )
    });

    // maps links to have their own text inputs
    const mappedLinks = businessLinks?.map((link, index) => {
        return (
            <View key = {index} style = {styles.linksWrapper}>
                <Text style = {[styles.standardText, {color: colors.text}]}>{link[0]}</Text>
                <TextInput 
                    value = {link[1]}
                    placeholder = "Place LINK here"
                    placeholderTextColor = 'gray'
                    style = {[styles.linkInput, 
                             {borderColor: colors.text},
                             {color: colors.text}
                    ]}
                    onChangeText = {(text) => {
                        link[2](text);
                    }}
                />
            </View>
        )
    }); 

    // maps each weekday's hours to its own text inputs
    const mappedHours = publishingHours?.map((day, index) => {
        return (
            <OpenButton
                key = {index}
                index = {index}
                setPublishingHours = {setPublishingHours}
                day = {day}
            />
        )
    });

    // resets all fields back to the standard
    const handleResetDefault = () => {
        setPublishingName(businessData.name);
        setPublishingPhoneNumber(businessData.phoneNumber);
        setPublishingAddress(businessData.address);
        setPublishingDescription(businessData.description);
        setPublishingBusinessWebsite(businessData.businessWebsiteInfo);
        setPublishingBusinessFacebookInfo(businessData.facebookInfo);
        setPublishingBusinessInstagramInfo(businessData.instagramInfo);
        setPublishingBusinessYelpInfo(businessData.yelpInfo);
        setPublishingHours([...businessData.hours]);
        setPublishingHoursDescription(businessData.hoursDescription);
        setTags(["","",""]);
        fetchPendingBusinessImages();
        setArrayOfPhotoNames(businessData.photos);
        createToastForPage('success', 'Reset information to default', 'bottom');
    };

    // gets images
    const handleGetImages = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({ 
                mediaType: 'photo',
                selectionLimit: 12,
                allowsMultipleSelection: true,
                maxHeight: 1024,
                maxWidth: 1024,
                quality: .7,
        });

        if (!result.canceled) {
            setPublishingImages((prevState) => (
                [...prevState, ...result.assets.map((result) => result.uri)]
            ))
        }
    }
    
    return (
        <TouchableWithoutFeedback 
            onPress = {() => Keyboard.dismiss()} 
        >
            <ScrollView contentContainerStyle = {styles.container} >
                <View style = {[styles.nameWrapper, {color: colors.text}]}>
                    <Text style = {[styles.titleText, {color: colors.text}]}>Name: </Text>
                    <TextInput 
                        style = {[styles.nameInput, {color: colors.text}]}
                        value = {publishingName}
                        onChangeText = {(text) => setPublishingName(text)}
                    />
                </View>

                <DraggableFlatList
                    horizontal
                    containerStyle = {styles.imageContainer}
                    data = {[...publishingImages, addImageIcon]}
                    keyExtractor = {(item) => item}
                    renderItem = {({item, drag, isActive, getIndex}) => {
                        const index = getIndex();
                        const isAddIcon = index == publishingImages.length;
                        return (
                            <Pressable 
                                onPress = {() => {
                                    if (isAddIcon) {
                                        handleGetImages();
                                    } else {
                                        setSelectedImage(item);
                                    }
                                }}
                                onLongPress = {isAddIcon? null : drag}
                                style = {styles.imageWrapper}
                            >
                                <Image
                                    source = { isAddIcon ? item : {uri: item}}
                                    resizeMode = {isAddIcon ? 'contain' : 'cover'}
                                    style = {[styles.image, ((isActive || selectedImage == item) && styles.imageActive)]}
                                />
                                {(selectedImage == item && !isAddIcon) &&
                                    <>
                                        <ImageButton 
                                            title = 'Remove'
                                            position = 'top'
                                            colors = {colors.text}
                                            onPress = {() => {
                                                setPublishingImages((prevState) =>
                                                    prevState.filter((image) => image != item)
                                                )
                                            }}
                                        />
                                        <ImageButton
                                            title = 'Cancel'
                                            position = 'bottom'
                                            colors = {colors.text}
                                            onPress = {() => setSelectedImage(null)}
                                        />
                                    </> 
                                }
                            </Pressable>
                        )
                    }}
                    onDragEnd = {({data}) => setPublishingImages(data)}
                />
                <Text style = {[styles.text, {color: colors.text}]}>
                    Drag images to change order
                </Text>
                <Line />
                
                <View style = {{alignItems: 'center'}}>
                    <Text style = {[styles.title, {color: colors.text}]}>
                        Tags (max 3)
                    </Text>
                    {mappedTags}
                </View>
                <Line />

                <View style = {{alignItems: 'center'}}>
                    <Text style = {[styles.title, {color: colors.text}]}>
                        Media (MUST BE WORKING LINKS)
                    </Text>
                </View>
                {mappedLinks}
                <Line />

                <View style = {styles.standardWrapper}>
                    <Text style = {[styles.title, {color: colors.text}]}>Description</Text>
                    <TextInput 
                        style = {[
                            styles.descriptionInput, 
                            {borderColor: colors.text, color: colors.text}     
                        ]}
                        value =  {publishingDescription}
                        multiline
                        placeholder = 'Write description'
                        placeholderTextColor = 'gray'
                        onChangeText = {(text) => setPublishingDescription(text)}
                    />
                </View>
                <Line />

                <View style = {styles.hoursContainer}>
                    <Text style = {[styles.title, {color: colors.text}]}>Hours</Text>
                    {mappedHours}
                    <Text style = {[styles.title, {color: colors.text}]}>
                        Additional Hours Description
                    </Text>
                    <TextInput 
                        style = {[
                            styles.descriptionInput, 
                            {borderColor: colors.text, color: colors.text}     
                        ]}
                        value =  {publishingHoursDescription}
                        multiline
                        placeholder = 'Write description'
                        placeholderTextColor = 'gray'
                        onChangeText = {(text) => 
                            setPublishingHoursDescription(text)
                        }
                    />
                </View>
                <Line />

                <View style = {styles.standardWrapper}>
                    <Text style = {[styles.title, {color: colors.text}]}>Address</Text>
                    <TextInput
                        style = {[styles.addressInput, {color: colors.text, borderColor: colors.text}]}
                        value = {publishingAddress}
                        onChangeText = {(text) => setPublishingAddress(text)}
                    />
                </View>
                <Line />

                <View style = {styles.standardWrapper}>
                    <Text style = {[styles.title, {color: colors.text}]}>Publisher Information</Text>

                    <View style = {styles.publisherBlocks}>
                        <Text style = {[styles.standardText, {color: colors.text}]}>Owner </Text>
                        <TextInput 
                            style = {[styles.publisherInput, {color: colors.text, borderColor: colors.text}]}
                            editable = {false}
                            value = {owner.userName || 'Unclaimed'}
                        />
                    </View>
                    <View style = {styles.publisherBlocks}>
                        <Text style = {[styles.standardText, {color: colors.text}]}>Phone Number (Business)</Text>
                        <TextInput 
                            style = {[styles.publisherInput, {color: colors.text, borderColor: colors.text}]}
                            value = {publishingPhoneNumber}
                            onChangeText={(text) => setPublishingPhoneNumber(text)}
                        />
                    </View>
                    <Line />

                    <TouchableOpacity
                        onPress = {() => handleResetDefault()}
                        style = {styles.button}

                    >
                        <Text style = {styles.buttonText}>Reset to Default</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress = {() => handleNavigationToBusinessPreview()}
                        style = {styles.button}
                    >
                        <Text style = {styles.buttonText}>Preview</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    buttonText: {
        fontSize: 16,
        fontWeight: 400,
        color: 'blue'
    },
    button: {
        margin: 4,
        padding: 4,
        height: 40,
        width: 200,
        justifyContent: 'center',
        alignItems: 'center'
    },
    publisherBlocks: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4
    },
    publisherInput: {
        borderWidth: 1,
        borderRadius: 6,
        fontSize: 16,
        padding: 4,
        width: 180
    },
    addressInput: {
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 6,
        padding: 4,
        width: '80%',
        margin: 4,
        marginBottom: 8
    },
    hoursContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    descriptionInput: {
        borderWidth: 1,
        borderRadius: 6,
        padding: 4,
        fontSize: 16,
        height: '160',
        width: screenWidth * .96
    },
    standardWrapper: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    linksWrapper: {
        flexDirection: 'column',
        marginHorizontal: 4,
    },
    standardText: {
        fontSize: 18,
        fontWeight: 500,
        marginVertical: 2
    },
    title: {
        fontWeight: 600,
        margin: 4,
        fontSize: 20   
    },
    linkInput: {
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 6,
        height: 28,
        padding: 4
    },
    titleText: {
        fontSize: 28,
        fontWeight: 500  
    },
    tagsWrapper: {
        flexDirection: 'row',
        marginHorizontal: 4,
        marginVertical: 2,
        alignItems: 'center',
    },
    tagText: {
        fontSize: 18,
        fontWeight: 500,
        width: '16',
    },
    tagInput: {
        fontSize: 16,
        height: 28,
        padding: 4,
        margin: 1,
        width: '40%',
        borderWidth: 1,
        borderRadius: 6
    },
    nameWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
    },
    container: {
        width: '100%'
    },
    nameInput: {
        justifyContent: "center",
        alignItems: "center",
        fontSize: 28,
        fontWeight: 500,
        paddingTop: 4
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '200',
    },
    imageActive: {
        opacity: .7
    },
    imageWrapper: {
        width: screenWidth * .7,
        height: 200,
        margin: 1
    },
    text: {
        margin: 4,
        fontSize: 16
    },
})