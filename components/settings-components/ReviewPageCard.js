import { NavigationContext, useTheme } from "@react-navigation/native";
import React, { useContext } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import noImageIcon from "../../assets/no-image-icon.jpg"

export default function ReviewPageCard(props) {
    const { colors } = useTheme();
    const { navigation, data } = props;

    return (
        <TouchableOpacity onPress = {() => navigation.navigate('PendingBusinessPage', { businessData: data })}>
            <View  style = {[{borderColor: colors.text}, styles.cardContainer]}>
                <Image
                    source = {noImageIcon}
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