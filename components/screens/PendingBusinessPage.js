import { useTheme } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Button, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { handleCreateToast } from "../settings-components/Toast";
import Toast from "react-native-toast-message";

export default function PendingBusinessPage({ route }) {
    const { businessData } = route.params;
    const [publishingName, setPublishingName] = useState(businessData.name);
    const [publishingPhoneNumber, setPublishingPhoneNumber] = useState(businessData.phoneNumber);
    const [publishingAddress, setPublishingAddress] = useState(businessData.address);
    const [publishingDescription, setPublishingDescription] = useState(businessData.Description);
    const { colors } = useTheme();
    const nameRef = useRef(null);
    const addressRef = useRef(null);
    const descriptionRef = useRef(null);
    const numberRef = useRef(null);

    // ADD WHEN PHOTOS INCORPORATED
    // ESTABLISH PUBLISH WHEN INCORPARTED PHOTOS


    const [publishingImages, setPublishingImages] = useState();
    // useEffect(() => {
    //     console.log(businessData);
    // }, [businessData]);


    const handleResetDefault = () => {
        setPublishingName(businessData.name);
        setPublishingPhoneNumber(businessData.phoneNumber);
        setPublishingAddress(businessData.address);
        setPublishingDescription(businessData.description);
        handleCreateToast('success', 'Reset information to default', 'bottom');
    }
    
    return (
        <TouchableWithoutFeedback onPress = {() => Keyboard.dismiss()}>
            <ScrollView
                contentContainerStyle = {styles.container}
            >
                <Text style = {[styles.header, {color: colors.text}]}>
                    Review Business Information
                </Text>
                <Text style = {{color: colors.text, fontSize: 16}}>
                    Publisher: {businessData.publisher}
                </Text>
                <View style = {styles.line}/>

                <Button 
                    title = "Reset to Default"
                    color = '#19b0b5'
                    onPress = {() => handleResetDefault()}
                />

                <Text>Name</Text>
                <TextInput
                    style = {[styles.inputBox, {borderColor: colors.text, color: colors.text}]}
                    ref = {nameRef}
                    value = {publishingName}
                    onChangeText = {(text) => setPublishingName(text)}
                />

                <Text>Phone Number</Text>
                <TextInput
                    style = {[styles.inputBox, {borderColor: colors.text, color: colors.text}]}
                    value = {publishingPhoneNumber}
                    ref = {numberRef}
                    onChangeText = {(text) => setPublishingPhoneNumber(text)}

                />

                <Text>Address</Text>
                <TextInput 
                    style = {[styles.inputBox, {borderColor: colors.text, color: colors.text}]}
                    ref = {addressRef}
                    value = {publishingAddress}
                    onChangeText = {(text) => setPublishingAddress(text)}

                />

                <Text>Description</Text>
                <TextInput 
                    style = {[styles.descriptionBox, {borderColor: colors.text, color: colors.text}]}
                    ref = {descriptionRef}
                    value = {publishingDescription}
                    onChangeText = {(text) => setPublishingDescription(text)}
                    multiline
                />

                <Text>Photos</Text>
                <Text>TO COME</Text>

                <Button 
                    title = "Publish"
                />
                <Toast />
            </ScrollView>
        </TouchableWithoutFeedback>
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
        borderWith: 10,
        margin: 10
    }
})