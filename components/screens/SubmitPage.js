import { useTheme } from "@react-navigation/native";
import { UserContext } from "../contexts/UserContext";
import { useContext, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Image, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { handleCreateToast } from "../settings-components/Toast";
import Toast from "react-native-toast-message";
import { createBusinessRequest } from "../dbcalls";
import * as ImagePicker from 'expo-image-picker';

export default function SubmitPage({ navigation }) {
    const [businessName, setBusinessName] = useState('');
    const [businessDescription, setBusinessDescription] = useState('');
    const [businessPhoneNumber, setBusinessPhoneNumber] = useState('');
    const [businessAddress, setBusinessAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageUriArray, setImageUriArray] = useState([]);
    const nameRef = useRef(null);
    const addressRef = useRef(null);
    const descriptionRef = useRef(null);
    const numberRef = useRef(null);
    const { user } = useContext(UserContext);
    const { colors } = useTheme();

    // handles submit when button is pressed
    const handleSubmitPage = () => {
        Keyboard.dismiss();
        setLoading(true);
        if (businessName == '') {
            handleCreateToast('error', 'Please enter the business name', 'bottom');
            setLoading(false);
            return;
        }
        if (businessPhoneNumber == '') {
            handleCreateToast('error', 'Please enter the business number', 'bottom');
            setLoading(false);
            return;
        }
        if (businessAddress == '') {
            handleCreateToast('error', 'Please enter the business address', 'bottom');
            setLoading(false);
            return;
        }
        if (businessDescription == '') {
            handleCreateToast('error', 'Please enter the business description', 'bottom');
            setLoading(false);
            return;
        }
        try {
            createBusinessRequest(businessName, businessDescription, 
                                  businessPhoneNumber, businessAddress, imageUriArray);
            handleCreateToast('success', 'Reuqest sent. Pending approval', 'bottom');
            nameRef.current.clear();
            addressRef.current.clear();
            numberRef.current.clear();
            descriptionRef.current.clear();    
            setImageUriArray([]); 
            setLoading(false);
            return;                               
        }
        catch (e) {
            console.log(e);
            handleCreateToast('error', 'Error creating request. Try again', 'bottom');
            setLoading(false);
            return;
        }
    };

    const handleGetImages = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({ 
                mediaType: 'photo',
                selectionLimit: 12,
                allowsMultipleSelection: true,
                includeBase64: false,
                maxHeight: 300,
                maxWidth: 300,
                quality: 1
        });

        if (!result.canceled) {
            setImageUriArray(result.assets);
        }
    }

    return (
        <TouchableWithoutFeedback onPress = {() => Keyboard.dismiss()}>
            <ScrollView
                contentContainerStyle = {styles.container}
            >
                <Text style = {[styles.header, {color: colors.text}]}>Provide Business Details</Text>
                <TextInput
                    style = {[styles.inputBox, {borderColor: colors.text, color: colors.text}]}
                    placeholder = 'Business Name'
                    placeholderTextColor = {colors.text}
                    onChangeText = {(text) => setBusinessName(text)}
                    ref = {nameRef}
                />

                <TextInput
                    style = {[styles.inputBox, {borderColor: colors.text, color: colors.text}]}
                    placeholder = 'Business Phone Number'
                    placeholderTextColor = {colors.text}
                    onChangeText = {(text) => setBusinessPhoneNumber(text)}
                    ref = {numberRef}
                />
                <TextInput
                    style = {[styles.inputBox, {borderColor: colors.text, color: colors.text}]}
                    placeholder = 'Business Address'
                    placeholderTextColor = {colors.text}
                    onChangeText = {(text) => setBusinessAddress(text)}
                    ref = {addressRef}
                />
                <TextInput
                    style = {[styles.descriptionBox, {borderColor: colors.text, color: colors.text}]}
                    placeholder = 'Business Description'
                    placeholderTextColor = {colors.text}
                    onChangeText = {(text) => setBusinessDescription(text)}
                    multiline
                    numberOfLines = {5}
                    maxLength = {160}
                    ref = {descriptionRef}
                />

                <TouchableOpacity 
                    style = {[styles.photoButton, {color: colors.text, borderColor: colors.text}]}
                    onPress = {() => handleGetImages()}
                >
                    <Text style = {{color: colors.text}}>Select Photos</Text>
                </TouchableOpacity>
                <Text style = {{fontSize: 11, marginBottom: 4, color: colors.text}}>Limit of 12 photos</Text>
                <View style = {[styles.photoContainer, {borderColor: colors.text}]}>
                    <FlatList 
                        horizontal = {true}
                        alwaysBounceHorizontal
                        data = {imageUriArray}
                        keyExtractor = {(item) => item.uri}
                        contentContainerStyle = {{alignItems: 'center', justifyContent: 'center', flex: 1 }}
                        renderItem = {({item}) => {
                            return (
                                <Image 
                                    source = {{ uri: item.uri}}
                                    style = {{ width: 158, 
                                               height: 158, 
                                               margin: 1, 
                                               borderRadius: 8
                                            }}
                                /> 
                            )
                        }}
                    />
                </View>
                
                <TouchableOpacity 
                    style = {[styles.submitButton, {color: colors.text, borderColor: colors.text}]}
                    onPress = {() => handleSubmitPage()}
                >
                    <Text style = {{color: colors.text}}>Submit</Text>
                </TouchableOpacity>
                { loading && <ActivityIndicator size = 'small' color = {colors.text} /> }
                <Toast />
            </ScrollView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        margin: 8
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    inputBox: {
        height: 50,
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
    submitButton: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        margin: 8,
        height: 50,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoButton: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        margin: 8,
        marginBottom: 3,
        height: 50,
        width: 180,
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoContainer: {
        borderWidth: 1,
        height: 160,
        width: 310,
        borderRadius: 8,
        marginBottom: 10,
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3,
    }
})