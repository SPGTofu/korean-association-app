import { View, Text, TouchableOpacity, StyleSheet, Touchable } from 'react-native';
import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useTheme } from '@react-navigation/native';
import { checkIfUserIsAdmin } from '../dbcalls';

export default function AccountData({ navigation }) {
    const { user } = useContext(UserContext);
    const { colors } = useTheme();
    const isAdmin = checkIfUserIsAdmin(user);
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
            {isAdmin ? (<>
                            <View style = {[{borderBottomWidth: 1, borderBottomColor: colors.text}, styles.button]}>
                                <TouchableOpacity onPress = {() => navigation.navigate('ReviewPage')}>
                                    <Text style = {[{color: colors.text}, styles.text]}>Pending Businesses</Text>
                                </TouchableOpacity>
                            </View>
                        </>) :
                        (null)
            }
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