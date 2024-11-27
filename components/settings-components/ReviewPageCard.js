import { useTheme } from "@react-navigation/native";
import React from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
export default function ReviewPageCard(props) {
    const { colors } = useTheme();
    const data = props.data;

    return (
        <TouchableOpacity>
            <View  style = {[{borderColor: colors.text}, styles.cardContainer]}>
                <Image

                />
                <View>
                    <Text>
                        {data? data.name : "undefined"}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        padding: 10,
        borderWidth: 1,
        width: '90%',
        height: 220,
        margin: '5%',
        marginVertical: '3%',
        borderRadius: 8
    }
})