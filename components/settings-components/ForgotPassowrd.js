import { useTheme } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { ActivityIndicator, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { doSendPasswordResetEmail } from '../auth';
import { SignPageContext } from '../contexts/SignPageContext';

export default function ForgotPassword({ handleCreateToast, navigation }) {
    const { colors } = useTheme();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { setSignPage } = useContext(SignPageContext);

    const handleSendResetPassword = async () => {
        try {
            setLoading(true);
            if (email == '') {
                handleCreateToast('error', 'Please enter an email', 'bottom');
                return;
            }
            await doSendPasswordResetEmail(email);
            setLoading(false);
            setEmail('');
            handleCreateToast('success', 'Email sent', 'bottom');
            setSignPage('Login');
        }
        catch (error) {
            console.error(error);
            handleCreateToast('error', 'Error sending email. Please try again.', 'bottom');
        }
    }

    return (
        <TouchableWithoutFeedback onPress = {() => Keyboard.dismiss()}>
            <View style = {styles.container}>
                <Text style = {[styles.title, {color: colors.text}]}> Reset Your Password</Text>
                <Text style = {[styles.text, {color: colors.text}]}>Enter your email and we'll send you a link to reset your password</Text>
                <TextInput 
                    placeholder = 'Email'
                    placeholderTextColor = {colors.text}
                    style = {[styles.inputBox, {borderColor: colors.text, color: colors.text}]}
                    onChangeText = {(text) => setEmail(text)}
                />
                <TouchableOpacity style = {styles.button} onPress = {() => handleSendResetPassword()}>
                    <Text>Send Link</Text>
                </TouchableOpacity>
                {loading && <ActivityIndicator size = 'small' color = {colors.text} />}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 14,
        margin: 20,
        padding: 10,
        marginTop: 0,
        marginBottom: 40
    },
    inputBox: {
        height: 60,
        width: 300,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        margin: 10,
    },
    button: {
        backgroundColor: 'lightgreen',
        height: 50,
        width: 110,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        margin: 10,
        padding: 10,
        borderWidth: 1
    }
});