import { useTheme } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { ActivityIndicator, ScrollView, StyleSheet, Text } from "react-native";
import ReviewPageCard from "../settings-components/ReviewPageCard";
import { returnBusinessRequestCollectionRef, subscribeToPendingBusinesses } from "../dbcalls";

export default function ReviewPage({navigation}) {
    const { colors } = useTheme();
    const [arrayOfPendingBusinesses, setArrayOfPendingBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = subscribeToPendingBusinesses(setArrayOfPendingBusinesses);

        setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => unsub();
    }, []);

    useEffect(() => { 
        // testing purposes
        // console.log(arrayOfPendingBusinesses);
    }, [arrayOfPendingBusinesses])

    if (loading) {
        return (
            <ScrollView contentContainerStyle = {styles.loadingPageContainer}>
                <ActivityIndicator style = {styles.loader}/>
                <Text style = {{ marginTop: 20, size: 12, color: colors.text}}>Loading Businesses</Text>

            </ScrollView>
        );
    }

    return (
        <ScrollView>
            {arrayOfPendingBusinesses.length > 0? (
                <>
                    <Text style = {[styles.textContainer, {color: colors.text}]}>
                        Pending Businesses:
                    </Text>
                    {arrayOfPendingBusinesses.map((business) => (
                        <ReviewPageCard 
                            key = {business.docID}
                            data = {business}
                            navigation = {navigation}
                        />
                    ))}
                </>) : 
                (<Text style = {[styles.textContainer, {color: colors.text}]}>
                            No New Pages to Review
                </Text>)
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    loadingPageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    loader: {
        size: 'large'
    },
    textContainer: {
        fontSize: 18, 
        fontWeight: 'bold', 
        textAlign: 'center',
        margin: 10,
        marginBottom: 0
    }
});