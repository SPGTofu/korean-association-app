import { useTheme } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function AccountSettings() {
    const { colors } = useTheme();
    return (
        <View style = {styles.container}>
            <Text style = {[styles.comingSoonText, {color: colors.text}]}>
                Coming Soon!
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    comingSoonText: {
        fontSize: 20,
        margin: 20,
        fontWeight: 500
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})