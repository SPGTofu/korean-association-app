import { useTheme } from "@react-navigation/native";
import { useContext } from "react";
import { Dimensions, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import DraggableFlatList from "react-native-draggable-flatlist";
import { SubmitPageStackScreenContext } from "../contexts/SubmitPageStackScreenContext";

const screenWidth = Dimensions.get("window").width;

export default function SubmitPhotosScreen() {
    const { colors } = useTheme();
    const { businessData, setBusinessData } = useContext(SubmitPageStackScreenContext);
    
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
                renderItem = {({item, drag, isActive}) => {
                    return (
                        <Pressable onLongPress = {drag}>
                            <Image
                                source = {{uri: item.uri}}
                                style = {[styles.photo, (isActive && styles.photoActive)]}
                                resizeMode = 'cover'
                            /> 
                        </Pressable>
                    )
                }}
                onDragEnd = {({data}) => setBusinessData((prevState) => ({
                    ...prevState,
                    imageUriArray: data
                }))}
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
        marginBottom: 4
    },
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        flex: 1,
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
        width: screenWidth * .98, 
        height: 240, 
        margin: 1, 
        borderRadius: 8,
        borderWidth: 1,
    }
})