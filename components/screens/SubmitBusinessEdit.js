import { useTheme } from "@react-navigation/native";
import { Button, Dimensions, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import CopyrightText from "../other-components/CopyrightText";
import DraggableFlatList from "react-native-draggable-flatlist";
import { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';

const width = Dimensions.get("window").width;

export default function SubmitBusinessEdit({ business }) {
    const businessSelected = business? true : false;
    const { colors } = useTheme();
    const [images, setImages] = useState([]);

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
                style = {[styles.textInput, {borderColor: colors.text}]}
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
                style = {[styles.textInput, {borderColor: colors.text}]}
            />

            <Text style = {[styles.inputHeader, {color: colors.text}]}>
                What Should Be Edited?
            </Text>

            <TextInput 
                multiline
                placeholder = 'Provide any suggestions or edits'
                placeholderTextColor = 'gray'
                style = {[styles.descriptionInput, {borderColor: colors.text}]}
            />

            <Button
                title = 'Add Images (Optional)'
                onPress = {() => handleGetImages()}
            />
            <FlatList 
                horizontal
                data = {images}
                style = {styles.imageWrapper}
                contentContainerStyle = {styles.imageContainer}
                keyExtractor = {(item) => item}
                renderItem = {({item}) => {
                    return (
                        <Image
                            resizeMode = 'cover'
                            source = {{uri: item}}
                            style = {styles.image}
                        />
                    )
                }}
            />
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
        width: width || 300
    },
    imageWrapper: {
        height: 240,
        width: width || 300,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})