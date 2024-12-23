import React, { useContext, useEffect, useState } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { getPendingImageFromStorage } from "../storagecalls";
import { useTheme } from "@react-navigation/native";

export default function ReviewPageCard(props) {
    const { colors } = useTheme();
    const { navigation, data } = props;
    const [firstImage, setFirstImage] = useState(null);

    useEffect(() => {
        const fetchFirstImage = async () => {
            if (data?.photos?.[0]) {
                try {
                    const firstImageUrl = await getPendingImageFromStorage(data.name, data.photos[0]);
                    setFirstImage(firstImageUrl);
                } catch (error) {
                    console.error("Error fetching first image: ", error);
                }
            }
        }
        fetchFirstImage();
        console.log('using effect in ReviewPageCard');
    }, [data]);

    return (
        <TouchableOpacity onPress = {() => navigation.navigate('PendingBusinessPage', { businessData: data })}>
            <View  style = {[{borderColor: colors.text}, styles.cardContainer]}>
                <Image
                    source = {{ uri: firstImage }}
                    style = {styles.imageContainer}
                />
                <View style = {styles.textContainer}>
                    <Text style = {{color: 'black', fontSize: 20, fontWeight: "600"}} >
                        {data? data.name : "undefined"}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        padding: 0,
        borderWidth: 1,
        width: '90%',
        height: 220,
        margin: '5%',
        marginVertical: '3%',
        borderRadius: 8,
    },
    imageContainer: {
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        height: '85%',
        width: '100%',
        resizeMode: 'cover' 
    },
    textContainer: {
        flex: 1,
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f4'
    }
})