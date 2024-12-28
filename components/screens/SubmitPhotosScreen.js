import { useTheme } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import DraggableFlatList from "react-native-draggable-flatlist";
import { SubmitPageStackScreenContext } from "../contexts/SubmitPageStackScreenContext";
import ImageButton from "../settings-components/ImageButton";

const screenWidth = Dimensions.get("window").width;

export default function SubmitPhotosScreen() {
    const { colors } = useTheme();
    const { businessData, setBusinessData } = useContext(SubmitPageStackScreenContext);
    const [selectedImage, setSelectedImage] = useState(-1);

    // gets images
    const handleGetImages = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({ 
                mediaType: 'photo',
                selectionLimit: 12,
                allowsMultipleSelection: true,
                quality: 0.8,
                maxHeight: 1024,
                maxWidth: 1024,
                quality: .7,
        });

        if (!result.canceled) {
            setBusinessData((prevState) => ({
                ...prevState,
                imageUriArray: result.assets
            }));
        }
    }
    
    // remove image when button is clicked
    const handleRemoveImage = async (uri) => {
        console.log('removing');
        setBusinessData((prevState) => ({
            ...prevState,
            imageUriArray: prevState.imageUriArray.filter((item) => item.uri != uri)
        }))
    };

    // cancels image selection
    const handleCancelPressed = () => {
        console.log ('pressing');
        setSelectedImage(null);
    }

    // selects current image
    const handleImagePressed = (uri) => {
        setSelectedImage(uri);
    }
    

    return (
        <View style = {styles.container}>
            <TouchableOpacity
                    style = {[styles.photoButton, {color: colors.text, borderColor: colors.text}]}
                    onPress = {handleGetImages}
            >
                <Text style = {[styles.header, {color: colors.text}]}>Select Photos</Text>
            </TouchableOpacity>
            
            <Text style = {[styles.text, {color: colors.text}]}>
                Limit of 12 photos. Must submit at least 1.
            </Text>
            
            <DraggableFlatList 
                vertical
                data = {businessData.imageUriArray}
                keyExtractor = {(item) => item.uri}
                contentContainerStyle = {styles.photosArray}
                renderItem = {({item, drag, isActive, index}) => {
                    return (
                        <Pressable
                            onPress = {() => handleImagePressed(item.uri)}
                            onLongPress = {drag}
                            style = {styles.photoContainer}
                        >
                            <Image
                                source = {{uri: item.uri}}
                                style = {
                                    [styles.photo, 
                                    ((isActive || selectedImage == item.uri) && styles.photoActive)
                                ]}
                                resizeMode = 'cover'
                            /> 
                            {selectedImage == item.uri && 
                                <>
                                    <ImageButton 
                                        title = 'Remove'
                                        position = 'top'
                                        onPress = {() => handleRemoveImage(item.uri)}
                                    />
                                    <ImageButton 
                                        title = 'Cancel'
                                        onPress = {() => handleCancelPressed()}
                                        position = 'bottom'
                                    />
                                </>
                            }
                        </Pressable>
                    )
                }}
                onDragEnd = {({data}) => {
                    setBusinessData((prevState) => ({
                    ...prevState,
                    imageUriArray: [...data]
                }))}}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        margin: 8,
        fontWeight: '500'
    },
    text: {
        fontSize: 14,
        marginBottom: 8
    },
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '84%'
    },
    photoButton: {
        padding: 4,
        borderWidth: 1,
        borderRadius: 10,
        margin: 8,
        marginBottom: 3,
        height: 50,
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    photosArray: {
        alignItems: 'center', 
        justifyContent: 'center',
        initialScrollIndex: 0,
    },
    photoActive: {
        opacity: .8,
        shadowOpacity: .1,
        shadowOffset: 1
    },
    photo: {
        width: '100%', 
        height: '100%', 
        borderRadius: 8,
        borderWidth: 1,
        position: 'absolute'
    },
    photoContainer: {
        width: screenWidth * .98, 
        height: 240, 
        margin: 1, 
    }
})