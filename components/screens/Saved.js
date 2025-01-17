import React, { useContext, useEffect, useState } from 'react';``
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getSavedBusinessesOfUser } from '../dbcalls';
import { UserContext } from "../contexts/UserContext";
import SavedBusinessImage from '../settings-components/SavedBusinessImage';
import { useTheme } from '@react-navigation/native';

export default function Saved({ navigation }) {
    const { user } = useContext(UserContext);
    const [userSavedList, setUserSavedList] = useState([]);
    const { colors } = useTheme();

    useEffect(() => {
        const fetchSavedBusiness = async () => {
            const savedBusinesses = await getSavedBusinessesOfUser(user);
            setUserSavedList(savedBusinesses || []);
        };

        fetchSavedBusiness();
    }, [user]);

    const navigateToBusinessInHomeTab = (business) => {
        navigation.navigate('Home', {
            screen: 'InformationScreen',
            params: {businessData: business}
        });
    }

    return (
        <ScrollView>
            <Text style = {[styles.title, {color: colors.text}]}>Saved Businesses</Text>
            {userSavedList?.length > 0 ? 
                userSavedList.map((business, index) => {
                    if (business == null) {
                        return null;
                    }

                    return (          
                        <TouchableOpacity 
                            key = {index}
                            style = {[styles.container, {borderColor: colors.text}]}
                            onPress = {() => navigateToBusinessInHomeTab(business)}
                        > 
                            <View style = {styles.view}>
                                <SavedBusinessImage 
                                    business = {business}
                                    style = {styles.image}
                                />
                                <Text style = {[styles.text]}>
                                    {business?.name || "Business Unavailable"}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )
                })

                : <Text style = {[styles.noBusinessText, {color: colors.text}]}>
                    You have no businesses saved. Try saving one!
                  </Text>
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 26,
        textAlign: 'center',
        margin: 10,
        fontWeight: '600'
    },
    noBusinessText: {
        fontSize: 20,
        textAlign: 'center',
        margin: 4,
        fontWeight: '400',
        marginHorizontal: 20
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    view: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'top',
        width: '98%',
        height: 230,
        borderRadius: 8,
        backgroundColor: '#f4f4f4',
        margin: 4
    },
    image: {
        height: 200,
        width: '100%',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        backgroundColor: 'black',
        resizeMode: 'cover'
    },
    text: {
        fontSize: 20,
        padding: 4,
        fontWeight: 600,
    },
});