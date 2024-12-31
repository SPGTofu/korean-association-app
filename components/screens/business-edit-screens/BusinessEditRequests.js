import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { getBusinessEditRequests } from "../../dbcalls";
import { useTheme } from "@react-navigation/native";

export default function BusienssEditRequests({ navigation }) {
    const { colors } = useTheme();
    const [arrayOfEdits, setArrayOfEdits] = useState([]);
    useEffect(() => {
        console.log('using effect in businessEditRequests');
        const fetchBusinessEditRequests = async () => {
            const requests = await getBusinessEditRequests();
            setArrayOfEdits(requests);
        }
        fetchBusinessEditRequests();
    }, [])

    return (
        <ScrollView contentContainerStyle = {styles.container}>
            {arrayOfEdits.map((request) => (
                <TouchableOpacity 
                    key = {request.id}
                    style = {[styles.requestContainer, {borderColor: colors.text}]}
                    onPress = {() => navigation.navigate("RequestDetailsPage", {requestData: request})}
                >
                    <Text 
                        style = {[styles.text, {color: colors.text}]}
                        numberOfLines = {1}
                    >
                        From: {request.publisher.userName}
                    </Text>
                    <Text 
                        numberOfLines = {1}
                        style = {[styles.text, {color: colors.text}]}
                    >
                        Description: {request.editDescription}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({ 
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    requestContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        margin: 8,
        borderWidth: 1,
        borderRadius: 6,
        height: 60,
        width: 320,
        padding: 8
    },
    text: {
        fontSize: 18,
        fontWeight: 500,
    }
});