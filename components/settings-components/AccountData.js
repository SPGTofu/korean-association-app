import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useTheme } from '@react-navigation/native';
export default function AccountData({ navigation }) {
    const { user } = useContext(UserContext);
    const { colors } = useTheme();
    return (
        <View style = {styles.container}>
            <View style = {[{borderColor: colors.text, borderTopWidth: 1}, styles.button]}>
                <TouchableOpacity onPress = {() => navigation.navigate('AccountSettings')}>
                    <Text style = {[{color: colors.text}, styles.text]}>Account</Text>
                </TouchableOpacity>
            </View>
            <View style = {[{borderBottomWidth: 1, borderBottomColor: colors.text}, styles.button]}>
                <TouchableOpacity onPress = {() => navigation.navigate('SavedBusinesses')}>
                    <Text style = {[{color: colors.text}, styles.text]}>Saved</Text>
                </TouchableOpacity>
            </View>
            <View style = {[{borderBottomWidth: 1, borderBottomColor: colors.text}, styles.button]}>
                <TouchableOpacity onPress = {() => navigation.navigate('SubmitPage')}>
                    <Text style = {[{color: colors.text}, styles.text]}>Submit a New Business</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left'
    },
    text: {
        fontSize: 20,
        padding: 10,
    },
    button: {
        borderBottomWidth: 1,
        width: '100%'
    }
});