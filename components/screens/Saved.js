import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function Saved() {
    return (
        <View>
            <Text style = {styles.title}>Saved Businesses</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 28,
        textAlign: 'center',
        margin: 10,
        fontWeight: '500'
    }
});