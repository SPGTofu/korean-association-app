import React, { useCallback, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { SignPageContext } from '../contexts/SignPageContext';
import Login from '../settings-components/Login';
import SignUp from '../settings-components/SignUp';
import { useFocusEffect } from '@react-navigation/native';
import ForgotPassword from '../settings-components/ForgotPassword';
import { handleCreateToast } from '../settings-components/Toast';

export default function LoginScreen({ navigation }) {
    const { signPage, setSignPage } = useContext(SignPageContext);
    
    useFocusEffect(
        useCallback(() => {
            const backPage = () => {
                setSignPage('Login');
            };

            return () => backPage();
        }, [])
    );

    return (
        <View style = {styles.container}>
            {signPage == 'Login' ? (<Login handleCreateToast = {handleCreateToast} navigation = {navigation}/>) :
                 signPage == 'Sign Up' ? (<SignUp handleCreateToast = {handleCreateToast} navigation = {navigation}/>) : 
                 (<ForgotPassword handleCreateToast = {handleCreateToast} navigation = {navigation}/>)
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    }
})