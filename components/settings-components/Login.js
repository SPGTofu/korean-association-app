import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import { SignPageContext } from '../contexts/SignPageContext';
import { useTheme } from '@react-navigation/native';
import { doSignInWithEmailAndPassword } from '../auth';
import Toast from 'react-native-toast-message';

export default function Login({ handleCreateToast, navigation }) {
    const { setSignPage } = useContext(SignPageContext);
    const { colors } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setLoading(true);
            if (email == '') {
                handleCreateToast('error', 'Please enter an email', 'bottom');
                setLoading(false);
                return;
            }
            if (password == '') {
                handleCreateToast('error', 'Please enter a password', 'bottom');
                setLoading(false);
                return;
            }
            await doSignInWithEmailAndPassword(email, password);
            setLoading(false);
            setEmail('');
            setPassword('');
            handleCreateToast('success', 'Logged In', 'bottom');
            navigation.goBack();
        } catch (error) {
            console.log(error);
            handleCreateToast('error', 'Invalid email or password', 'bottom');
            setLoading(false);
        }
    }

    return (
        <TouchableWithoutFeedback onPress = {() => Keyboard.dismiss()}>
            <View style = {styles.container}>
                <TextInput 
                    placeholder = 'Email'
                    placeholderTextColor = {colors.text}
                    style = {[styles.inputBox, {borderColor: colors.text, color: colors.text}]}
                    onChangeText = {(text) => setEmail(text)}
                />
                <TextInput 
                    placeholder = 'Password'
                    placeholderTextColor = {colors.text}
                    secureTextEntry = {true}
                    style = {[styles.inputBox, {borderColor: colors.text, color: colors.text}]}
                    onChangeText = {(text) => setPassword(text)}
                />
                <TouchableOpacity onPress = {() => setSignPage('Forgot Password')} style = {styles.forgotButton}>
                    <Text style = {styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.loginButton} onPress = {handleLogin}> 
                    <Text style = {{fontSize: 18, color: 'white'}}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.createButton} onPress = {() => setSignPage('Sign Up')}>
                    <Text style = {{color: '#536493', fontSize: 18}}>Create Account</Text>
                </TouchableOpacity>
                {loading && <ActivityIndicator size = 'small' color = {colors.text} />}
                <Toast />
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputBox: {
        height: 60,
        width: 300,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        margin: 10,
    },
    loginButton: {
        backgroundColor: '#536493',
        borderRadius: 10,
        padding: 10,
        margin: 10,
        height: 50,
        width: 110,
        justifyContent: 'center',
        alignItems: 'center',
    },
    forgotButton: {
        alignItems: 'center',
        width: 300,
        margin: 2,
        marginBottom: 20,
        alignItems: 'left',
    },
    createButton: {
        padding: 10,
        height: 50,
        width: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    forgotText: {
        color: '#536493',
        fontSize: 12
    }
});