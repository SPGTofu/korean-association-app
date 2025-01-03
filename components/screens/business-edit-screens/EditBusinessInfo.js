import { Button, Dimensions, Image, Keyboard, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { getPublishedBusinessByID, removeBusinessEditRequestByID } from "../../dbcalls";
import { useContext, useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { getPublishedImageFromStorage } from "../../storagecalls";
import { handleCreateToast } from "../../settings-components/Toast";
import Toast from "react-native-toast-message";
import * as ImagePicker from 'expo-image-picker';
import DraggableFlatList from "react-native-draggable-flatlist";
import ImageButton from "../../settings-components/ImageButton";
import Line from "../../other-components/Line";
import { EditBusinessStackContext } from "../../contexts/EditBusinessStackContext";
import OpenButtonBusinessEdit from "../../settings-components/OpenButtonBusinessEdit";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { SettingStackContext } from "../../contexts/SettingStackContext";
import DropDownPicker from "react-native-dropdown-picker";

const screenWidth = Dimensions.get("window").width;

export default function EditBusinessInfo({ navigation, route}) {
    const [modalVisible, setModalVisible] = useState(false);
    const { createToastOnSettingStack } = useContext(SettingStackContext);
    const { images, businessID, publisher, requestID } = route.params;
    const [defaultValues, setDefaultValues] = useState({});
    const { colors } = useTheme();
    const [selectedImage, setSelectedImage] = useState("");
    const {setEditedBusinessData} = useContext(EditBusinessStackContext);
    const [businessData, setBusinessData] = useState({
        name: "",
        address: "",
        businessWebsite: "",
        description: "",
        facebook: "",
        instagram: "",
        hours: [],
        number: "",
        photos: [],
        publisher: {userName: "", email: ""},
        tags: [],
        yelp: "",
        type: ""
    });
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


    // fetches busienssData
    const fetchBusinessData = async () => {
        const business = await getPublishedBusinessByID(businessID);
        // create array of the business's images
        const arrayOfImages = [];
        for (const image of business.photos) {
            const url = await getPublishedImageFromStorage(businessID, image);
            arrayOfImages.push(url);
        }

        if (business != null) {
            const value = {
                requestID: requestID,
                docID: business.docID || "",
                name: business.name || "",
                address: business.address || "",
                businessWebsite: business.businessWebsiteInfo || "",
                description: business.description || "",
                facebook: business.facebookInfo || "",
                instagram: business.instagramInfo || "",
                hours: business.hours || [],
                number: business.phoneNumber || "",
                photos: [...arrayOfImages, ...images] || [],
                publisher: business.publisher || {userName: "", email: ""},
                tags: business.tags || ["","",""],
                yelp: business.yelp || "",
                type: business.type || ""
            };
            setBusinessData(value);
            setDefaultValues(value);
        } else {
            console.error('business not found');
        }
    }

    // fetches on open
    useEffect(() => {
        fetchBusinessData();
    }, [])

    // setup for tags component
    const mappedTags = businessData.tags?.map((tag, index) => {
        return (
            <View key = {index} style = {styles.tagsWrapper}>
                <Text style = {[styles.tagText, {color: colors.text}]}>{index + 1}. </Text>
                <TextInput 
                    style = {[styles.tagInput, {color: colors.text, borderColor: colors.text}]}
                    value = {tag}
                    placeholder = 'Tag (optional)'
                    placeholderTextColor = 'gray'
                    onChangeText = {(text) => {
                        setBusinessData((prevState) => {
                            const newTags = [...prevState.tags];
                            newTags[index] = text;
                            return ({
                                ...prevState,
                                tags: newTags
                            })
                        })
                    }}
                />
            </View>
        )
    });

    // used for the mappedLinks
    const setLink = (text, linkType) => {
        setBusinessData((prevState) => {
            return ({
                ...prevState,
                [linkType]: text
            })
        })
    };

    const businessLinks = [        
        ["Business Website: ", businessData.businessWebsite, "businessWebsite"],
        ["Facebook Link: ", businessData.facebook, "facebook"],
        ["Instagram Link: ", businessData.instagram, "instagram"],
        ["Yelp Link: ", businessData.yelp, "yelp"]
    ];

    // maps links to have their own text inputs
    const mappedLinks = businessLinks?.map((link, index) => {
        return (
            <View key = {index} style = {styles.linksWrapper}>
                <Text style = {[styles.standardText, {color: colors.text}]}>{link[0]}</Text>
                <TextInput 
                    value = {link[1]}
                    placeholder = "Place LINK here"
                    placeholderTextColor = 'gray'
                    style = {[
                        styles.linkInput, 
                        {borderColor: colors.text},
                        {color: colors.text}
                    ]}
                    onChangeText = {(text) => {
                        setLink(text, link[2]);
                    }}
                />
            </View>
        )
    }); 

    // change publishing hours
    const setBusinessHours = (index, updatingField, data) => {
        setBusinessData((prevState) => {
            const newHours = [...prevState.hours];
            newHours[index] = {...newHours[index],[updatingField]: data};
            
            return ({
                ...prevState,
                hours: newHours

            })
        })
    }

    // maps each weekday's hours to its own text inputs
    const mappedHours = businessData.hours.map((day, index) => {
        return (
            <OpenButtonBusinessEdit
                key = {index}
                index = {index}
                setPublishingHours = {setBusinessHours}
                day = {day}
            />
        )
    });


    // action for when reset to default button is pressed
    const handleResetDefault = () => {
        setBusinessData(defaultValues);
        handleCreateToast('success', 'Reset information to default', 'bottom');
    }

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
            setBusinessData((prevState) => ({
                ...prevState,
                photos: Array.from(
                    new Set([...prevState.photos, ...result.assets.map((result) => result.uri)])
                )
            }))
        }
    }
    
    // general function to set a field in businessData with input
    const setFieldInBusinessData = (field, data) => {
        setBusinessData((prevState) => ({
            ...prevState,
            [field]: data
        }));
    }

    const handlePreviewButtonPressed = async () => {
        setEditedBusinessData(businessData);
        navigation.navigate('PreviewEditedBusinessPage');
    }

    // Handles reject when button is pressed
    const handleReject = async () => {
        setModalVisible(false);
        await removeBusinessEditRequestByID(businessData.requestID);
        navigation.navigate("SettingsScreen");
        createToastOnSettingStack('success', 'Rejected business edits', 'bottom');
    }

    return (
        <TouchableWithoutFeedback onPress = {() => Keyboard.dismiss()}>
            <ScrollView style = {styles.container}>
                <View style = {styles.nameWrapper}>
                    <Text style = {[styles.titleText, {color: colors.text}]}>
                        Name:
                    </Text>
                    <TextInput 
                        style = {[styles.nameInput, {color: colors.text}]}
                        value = {businessData.name}
                        onChangeText = {
                            (text) => setFieldInBusinessData("name", text)
                        }
                    />
                </View>
                
                <DraggableFlatList 
                    horizontal
                    containerStyle = {styles.imageContainer}
                    data = {businessData.photos || null} 
                    keyExtractor = {(item) => item}
                    renderItem = {({ item, drag, isActive }) => {
                        return (
                            <Pressable
                                onPress = {() => {setSelectedImage(item);}}
                                onLongPress = {drag}
                                style = {styles.imageWrapper}
                            >
                                <Image 
                                    source = {{uri: item}}
                                    resizeMode = "cover"
                                    style = {[
                                        styles.image, 
                                        ((isActive || selectedImage == item) && styles.imageActive)
                                    ]}
                                />
                                {(selectedImage == item) &&
                                    <>
                                        <ImageButton 
                                            title = 'Remove'
                                            position = 'top'
                                            colors = {colors.text}
                                            onPress = {() => {
                                                setBusinessData((prevState) => ({
                                                    ...prevState,
                                                    photos: prevState.filter((image) => image != item)
                                                }))
                                            }}
                                        />
                                        <ImageButton 
                                            title = 'Cancel'
                                            colors = {colors.text}
                                            position = 'bottom'
                                            onPress = {() => setSelectedImage(null)}
                                        />
                                    </>
                                }
                            </Pressable>
                        )
                    }}
                    onDragEnd = {({ data }) => 
                        setBusinessData((prevState) => ({ 
                            ...prevState, 
                            photos: data
                        }))
                    }
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
                        value =  {businessData.description}
                        multiline
                        placeholder = 'Write description'
                        placeholderTextColor = 'gray'
                        onChangeText = {(text) => setFieldInBusinessData('description', text)}
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
                            value = {businessData.type}
                            setValue = {(callback) => {
                                const value = callback();
                                setFieldInBusinessData('type', value);
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
                    {mappedHours}
                </View>
                <Line />

                <View style = {styles.standardWrapper}>
                    <Text style = {[styles.title, {color: colors.text}]}>Address</Text>
                    <TextInput
                        style = {[styles.addressInput, {color: colors.text, borderColor: colors.text}]}
                        value = {businessData.address}
                        onChangeText = {(text) => setFieldInBusinessData('address', text)}
                    />
                </View>
                <Line />

                <View style = {styles.standardWrapper}>
                    <Text style = {[styles.title, {color: colors.text}]}>Publisher Information</Text>

                    <View style = {[styles.publisherBlocks, {width: '56%'}]}>
                        <BouncyCheckbox 
                            isChecked = {businessData.publisher.userName != ""}
                            text = "Submitter is the owner"
                            unFillColor = 'transparent'
                            fillColor = '#EF5A6F'
                            textStyle = {{color: colors.text, textDecorationLine: 'none'}}
                            onPress = {() => {
                                const newPublisher = businessData.publisher.userName == "" 
                                    ? publisher 
                                    : {userName: "", email: ""}
                                setBusinessData((prevState) => ({
                                    ...prevState,
                                    publisher: newPublisher
                                }))
                            }}
                        />
                    </View>
                    <View style = {styles.publisherBlocks}>
                        <Text style = {[styles.standardText, {color: colors.text}]}>Phone Number (Business)</Text>
                        <TextInput 
                            style = {[styles.publisherInput, {color: colors.text, borderColor: colors.text}]}
                            value = {businessData.number}
                            onChangeText={(text) => setFieldInBusinessData('number', text)}
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
                        onPress = {() => handlePreviewButtonPressed()}
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
                                Would you like to delete the business edit request?
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
                <Toast />
            </ScrollView>
        </TouchableWithoutFeedback>
    );
};


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
    publisherInput: {
        borderWidth: 1,
        borderRadius: 6,
        fontSize: 16,
        padding: 4,
        width: 180
    },
    publisherBlocks: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4
    },
    tagsWrapper: {
        flexDirection: 'row',
        marginHorizontal: 4,
        marginVertical: 2,
        alignItems: 'center',
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
    text: {
        margin: 4,
        fontSize: 16
    },
    tagText: {
        fontSize: 18,
        fontWeight: 500,
        width: '16',
    },
    imageActive: {
        opacity: .7
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
    linksWrapper: {
        flexDirection: 'column',
        marginHorizontal: 4,
    },
    standardText: {
        fontSize: 18,
        fontWeight: 500,
        marginVertical: 2
    },
    linkInput: {
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 6,
        height: 28,
        padding: 4
    },
    nameWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
    },
    nameInput: {
        justifyContent: "center",
        alignItems: "center",
        fontSize: 28,
        fontWeight: 500,
        paddingTop: 4,
        margin: 6
    },
    titleText: {
        fontSize: 28,
        fontWeight: 500  
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '200',
    },
    imageWrapper: {
        width: screenWidth * .7,
        height: 200,
        margin: 1
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    imageWrapper: {
        width: screenWidth * .7,
        height: 200,
        margin: 1
    },
    title: {
        fontWeight: 600,
        margin: 4,
        fontSize: 20   
    },
})