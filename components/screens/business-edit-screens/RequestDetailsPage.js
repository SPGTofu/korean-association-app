import { useEffect, useState } from "react";
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getBusinessNameFromDatabaseUsingID } from "../../dbcalls";
import { useTheme } from "@react-navigation/native";
import { getBusinessEditImage } from "../../storagecalls";

const screenWidth = Dimensions.get("window").width;

export default function RequestDetailsPage({ navigation, route }) {
    const { requestData } = route.params;
    const { colors } = useTheme();

    const [businessName, setBusinessName] = useState("");
    const [images, setImages] = useState([]);
    useEffect(() => {
        console.log('using effect1  in RequestDetailsPage');

        // fetch name
        const fetchBusinessName = async () => {
            const name = await getBusinessNameFromDatabaseUsingID(requestData.businessID);
            setBusinessName(name);
        }

        // fetch images
        const fetchImages = async () => {
            const tempArrayOfImages = [];
            for (const imageName of requestData.images) {
                const url = await getBusinessEditImage(requestData.id, imageName);
                if (url != null) {
                    tempArrayOfImages.push(url);
                } else {
                    console.error('url was null');
                }
            };
            setImages(tempArrayOfImages);
        };

        fetchBusinessName();
        fetchImages();
    }, []);

    const handleNavigatetoEditBusinessInfoPage = () => {
        
        navigation.navigate("EditBusinessInfoPage", {
            images: images,
            businessID: requestData.businessID,
            publisher: requestData.publisher
        });
    }

    return (
        <ScrollView
            contentContainerStyle = {styles.container}
        >
            <Text style = {[styles.title, {color: colors.text}]}>
                Business: {businessName}
            </Text>
            
            <View style = {styles.container}>
                <Text style = {[styles.text, {color: colors.text}]}>
                    From: {requestData.publisher.userName}
                </Text>
                <Text style = {[styles.text, {color: colors.text}]}>
                    {requestData.publisher.email}
                </Text>
            </View>

            <View style = {[styles.container, {margin: 12}]}>
                <Text style = {[styles.header, {color: colors.text, margin: 4}]}>
                    Review Suggestion
                </Text>
                <TextInput 
                    style = {[
                        styles.descriptionText, 
                        {color: colors.text, borderColor: colors.text}
                    ]}
                    multiline
                    editable = {false}
                    value = {requestData.editDescription}
                />
            </View>

            {images.length > 0 && 
                <FlatList 
                    horizontal
                    data = {images}
                    keyExtractor = {(item) => item}
                    style = {styles.imageWrapper}
                    renderItem = {({ item }) => {
                        return (
                            <Image 
                                source = {{uri: item}}
                                style = {styles.image}
                            />
                        )
                    }}
                />
            }
            
            <TouchableOpacity 
                style = {styles.updateWrapper}
                onPress = {() => handleNavigatetoEditBusinessInfoPage()}
            >
                <Text style = {styles.text}>
                    Update
                </Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4
    },
    title: {
        fontSize: 28,
        fontWeight: 600
    },
    header: {
        fontSize: 20,
        fontWeight: 500
    },
    text: {
        fontSize: 16,
        fontWeight: 400
    },
    descriptionText: {
        fontSize: 16,
        borderWidth: 1,
        width: 280,
        height: 200,
        padding: 4,
        borderRadius: 8
    },
    updateWrapper: {
        backgroundColor: '#BFE3B4',
        height: 40,
        width: 110,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        margin: 4
    },
    imageWrapper: {
        height: 240,
        width: '99%',
        margin: 4
    },
    image: {
        height: 240,
        width: screenWidth
    }
});