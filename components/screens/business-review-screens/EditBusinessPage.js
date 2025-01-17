import { useContext, useEffect, useState } from "react";
import { Button, Dimensions, Image, Keyboard, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { PendingBusinessPageContext } from "../../contexts/PendingBusinessPageContext";
import { useTheme } from "@react-navigation/native";
import Line from "../../other-components/Line";
import OpenButton from "../../settings-components/OpenButton";
import ImageButton from "../../settings-components/ImageButton";
import * as ImagePicker from 'expo-image-picker';
import { removeBusinessRequestByID } from "../../dbcalls";
import { SettingStackContext } from "../../contexts/SettingStackContext";
import DropDownPicker from "react-native-dropdown-picker";

const screenWidth = Dimensions.get("window").width;

export default function BusinessPage({ businessData, createToastForPage, handleNavigationToBusinessPreview, navigation}) {
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
        setArrayOfPhotoNames,
        type, setType
    } = useContext(PendingBusinessPageContext);
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const { createToastOnSettingStack } = useContext(SettingStackContext);
    const [dropDownOpen, setDropDownOpen] = useState(false);
    const [dropDownItems, setDropDownItems] = useState([
        { label: 'Clinic', value: 'Clinic' },
        { label: 'Eatery', value: 'Eatery'},
        { label: 'Market', value: 'Market'},
        { label: 'Real Estate', value: 'Real Estate'},
        { label: 'Finance', value: 'Finance'},
        { label: 'Religious Institution', value: 'Religious Institution'},
        { label: 'Salon', value: 'Salon'},
        { label: 'Service', value: 'Service'},
        { label: 'Other', value: 'Other'},
    ]);

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
        setType(businessData.type)
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
            const newlySelectedImages = result.assets.map((result) => result.uri);
            const updatedPublished = [
                ...publishingImages.filter((image) => !newlySelectedImages.includes(image)),
                ...newlySelectedImages
            ]
            console.log(updatedPublished);
            setPublishingImages(updatedPublished);
        }
    }
    
    // Handles reject when button is pressed
    const handleReject = async () => {
        setModalVisible(false);
        await removeBusinessRequestByID(businessData.docID);
        navigation.navigate("SettingsScreen");
        createToastOnSettingStack('success', 'Rejected new business', 'bottom');
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
                    data = {publishingImages}
                    keyExtractor = {(item) => item}
                    renderItem = {({item, drag, isActive, getIndex}) => {
                        const index = getIndex();
                        return (
                            <Pressable 
                                onPress = {() => {setSelectedImage(item)}}
                                onLongPress = {drag}
                                style = {styles.imageWrapper}
                            >
                                <Image
                                    source = {{uri: item}}
                                    resizeMode = {'cover'}
                                    style = {[styles.image, ((isActive || selectedImage == item) && styles.imageActive)]}
                                />
                                {(selectedImage == item) &&
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
                <Button 
                    title = 'Add Image'
                    onPress = {() => handleGetImages()}
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
                        Media
                    </Text>
                    <Text style = {{color: colors.text, fontSize: 16}}>
                        (Make Sure Links Work)
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

                <View style = {styles.standardWrapper}>
                    <Text style = {[styles.title, {color: colors.text}]}>Business Type</Text>
                    <DropDownPicker
                            open = {dropDownOpen}
                            listMode = 'SCROLLVIEW'
                            setOpen = {setDropDownOpen}
                            items = {dropDownItems}
                            multiple = {false}
                            value = {type}
                            setValue = {(callback) => {
                                const value = callback();
                                setType(value);
                            }}
                            style = {{ width: '80%', margin: 8, backgroundColor: '#f4f4f4'}}
                            contentContainerStyle = {{justifyContent: 'center', alignItems: 'center'}}
                            dropDownContainerStyle = {{backgroundColor: '#f4f4f4', width: '82%'}}
                            labelStyle = {{color: colors.text}}
                        />
                </View>
                <Line />

                <View style = {styles.hoursContainer}>
                    <Text style = {[styles.title, {color: colors.text}]}>Hours</Text>
                    <Text style = {{color: colors.text, fontSize: 14}}>
                        Have a ',' and a space between each period
                    </Text>

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
                        onPress = {() => setModalVisible(true)}
                        style = {styles.button}

                    >
                        <Text style = {styles.buttonText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress = {() => handleNavigationToBusinessPreview()}
                        style = {styles.button}
                    >
                        <Text style = {styles.buttonText}>Preview</Text>
                    </TouchableOpacity>
                </View>

                <Modal
                    animationType = 'fade'
                    transparent = {true}
                    visible = {modalVisible}
                    onRequestClose = {() => setModalVisible(false)}
                >
                    <View style = {styles.modalWrapper}>
                        <View style = {styles.modalView}>
                            <Text style = {styles.modalText}>
                                Would you like to delete the new business?
                            </Text>
                            <Button 
                                title = 'Cancel'
                                onPress = {() => setModalVisible(false)}
                            />
                            <Button 
                                title = 'Confirm'
                                onPress = {() => handleReject()}
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    modalText: {
        margin: 4,
        fontSize: 18,
        padding: 4,
        textAlign: 'center'
    },
    modalWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    modalView: {
        margin: 10,
        backgroundColor: 'white',
        height: 200,
        width: 220,
        borderRadius: 8,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
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
        alignItems: 'left',
        height: '200',
    },
    imageActive: {
        opacity: .7
    },
    imageWrapper: {
        width: screenWidth * .7,
        height: 200,
        margin: 1,
    },
    text: {
        margin: 4,
        fontSize: 16
    },
})