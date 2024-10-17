import { useTheme } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Touchable } from 'react-native';
import { Switch } from 'react-native-gesture-handler';
import { ThemeContext } from '../contexts/ThemeContext';
import LanguageButton from '../settings-components/LanguageButton';
import { UserContext } from '../contexts/UserContext';
import { doSignOut } from '../auth';
import AccountData from '../settings-components/AccountData';
import { handleCreateToast } from '../settings-components/Toast';

export default function SettingsScreen({ navigation }) {
    const {theme, setTheme} = useContext(ThemeContext);
    const { colors } = useTheme();
    const [language, setLanguage] = useState('english');
    const { user, setUser } = useContext(UserContext);
    const changeLanguage = (newLang) => {
        setLanguage(newLang);
    }

    const handleSignOut = () => {
        if (user) {
            doSignOut();
            setUser(null);
        }
        handleCreateToast('success', 'Signed Out', 'bottom');
    }
    return (
        <View style = {styles.container}>
            <View style = {styles.viewBlock}>
                <Text style = {{color: colors.text, fontSize: 20}}>Dark Theme</Text>
                <Switch value = {theme == 'Light' ? false : true}
                        onChange = {() => {
                            setTheme(theme == 'Light' ? 'Dark' : 'Light');
                        }}
                /> 
            </View>
            <View style = {styles.viewBlock}>
                <Text style = {{color: colors.text, fontSize: 20}}>Language</Text>
                <View style = {styles.viewBlock}>
                    <LanguageButton 
                        title = 'English'
                        language = {language}
                        changeLanguage = {changeLanguage}
                    />
                    <LanguageButton 
                        title = 'Korean'
                        language = {language}
                        changeLanguage = {changeLanguage}
                    />
                </View>
            </View>
            {user ? (<>
                        <AccountData navigation = {navigation} />
                        <View style = {styles.signWrap}>
                            <TouchableOpacity style = {styles.button} onPress={() => handleSignOut()}>
                                <Text style = {[styles.signText, {color: colors.text}]}>Log Out</Text>
                            </TouchableOpacity>
                        </View>
                    </>) : 
                    (<View style = {styles.signWrap}>
                        <TouchableOpacity style = {styles.button} onPress={() => navigation.navigate('SignPage')}>
                            <Text style = {[ styles.signText, {color: colors.text} ]}>Sign In</Text>
                        </TouchableOpacity> 
                     </View>
                    )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    viewBlock: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        width: 100
    },
    signWrap: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    signText: {
        fontSize: 18,
        fontWeight: '500',
    }
})