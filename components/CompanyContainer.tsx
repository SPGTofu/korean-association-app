import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const CompanyContainer = () => {
    const [businessName, setBusinessName] = useState('Business Name');
    const [information, setInformation] = useState('Test Information');
    const [contact, setContact] = useState('Contact Info');
    const [location, setLocation] = useState('Location');

    return (
        <View style = {styles.container}> 
            <Text style = {styles.infoText}>{businessName}</Text>
            <Image />
            <Text style = {styles.infoText}>{information}</Text>
            <Text style = {styles.infoText}>{contact}</Text>
            <Text style = {styles.infoText}>{location}</Text>
        </View>
    );


}

const styles = StyleSheet.create({
    container: {
        height : 200,
        width : 150,
        padding : 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        margin: 4,
        marginTop: 8
    },
    infoText: {
        fontSize: 12,
        color: '#333',
    }
});

export default CompanyContainer;

