import { useTheme } from "@react-navigation/native";
import { useContext } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SubmitPageStackScreenContext } from "../contexts/SubmitPageStackScreenContext";

export default function SubmitPage() {
    const { setBusinessData } = useContext(SubmitPageStackScreenContext);
    const { colors } = useTheme();
    
    return (
        <TouchableWithoutFeedback onPress = {() => Keyboard.dismiss()}>
            <KeyboardAvoidingView
                behavior = {Platform.OS === 'ios' ? 'padding' : 'height'}
                style = {{flex: 1}}
                keyboardVerticalOffset = '90'
            >
                <ScrollView
                    contentContainerStyle = {styles.container}
                >
                    <Text style = {[styles.header, {color: colors.text}]}>Provide Business Details</Text>

                    <TextInput
                        style = {[styles.inputBox, {borderColor: colors.text, color: colors.text}]}
                        placeholder = 'Business Name'
                        placeholderTextColor = 'gray'
                        onChangeText = {(text) => setBusinessData((prevData) => ({
                            ...prevData,
                            businessName: text
                        }))}
                    />

                    <TextInput
                        style = {[styles.inputBox, {borderColor: colors.text, color: colors.text}]}
                        placeholder = 'Business Phone Number'
                        placeholderTextColor = 'gray'
                        onChangeText = {(text) => setBusinessData((prevData) => ({
                            ...prevData,
                            businessPhoneNumber: text
                        }))}                    
                    />

                    <TextInput
                        style = {[styles.inputBox, {borderColor: colors.text, color: colors.text}]}
                        placeholder = 'Business Address'
                        placeholderTextColor = 'gray'
                        onChangeText = {(text) => setBusinessData((prevData) => ({
                            ...prevData,
                            businessAddress: text
                        }))}                    
                    />

                    <TextInput
                        style = {[styles.descriptionBox, {borderColor: colors.text, color: colors.text}]}
                        placeholder = 'Business Description (160 characters)'
                        placeholderTextColor = 'gray'
                        onChangeText = {(text) => setBusinessData((prevData) => ({
                            ...prevData,
                            businessDescription: text
                        }))}
                        multiline
                        numberOfLines = {5}
                        maxLength = {160}
                    />

                    <TextInput
                        style = {[styles.inputBox, {borderColor: colors.text, color: colors.text}]}
                        placeholder = 'Website Link (Optional)'
                        placeholderTextColor = 'gray'
                        onChangeText = {(text) => setBusinessData((prevData) => ({
                            ...prevData,
                            businessWebsite: text
                        }))}                    
                    />

                    <TextInput
                        style = {[styles.inputBox, {borderColor: colors.text, color: colors.text}]}
                        placeholder = 'Instagram Link or Name (Optional)'
                        placeholderTextColor = 'gray'
                        onChangeText = {(text) => setBusinessData((prevData) => ({
                            ...prevData,
                            instagram: text
                        }))}                    
                    />

                    <TextInput
                        style = {[styles.inputBox, {borderColor: colors.text, color: colors.text}]}
                        placeholder = 'Facebook Link or Name (Optional)'
                        placeholderTextColor = 'gray'
                        onChangeText = {(text) => setBusinessData((prevData) => ({
                            ...prevData,
                            facebook: text
                        }))}                    
                    />

                    <TextInput
                        style = {[styles.inputBox, 
                                 {borderColor: colors.text, 
                                  color: colors.text, 
                                }]}
                        placeholder = 'Yelp Link or Name (Optional)'
                        placeholderTextColor = 'gray'
                        onChangeText = {(text) => setBusinessData((prevData) => ({
                            ...prevData,
                            yelp: text
                        }))}                    
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        margin: 8,
        fontWeight: '500'
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
})