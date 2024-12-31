import { useTheme } from "@react-navigation/native";
import { Button, Dimensions, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import CopyrightText from "../other-components/CopyrightText";
import DraggableFlatList from "react-native-draggable-flatlist";
import { useContext, useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { createBusinessEditRequest } from "../dbcalls";
import { UserContext } from "../contexts/UserContext";
import { SettingStackContext } from "../contexts/SettingStackContext";
import ImageButton from "../settings-components/ImageButton";

const width = Dimensions.get("window").width;

export default function SubmitBusinessEdit({ navigation, route }) {
    // business holds name, address, and docID
    const { business } = route.params;

    const businessSelected = business ? true : false;
    const { colors } = useTheme();
    const { user } = useContext(UserContext);
    const [images, setImages] = useState([]);
    const [businessName, setBusinessName] = useState(businessSelected ? business.name : "");
    const [businessAddress, setBusinessAddress] = useState(businessSelected ? business.address : "");
    const [description, setDescription] = useState("");
    const { createToastOnSettingStack } = useContext(SettingStackContext);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleGetImages = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaType: 'photo',
            selectionLimit: 12,
            allowsMultipleSelection: true,
            quality: 0.7,
            maxHeight: 1024,
            maxwidth: 1024,
        })
        if (!result.canceled) {
            setImages(result.assets.map((result) => result.uri));
        }
    }

    // Handles submit action
    const handleSubmit = async () => {
        // check if description is empty
        if (description == "") {
            createToastOnSettingStack('error', "Must write a suggestion", 'bottom');
            return;
        }
        // Stores data into database
        // input data should hold user's edit request  and images
        const inputData = {
            description: description,
            images: images
        };
        await createBusinessEditRequest(business, inputData, user);

        // Clears current inputs
        setBusinessName("");
        setBusinessAddress("");
        setDescription("");
        setImages([]);

        // Navigates back to setting
        navigation.goBack(1);

        // Provides toast
        createToastOnSettingStack(
            "success", 
            "Submitted request. Pending Approval", 
            "bottom"
        );
    }

    // remove image when button is clicked
    const handleRemoveImage = async (uri) => {
        console.log('removing');
        setImages((prevState) => {
            return prevState.filter((item) => item != uri);
        })
    }; 

    // cancels image selection
    const handleCancelPressed = () => {
        console.log ('pressing');
        setSelectedImage(null);
    }

    return (
        <ScrollView
            contentContainerStyle = {styles.container}
        >
            <Text style = {[styles.inputHeader, {color: colors.text}]}>
                Business Name
            </Text>
            <TextInput 
                placeholder = 'Walmart'
                placeholderTextColor = 'gray'
                defaultValue = {businessSelected ? business.name : ""}
                editable = {businessSelected ? false : true}
                style = {[styles.textInput, {borderColor: colors.text, color: colors.text}]}
                onChangeText = {(text) => setBusinessName(text)}
                value = {businessName}
            />

            <Text style = {[styles.inputHeader, {color: colors.text}]}>
                Business Address
            </Text>
            <Text style = {[styles.exampleText, {color: 'gray'}]}>
                Ex. 123 E Apple Street, Springfield, MO, 65810
            </Text>
            <TextInput 
                placeholder = 'Address, City, State, ZIP Code'
                placeholderTextColor = 'gray'
                defaultValue = {businessSelected ? business.name : ""}
                editable = {businessSelected ? false : true}
                style = {[styles.textInput, {borderColor: colors.text, color: colors.text}]}
                onChangeText = {(text) => setBusinessAddress(text)}
                value = {businessAddress}
            />

            <Text style = {[styles.inputHeader, {color: colors.text}]}>
                What Should Be Edited?
            </Text>

            <TextInput 
                multiline
                placeholder = 'Provide any suggestions or edits'
                placeholderTextColor = 'gray'
                maxLength = {400}
                style = {[styles.descriptionInput, {borderColor: colors.text, color: colors.text}]}
                onChangeText = {(text) => setDescription(text)}
                value = {description}
            />

            <Button
                title = 'Add Images (Optional)'
                color = '#536493'
                onPress = {() => handleGetImages()}
            />
            { images.length > 0 &&
                <FlatList 
                    horizontal
                    data = {images}
                    style = {styles.imageWrapper}
                    contentContainerStyle = {styles.imageContainer}
                    keyExtractor = {(item) => item}
                    renderItem = {({item}) => {
                        console.log(item);
                        return (
                            <Pressable
                                onPress = {() => setSelectedImage(item)}
                                style = {styles.photoContainer}
                            >
                                <Image
                                    resizeMode = 'cover'
                                    source = {{uri: item}}
                                    style = {[
                                        styles.image,
                                        (selectedImage == item && styles.imageActive)
                                    ]}
                                />
                                { selectedImage == item &&
                                    <>
                                        <ImageButton 
                                            title = 'Remove'
                                            position = 'top'
                                            colors = {colors.text}
                                            onPress = {() => handleRemoveImage(item)}
                                        />
                                        <ImageButton 
                                            title = 'Cancel'
                                            colors = {colors.text}
                                            onPress = {() => handleCancelPressed()}
                                            position = 'bottom'
                                        />
                                    </>
                                }
                            </Pressable>
                        )
                    }}
                />
            }
            <TouchableOpacity 
                style = {styles.submitContainer}
                onPress = {() => handleSubmit()}
            >
                <Text style = {styles.submitText}>Submit</Text>
            </TouchableOpacity>
            <CopyrightText />
        </ScrollView>
    ) 
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 12
    },
    textInput: {
        borderWidth: 1,
        width: 290,
        height: 44,
        borderRadius: 8,
        margin: 4,
        fontSize: 16,
        padding: 4
    },
    inputHeader: {
        fontSize: 18,
        fontWeight: 600,
        margin: 4

    },
    descriptionInput: {
        borderWidth: 1,
        width: 290,
        height: 120,
        borderRadius: 8,
        margin: 4,
        fontSize: 16,
        padding: 4
    },
    exampleText: {
        fontSize: 14,
        fontWeight: 400,
        margin: 4,
    },
    image: {
        height: 240,
        width: width || 300,
        position: 'absolute'
    },
    imageWrapper: {
        height: 240,
        width: width || 300,
    },
    imageActive: {
        opacity: .7
    },
    photoContainer: {
        width: width * .98, 
        height: 240, 
        margin: 1, 
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitContainer: {
        backgroundColor: '#536493',
        width: 120,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 6,
        marginTop: 8
    },
    submitText: {
        fontSize: 20,
        fontWeight: 500,
        color: 'black'
    }
})