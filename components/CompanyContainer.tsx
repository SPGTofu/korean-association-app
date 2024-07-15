import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CompanyContainer = () => {
    const [information, setInformation] = useState('Test Information');

    return (
        <View style = {styles.container}> 
            <Text style = {styles.infoText}>{information}</Text>
        </View>
    );


}

const styles = StyleSheet.create({
    container: {
        height : 300,
        width : 150,
        padding : 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        margin: 20,
    },
    infoText: {
        fontSize: 16,
        color: '#333',
    }
});

export default CompanyContainer;

