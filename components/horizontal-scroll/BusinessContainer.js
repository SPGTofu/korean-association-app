import { NavigationContext } from '@react-navigation/native';
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function BusinessContainer({ businessData }) {
    const navigation = useContext(NavigationContext);
    const businessID = businessData.docID;
    return (
        <TouchableOpacity onPress = {() => navigation.navigate('InformationScreen', { businessID })}>
            <View style = {styles.container}> 
                <Image
                    source = {{uri: businessData?.firstImage || null}}
                    style = {styles.image}
                />
                <View style = {styles.textWrapper}>
                    <Text 
                        style = {styles.infoText}
                        numberOfLines = {1}
                        adjustsFontSizeToFit
                    >
                        {businessData?.name || 'Business Name'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    image: {
        height: 250,
        width: 340,
        resizeMode: 'cover',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomWidth: 1
    },
    container: {
        height : 280,
        width : 340,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        margin: 4,
        marginTop: 8,
        borderWidth: 1,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 16,
        color: '#333',
        fontWeight: 500,
        margin: 4
    },
    textWrapper: {
        height: 30,
        width: 340,
        justifyContent: 'center',
        alignItems: 'center',
    }
});