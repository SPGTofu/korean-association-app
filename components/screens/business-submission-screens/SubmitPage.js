import { useTheme } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SubmitPageStackScreenContext } from "../../contexts/SubmitPageStackScreenContext";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import DropDownPicker from "react-native-dropdown-picker";

export default function SubmitPage() {
    const { businessData, setBusinessData } = useContext(SubmitPageStackScreenContext);
    const { colors } = useTheme();
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
    
    // wrapper function for changing businessData's type
    const handleChangeBusinessType = (type) => {
        setBusinessData((prevData) => ({
            ...prevData,
            type: type
        }));
    }

    return (
        <TouchableWithoutFeedback onPress = {() => Keyboard.dismiss()}>
            <ScrollView
                nestedScrollEnabled = {true}
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
                    placeholder = 'Business Description (300 characters)'
                    placeholderTextColor = 'gray'
                    onChangeText = {(text) => setBusinessData((prevData) => ({
                        ...prevData,
                        businessDescription: text
                    }))}
                    multiline
                    numberOfLines = {5}
                    maxLength = {300}
                />
                <View>
                    <DropDownPicker 
                        open = {dropDownOpen}
                        listMode = 'SCROLLVIEW'
                        setOpen = {setDropDownOpen}
                        items = {dropDownItems}
                        multiple = {false}
                        value = {businessData.type}
                        setValue = {(callback) => {
                            const value = callback();
                            handleChangeBusinessType(value);
                        }}
                        style = {{ width: '80%', margin: 8, backgroundColor: '#f4f4f4'}}
                        contentContainerStyle = {{justifyContent: 'center', alignItems: 'center'}}
                        dropDownContainerStyle = {{backgroundColor: '#f4f4f4', width: '82%'}}
                        labelStyle = {{color: colors.text}}
                    />
                </View>
                
                <View style = {{width: '40%'}}> 
                    <BouncyCheckbox 
                        isChecked = {businessData.isOwner}
                        text = "I am the owner"
                        unFillColor = 'transparent'
                        fillColor = '#EF5A6F'
                        textStyle = {{color: colors.text, textDecorationLine: "none"}}
                        onPress = {() => {
                            setBusinessData((prevData) => ({
                                ...prevData,
                                isOwner: !prevData.isOwner
                            }))
                        }}
                    />
                </View>

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