import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";

export default function BusinessInfoScreen({ route }) {
    const { businessData } = route.params;
    const { colors } = useTheme();

    return (
        <View style = {{ margin: 12}}>
            <Text style = {[{color: colors.text}, styles.title]}>{businessData.name}</Text>
            <Text style = {[{color: colors.text}, styles.tag]}>{businessData.description}</Text>
            <Text style = {[{color: colors.text}, styles.desc]}>Spot for description</Text>
            <Text style = {[{color: colors.text}, styles.desc]}>{businessData.address}</Text>
            <Text style = {[{color: colors.text}, styles.desc]}>Spot for location</Text>
            <Text style = {[{color: colors.text}, styles.desc]}>{businessData.contact}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 32,
        margin: 4
    },
    tag: {
        fontSize: 24,
        margin: 4
    },
    desc: {
        fontSize: 16,
        margin: 4
    }
})
